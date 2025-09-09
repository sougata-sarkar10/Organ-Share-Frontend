import pandas as pd
import numpy as np
import pickle

def predict_match_success(data_point):
    """
    Predicts the probability of a successful donor-recipient match.

    Args:
        data_point (dict): A dictionary containing the features for a
                           single donor-recipient match.
                           Example:
                           {
                               "age_diff": 15,
                               "distance_km": 500,
                               "urgency": 2,
                               "hospital_transportation": 1,
                               "bloodgroup_donor": "O+",
                               "bloodgroup_recipient": "A-",
                               "organ": "Kidney",
                               "organ_tissue_type_donor": "HLA-A"
                           }

    Returns:
        float: The predicted probability of a successful match (between 0 and 1).
    """
    try:
        
        with open("donor_match_model.pkl", "rb") as f:
            saved_objects = pickle.load(f)
            model = saved_objects["model"]
            ohe = saved_objects["ohe"]
            scaler = saved_objects["scaler"]
            feature_columns = saved_objects["feature_columns"]
    except FileNotFoundError:
        print("Error: 'donor_match_model.pkl' not found. Please run train_model.py first.")
        return -1

    
    input_df = pd.DataFrame([data_point])

    
    numeric_cols = ["age_diff", "distance_km", "urgency", "hospital_transportation"]
    categorical_cols = ["bloodgroup_donor", "bloodgroup_recipient", "organ", "organ_tissue_type_donor"]

    
    input_df[numeric_cols] = input_df[numeric_cols].fillna(0)
    input_df[categorical_cols] = input_df[categorical_cols].fillna("Unknown")


    X_cat = ohe.transform(input_df[categorical_cols])
    encoded_cols = ohe.get_feature_names_out(categorical_cols)
    X_cat_df = pd.DataFrame(X_cat, columns=encoded_cols)

    
    X_num = scaler.transform(input_df[numeric_cols])
    X_num_df = pd.DataFrame(X_num, columns=numeric_cols)


    X_final = pd.concat([X_num_df, X_cat_df], axis=1)
    

    X_final = X_final.reindex(columns=feature_columns, fill_value=0)

    
    proba = model.predict_proba(X_final)[:, 1][0]
    
    return proba

if __name__ == "__main__":
    
    new_match_data = {
        "age_diff": 15,
        "distance_km": 500,
        "urgency": 2,
        "hospital_transportation": 1,
        "bloodgroup_donor": "O+",
        "bloodgroup_recipient": "A-",
        "organ": "Kidney",
        "organ_tissue_type_donor": "HLA-A"
    }

    prediction = predict_match_success(new_match_data)
    
    if prediction != -1:
        print(f"The predicted probability of a successful match is: {prediction:.4f}")

   
    unlikely_match_data = {
        "age_diff": 25,
        "distance_km": 1500,
        "urgency": 0,
        "hospital_transportation": 0,
        "bloodgroup_donor": "O+",
        "bloodgroup_recipient": "B-",
        "organ": "Heart",
        "organ_tissue_type_donor": "HLA-B"
    }
    unlikely_prediction = predict_match_success(unlikely_match_data)
    
    if unlikely_prediction != -1:
        print(f"The predicted probability for an unlikely match is: {unlikely_prediction:.4f}")
