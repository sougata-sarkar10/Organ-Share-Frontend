"use client";


import dynamic from "next/dynamic";

// Import Matches with SSR disabled because of Leaflet
const Matches = dynamic(() => import("../../components/page"), {
  ssr: false,
});
export default function MatchesPage() {
  return (
    <Matches
      locations={[
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh",
  "Assam", "Bihar", "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh",
  "Jammu and Kashmir", "Jharkhand", "Karnataka", "Kerala",
  "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra",
  "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha",
  "Puducherry", "Punjab", "Rajasthan", "Sikkim",
  "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
  "Uttarakhand", "West Bengal"
]
}
      organs={["Kidney", "Liver","Cornea","Heart","Lung","Pancreas"]}
      tissueTypes={["HLA-A", "HLA-B","HLA-DR"]}
    />
  );
}
