import pandas as pd
from geopy.distance import geodesic


donors = pd.read_csv("Doner_1000.csv")
recipients = pd.read_csv("Receivers_1000.csv")


state_coords = {
    'Andhra Pradesh': (16.5062, 80.6480),
    'Arunachal Pradesh': (27.0844, 93.6053),
    'Assam': (26.1433, 91.7898),
    'Bihar': (25.5941, 85.1376),
    'Chhattisgarh': (21.2514, 81.6296),
    'Goa': (15.2993, 74.1240),
    'Gujarat': (23.0225, 72.5714),
    'Haryana': (30.7333, 76.7794),
    'Himachal Pradesh': (31.1048, 77.1734),
    'Jharkhand': (23.6102, 85.2799),
    'Karnataka': (12.9716, 77.5946),
    'Kerala': (8.5241, 76.9366),
    'Madhya Pradesh': (23.2599, 77.4126),
    'Maharashtra': (19.0760, 72.8777),
    'Manipur': (24.8170, 93.9368),
    'Meghalaya': (25.5788, 91.8933),
    'Mizoram': (23.7271, 92.7176),
    'Nagaland': (25.6751, 94.1086),
    'Odisha': (20.2961, 85.8245),
    'Punjab': (30.7333, 76.7794),
    'Rajasthan': (26.9124, 75.7873),
    'Sikkim': (27.3314, 88.6138),
    'Tamil Nadu': (13.0827, 80.2707),
    'Telangana': (17.3850, 78.4867),
    'Tripura': (23.8315, 91.2868),
    'Uttar Pradesh': (26.8467, 80.9462),
    'Uttarakhand': (30.0668, 79.0193),
    'West Bengal': (22.5726, 88.3639),
    'Delhi': (28.7041, 77.1025),                   
    'Ladakh': (34.1526, 77.5770),                  
    'Jammu and Kashmir': (33.2778, 75.3412),       
    'Andaman and Nicobar Islands': (11.7401, 92.6586), 
    'Puducherry': (11.9416, 79.8083),              
    'Dadra and Nagar Haveli': (20.2704, 73.0083),  
    'Daman and Diu': (20.3974, 72.8328),           
    'Lakshadweep': (10.5667, 72.6417),
    'Chandigarh' :(30.7333,76.7794),
}


blood_compatibility = {
    'O-': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
    'O+': ['O+', 'A+', 'B+', 'AB+'],
    'A-': ['A-', 'A+', 'AB-', 'AB+'],
    'A+': ['A+', 'AB+'],
    'B-': ['B-', 'B+', 'AB-', 'AB+'],
    'B+': ['B+', 'AB+'],
    'AB-': ['AB-', 'AB+'],
    'AB+': ['AB+']
}


def get_distance(state1, state2):
    coord1 = state_coords.get(str(state1).strip(), None)
    coord2 = state_coords.get(str(state2).strip(), None)
    if coord1 and coord2:
        return round(geodesic(coord1, coord2).kilometers, 2)
    return 9999

def is_blood_compatible(donor_bg, recipient_bg):
    donor_bg = str(donor_bg).strip().upper()
    recipient_bg = str(recipient_bg).strip().upper()
    return recipient_bg in blood_compatibility.get(donor_bg, [])


merged = pd.merge(
    donors, recipients,
    left_on="organ", right_on="organ",
    suffixes=("_donor", "_recipient")
)




merged["age_diff"] = (merged["age_donor"] - merged["age_recipient"]).abs()
merged = merged[merged["age_diff"] <= 20]


merged = merged[
    merged.apply(lambda row: is_blood_compatible(row["bloodgroup_donor"], row["bloodgroup_recipient"]), axis=1)
]


merged = merged[
    merged["organ_tissue_type_donor"].str.upper().str.strip()
    == merged["organ_tissue_type_recipient"].str.upper().str.strip()
]


merged["distance_km"] = merged.apply(
    lambda row: get_distance(row["location_donor"], row["location_recipient"]),
    axis=1
)

merged = merged[
    (merged["hospital_transportation"] == 1) | (merged["distance_km"] <= 200)
]


result = merged[[
    "donerid", "reciverid", "age_diff",
    "bloodgroup_donor", "bloodgroup_recipient",
    "organ", "organ_tissue_type_donor", "distance_km","urgency",
    "hospital_transportation",

]].copy()


result["success"] = result.apply(
    lambda row: 1 if (row["hospital_transportation"] == 1 or row["distance_km"] <= 200) else 0,
    axis=1
)



result.to_csv("match_data.csv", index=False)

print(f"✅ Generated match_data.csv with {len(result)} valid donor-recipient pairs.")
