from flask import Flask, render_template, request, jsonify
import pandas as pd
import pickle
from geopy.distance import geodesic
import numpy as np


from flask_cors import CORS
app = Flask(__name__)
CORS(app)


# Load model and donor data
with open("donor_match_model.pkl", "rb") as f:
    model_data = pickle.load(f)

model = model_data['model']
ohe = model_data['ohe']
scaler = model_data['scaler']
feature_columns = model_data['feature_columns']

donors_df = pd.read_csv("Doner_1000.csv")

# Coordinates for Indian states
state_coords = {
    # States
    'Andhra Pradesh': (14.7504, 78.5700), 'Arunachal Pradesh': (27.1004, 93.6166),
    'Assam': (26.7500, 94.2167), 'Bihar': (25.7854, 87.4800), 'Chhattisgarh': (22.0904, 82.1600),
    'Goa': (15.4920, 73.8180), 'Gujarat': (22.3094, 72.1362), 'Haryana': (29.0658, 76.0405),
    'Himachal Pradesh': (31.1000, 77.1666), 'Jharkhand': (23.8004, 86.4200), 'Karnataka': (12.5704, 76.9200),
    'Kerala': (8.9004, 76.5700), 'Madhya Pradesh': (21.3004, 76.1300), 'Maharashtra': (19.2502, 73.1602),
    'Manipur': (24.8000, 93.9500), 'Meghalaya': (25.5705, 91.8800), 'Mizoram': (23.7104, 92.7200),
    'Nagaland': (25.6670, 94.1166), 'Odisha': (19.8204, 85.9000), 'Punjab': (31.5200, 75.9800),
    'Rajasthan': (26.4500, 74.6400), 'Sikkim': (27.3333, 88.6166), 'Tamil Nadu': (12.9204, 79.1500),
    'Telangana': (17.1232, 79.2088), 'Tripura': (23.8354, 91.2800), 'Uttar Pradesh': (27.6000, 78.0500),
    'Uttarakhand': (30.3204, 78.0500), 'West Bengal': (22.5804, 88.3300),

    # Union Territories
    'Andaman and Nicobar Islands': (11.6670, 92.7360), 'Chandigarh': (30.7200, 76.7800),
    'Dadra and Nagar Haveli and Daman and Diu': (20.2666, 73.0166), 'Delhi': (28.6699, 77.2300),
    'Jammu and Kashmir': (34.3000, 74.4667), 'Ladakh': (34.1526, 77.5770), 'Lakshadweep': (10.5626, 72.6369),
    'Puducherry': (11.9350, 79.8300)
}

def get_distance(loc1, loc2):
    if loc1 not in state_coords or loc2 not in state_coords:
        return np.inf
    return geodesic(state_coords[loc1], state_coords[loc2]).km

@app.route("/")
def home():
    locations = sorted(list(state_coords.keys()))
    organs = sorted(donors_df['organ'].unique())
    tissue_types = sorted(donors_df['organ_tissue_type'].unique())
    return render_template("index.html", locations=locations, organs=organs, tissue_types=tissue_types)

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json
    receiver_age = int(data.get("age"))
    receiver_location = data.get("location")
    receiver_bloodgroup = data.get("bloodgroup")
    organ_needed = data.get("organ")
    receiver_tissue_type = data.get("tissue_type")
    receiver_urgency = int(data.get("urgency"))

    compatible_donors = donors_df[
        (donors_df['organ'] == organ_needed) &
        (donors_df['organ_tissue_type'] == receiver_tissue_type) &
        (donors_df['organ_health_score'] >= 40) &
        (abs(donors_df['age'] - receiver_age) <= 20)
    ].copy()
    print("Compatible donors before filtering:", compatible_donors.shape, flush=True)


    if compatible_donors.empty:
        return jsonify({"matches": []})

    distances = compatible_donors['location'].apply(lambda x: get_distance(x, receiver_location))
    mask_transport = ((compatible_donors['hospital_transportation'] == 1) | (distances <= 200))
    compatible_donors = compatible_donors[mask_transport]
    distances = distances[mask_transport]

    if compatible_donors.empty:
        return jsonify({"matches": []})

    compatible_donors['distance_km'] = distances

    # Features for ML model
    prediction_df = pd.DataFrame()
    prediction_df['age_diff'] = abs(compatible_donors['age'] - receiver_age)
    prediction_df['distance_km'] = compatible_donors['distance_km']
    prediction_df['urgency'] = receiver_urgency
    prediction_df['hospital_transportation'] = compatible_donors['hospital_transportation']
    prediction_df['bloodgroup_donor'] = compatible_donors['bloodgroup']
    prediction_df['bloodgroup_recipient'] = receiver_bloodgroup
    prediction_df['organ'] = organ_needed
    prediction_df['organ_tissue_type_donor'] = compatible_donors['organ_tissue_type']

    categorical_cols = ['bloodgroup_donor','bloodgroup_recipient','organ','organ_tissue_type_donor']
    numerical_cols = ['age_diff','distance_km','urgency','hospital_transportation']

    cat_encoded = ohe.transform(prediction_df[categorical_cols])
    num_scaled = scaler.transform(prediction_df[numerical_cols])

    features_encoded_df = pd.DataFrame(cat_encoded, columns=ohe.get_feature_names_out(categorical_cols), index=prediction_df.index)
    features_scaled_df = pd.DataFrame(num_scaled, columns=numerical_cols, index=prediction_df.index)

    final_features = pd.concat([features_scaled_df, features_encoded_df], axis=1)
    final_features = final_features[feature_columns]

    probabilities = model.predict_proba(final_features)[:, 1]
    compatible_donors['match_probability'] = probabilities

    matched = compatible_donors[compatible_donors['match_probability']>0.5].sort_values(by='match_probability', ascending=False)

    results = []
    for _, row in matched.iterrows():
        results.append({
            "donor_id": row['donerid'],
            "age": int(row['age']),
            "health_score": row['organ_health_score'],
            "match_probability": round(float(row['match_probability']),2),
            "hospital_name": row['hospital_name'],
            "email": row['gamil'],
            "location": row['location'],
            "hospital_transportation": int(row['hospital_transportation'])
        })

    return jsonify({"matches": results})

if __name__ == "__main__":
    app.run(debug=True)
