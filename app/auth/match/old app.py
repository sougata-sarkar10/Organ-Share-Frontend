import streamlit as st
import pandas as pd
import numpy as np
import pickle

# Assume the predict_match_success function is in a separate file named 'prediction_model.py'
# For this example, we will include the function here to make it a single, runnable script.

def predict_match_success(data_point):
    """
    Predicts the probability of a successful donor-recipient match.
    """
    try:
        with open("donor_match_model.pkl", "rb") as f:
            saved_objects = pickle.load(f)
            model = saved_objects["model"]
            ohe = saved_objects["ohe"]
            scaler = saved_objects["scaler"]
            feature_columns = saved_objects["feature_columns"]
    except FileNotFoundError:
        st.error("Error: 'donor_match_model.pkl' not found. Please ensure the model file is in the same directory.")
        return -1

    input_df = pd.DataFrame([data_point])
    numeric_cols = ["age_diff", "distance_km", "urgency", "hospital_transportation"]
    categorical_cols = ["bloodgroup_donor", "bloodgroup_recipient", "organ", "organ_tissue_type_donor"]

    input_df[numeric_cols] = input_df[numeric_cols].fillna(0)
    input_df[categorical_cols] = input_df[categorical_cols].fillna("Unknown")

    try:
        X_cat = ohe.transform(input_df[categorical_cols])
        encoded_cols = ohe.get_feature_names_out(categorical_cols)
        X_cat_df = pd.DataFrame(X_cat, columns=encoded_cols)

        X_num = scaler.transform(input_df[numeric_cols])
        X_num_df = pd.DataFrame(X_num, columns=numeric_cols)

        X_final = pd.concat([X_num_df, X_cat_df], axis=1)
        X_final = X_final.reindex(columns=feature_columns, fill_value=0)

        proba = model.predict_proba(X_final)[:, 1][0]
        return proba
    except Exception as e:
        st.error(f"An error occurred during prediction: {e}")
        return -1

# --- Streamlit UI Code ---

st.set_page_config(page_title="Donor-Recipient Match Predictor", layout="centered")

st.title("💖 Donor-Recipient Match Predictor")
st.markdown("Enter the details of a potential donor-recipient match to predict the probability of success.")

# Input Widgets
with st.container():
    st.header("Match Details")
    col1, col2 = st.columns(2)

    with col1:
        age_diff = st.slider("Age Difference (Years)", min_value=0, max_value=50, value=15)
        distance_km = st.number_input("Distance (km)", min_value=0, max_value=5000, value=500)
        urgency = st.radio("Urgency Level", options=[0, 1, 2], index=1, help="0: Low, 1: Medium, 2: High")
        hospital_transportation = st.checkbox("Requires Hospital Transportation", value=True)
        hospital_transportation = 1 if hospital_transportation else 0

    with col2:
        bloodgroup_donor = st.selectbox("Donor Blood Group", options=["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"])
        bloodgroup_recipient = st.selectbox("Recipient Blood Group", options=["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"])
        organ = st.selectbox("Organ", options=["Kidney", "Heart", "Liver", "Lungs"])
        organ_tissue_type_donor = st.selectbox("Donor Tissue Type", options=["HLA-A", "HLA-B", "HLA-C", "HLA-DR", "HLA-DQ"])

# Button to trigger prediction
if st.button("Predict Match Success", help="Click to get the prediction based on the entered data."):
    # Create the data point dictionary from user inputs
    data_point = {
        "age_diff": age_diff,
        "distance_km": distance_km,
        "urgency": urgency,
        "hospital_transportation": hospital_transportation,
        "bloodgroup_donor": bloodgroup_donor,
        "bloodgroup_recipient": bloodgroup_recipient,
        "organ": organ,
        "organ_tissue_type_donor": organ_tissue_type_donor
    }

    # Call the prediction function
    prediction = predict_match_success(data_point)

    # Display the result
    if prediction != -1:
        st.subheader("Prediction Result")
        st.progress(prediction)
        st.metric("Predicted Success Probability", f"{prediction * 100:.2f}%")
        
        if prediction > 0.7:
            st.success("This match has a high probability of success! 🎉")
        elif prediction > 0.4:
            st.warning("This match has a moderate probability of success. Consider other factors.")
        else:
            st.error("This match has a low probability of success. It might not be a good fit.")