from flask import Flask, request, jsonify
import pandas as pd
import pickle
from geopy.distance import geodesic
import numpy as np

app = Flask(__name__)

# -------------------------
# Load Model and Data
# -------------------------
with open('donor_match_model.pkl', 'rb') as file:
    model_data = pickle.load(file)

model = model_data['model']
ohe = model_data['ohe']
scaler = model_data['scaler']
feature_columns = model_data['feature_columns']

donors_df = pd.read_csv('Doner_1000.csv')

state_coords = {
    'Andhra Pradesh': (16.5062, 80.648),
    'Arunachal Pradesh': (27.0844, 93.6053),
    'Assam': (26.1433, 91.7898),
    'Bihar': (25.5941, 85.1376),
    'Chhattisgarh': (21.2514, 81.6296),
    'Goa': (15.2993, 74.124),
    'Gujarat': (23.0225, 72.5714),
    'Haryana': (30.7333, 76.7794),
    'Himachal Pradesh': (31.1048, 77.1734),
    'Jharkhand': (23.6102, 85.2799),
    'Karnataka': (12.9716, 77.5946),
    'Kerala': (8.5241, 76.9366),
    'Madhya Pradesh': (23.2599, 77.4126),
    'Maharashtra': (19.076, 72.8777),
    'Manipur': (24.817, 93.9368),
    'Meghalaya': (25.5788, 91.8933),
    'Mizoram': (23.7271, 92.7176),
    'Nagaland': (25.6751, 94.1086),
    'Odisha': (20.2961, 85.8245),
    'Punjab': (30.901, 75.8573),
    'Rajasthan': (26.9124, 75.7873),
    'Sikkim': (27.3389, 88.6065),
    'Tamil Nadu': (11.0271, 78.6569),
    'Telangana': (17.385, 78.4867),
    'Tripura': (23.8315, 91.2868),
    'Uttar Pradesh': (26.8467, 80.9462),
    'Uttarakhand': (30.3165, 78.0322),
    'West Bengal': (22.5726, 88.3639),
    'Andaman and Nicobar Islands': (11.6234, 92.7265),
    'Chandigarh': (30.7333, 76.7794),
    'Dadra and Nagar Haveli and Daman and Diu': (20.4283, 72.8397),
    'Delhi': (28.7041, 77.1025),
    'Jammu and Kashmir': (34.0837, 74.7973),
    'Ladakh': (34.1526, 77.5771),
    'Lakshadweep': (10.5667, 72.6417),
    'Puducherry': (11.9416, 79.8083),
}

def get_distance(loc1, loc2):
    if loc1 not in state_coords or loc2 not in state_coords:
        return np.inf
    return geodesic(state_coords[loc1], state_coords[loc2]).km


# -------------------------
# API Endpoint
# -------------------------
@app.route('/find_match', methods=['POST'])
def find_match():
    """
    Expects JSON payload like:
    {
        "receiver_age": 40,
        "receiver_location": "Maharashtra",
        "receiver_bloodgroup": "O+",
        "organ_needed": "Kidney",
        "receiver_tissue_type": "Type1",
        "receiver_urgency": 1
    }
    """
    data = request.json

    receiver_age = data["receiver_age"]
    receiver_location = data["receiver_location"]
    receiver_bloodgroup = data["receiver_bloodgroup"]
    organ_needed = data["organ_needed"]
    receiver_tissue_type = data["receiver_tissue_type"]
    receiver_urgency = data["receiver_urgency"]

    # Filter compatible donors
    compatible_donors = donors_df[
        (donors_df['organ'] == organ_needed) &
        (donors_df['organ_tissue_type'] == receiver_tissue_type)
    ].copy()

    if compatible_donors.empty:
        return jsonify({"message": "No compatible donors found"}), 404

    prediction_df = pd.DataFrame()
    prediction_df['age_diff'] = abs(compatible_donors['age'] - receiver_age)
    prediction_df['distance_km'] = compatible_donors.apply(
        lambda row: get_distance(row['location'], receiver_location), axis=1
    )

    prediction_df['urgency'] = receiver_urgency
    prediction_df['hospital_transportation'] = compatible_donors['hospital_transportation']
    prediction_df['bloodgroup_donor'] = compatible_donors['bloodgroup']
    prediction_df['bloodgroup_recipient'] = receiver_bloodgroup
    prediction_df['organ'] = organ_needed
    prediction_df['organ_tissue_type_donor'] = compatible_donors['organ_tissue_type']

    categorical_cols = ['bloodgroup_donor', 'bloodgroup_recipient', 'organ', 'organ_tissue_type_donor']
    numerical_cols = ['age_diff', 'distance_km', 'urgency', 'hospital_transportation']

    cat_encoded = ohe.transform(prediction_df[categorical_cols])
    num_scaled = scaler.transform(prediction_df[numerical_cols])

    features_encoded_df = pd.DataFrame(cat_encoded, columns=ohe.get_feature_names_out(categorical_cols), index=prediction_df.index)
    features_scaled_df = pd.DataFrame(num_scaled, columns=numerical_cols, index=prediction_df.index)

    final_features = pd.concat([features_scaled_df, features_encoded_df], axis=1)
    final_features = final_features[feature_columns]

    probabilities = model.predict_proba(final_features)[:, 1]
    compatible_donors['match_probability'] = probabilities

    successful_matches = compatible_donors[compatible_donors['match_probability'] > 0.5].sort_values(
        by='match_probability', ascending=False
    )

    if successful_matches.empty:
        return jsonify({"message": "No suitable donor found"}), 404

    # Return top 5 matches
    top_donors = successful_matches[['donerid', 'age', 'location', 'match_probability']].head(5).to_dict(orient="records")
    return jsonify({"matches": top_donors})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
