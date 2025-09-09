import streamlit as st
import pandas as pd
import pickle
from geopy.distance import geodesic
import numpy as np



st.set_page_config(layout="wide", page_title="Organ Donor Match Predictor")


@st.cache_data
def load_data():
    """Loads the model, preprocessing objects and donor dataset."""
    try:
        with open('donor_match_model.pkl', 'rb') as file:
            model_data = pickle.load(file)
    except FileNotFoundError:
        st.error("Error: `donor_match_model.pkl` not found. Please ensure the model file is in the same directory as this script.")
        st.stop()

    try:
        donors_df = pd.read_csv('Doner_1000.csv')
    except FileNotFoundError:
        st.error("Error: `Doner_1000.csv` not found. Please ensure the donor data file is in the same directory.")
        st.stop()
        
    return model_data, donors_df

model_data, donors_df = load_data()
model = model_data['model']
ohe = model_data['ohe']
scaler = model_data['scaler']
feature_columns = model_data['feature_columns']



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
    'Dadra and Nagar Haveli': (20.27, 73.02),
    'Daman and Diu': (20.42, 72.83),
}




def get_distance(loc1, loc2):
    """Calculates the geodesic distance between two locations."""
   
    if loc1 not in state_coords or loc2 not in state_coords:
        return np.inf  
    return geodesic(state_coords[loc1], state_coords[loc2]).km



st.title(" Organ Donor Match Predictor")
st.markdown("This application predicts the availability of a compatible organ donor based on the receiver's medical information. Please fill in the details below.")

st.markdown("---")


col1, col2 = st.columns(2)

with col1:
    st.subheader("Receiver Information")
    receiver_age = st.number_input("Your Age", min_value=0, max_value=120, value=40, step=1)
    
    locations = sorted(list(state_coords.keys()))
    receiver_location = st.selectbox("Your Location", options=locations, index=locations.index('Maharashtra'))

    blood_groups = sorted(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
    receiver_bloodgroup = st.selectbox("Your Blood Group", options=blood_groups)

with col2:
    st.subheader("Required Organ Details")
    organ_options = sorted(donors_df['organ'].unique().tolist())
    organ_needed = st.selectbox("Organ Needed", options=organ_options)

    tissue_type_options = sorted(donors_df['organ_tissue_type'].unique().tolist())
    receiver_tissue_type = st.selectbox("Required Organ Tissue Type", options=tissue_type_options, help="This must match the donor's tissue type.")
    
    receiver_urgency = st.slider("Urgency Level", min_value=0, max_value=2, value=1, help="0: Low, 1: Medium, 2: High")



if st.button("Find a Donor", type="primary", use_container_width=True):
    with st.spinner('Analyzing donor database and running predictions...'):
        
       
        compatible_donors = donors_df[
            (donors_df['organ'] == organ_needed) &
            (donors_df['organ_tissue_type'] == receiver_tissue_type)
        ].copy()

        if compatible_donors.empty:
            st.warning(f"No donors found in the database for the required organ '{organ_needed}' and tissue type '{receiver_tissue_type}'.")
        else:
            
            prediction_df = pd.DataFrame()
            prediction_df['age_diff'] = abs(compatible_donors['age'] - receiver_age)
            prediction_df['distance_km'] = compatible_donors.apply(lambda row: get_distance(row['location'], receiver_location), axis=1)
            

            infinite_distance_mask = prediction_df['distance_km'] == np.inf
            if infinite_distance_mask.any():
                st.warning(f"Could not calculate distance for {infinite_distance_mask.sum()} donor(s) due to unknown locations. They will be excluded from matching.")
                compatible_donors = compatible_donors[~infinite_distance_mask]
                prediction_df = prediction_df[~infinite_distance_mask]

            if compatible_donors.empty:
                st.error("No donors with valid location data were found for the specified criteria.")
                st.stop()
            
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

            st.markdown("---")
            st.subheader("Prediction Results")

            if not successful_matches.empty:
                st.success(f"**Match Found!** We found **{len(successful_matches)}** potential donor(s) with a match probability greater than 50%.")
                
                
                display_df = successful_matches[['donerid', 'age', 'location', 'match_probability']].head(5)
                display_df.rename(columns={
                    'donerid': 'Donor ID', 'age': 'Donor Age',
                    'location': 'Donor Location', 'match_probability': 'Match Probability'
                }, inplace=True)
                
                st.write("Top 5 Potential Matches:")
                st.dataframe(display_df.style.format({'Match Probability': '{:.2%}'}), use_container_width=True)

            else:
                st.error("**No suitable donor found.**")
                highest_prob = compatible_donors['match_probability'].max()
                st.info(f"While no match exceeded the 50% probability threshold, the highest compatibility score found was **{highest_prob:.2%}**.")