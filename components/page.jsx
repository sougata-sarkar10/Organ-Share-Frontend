"use client";

import React, { useState, useRef, useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css"; // Leaflet CSS

const carIconImg = "/car.png";
const planeIconImg = "/plane.png";
const donorEmoji = "🏥"; // donor location emoji
const receiverEmoji = "🧍"; // receiver location emoji

const stateCoords = {
  'Andhra Pradesh':[16.5062,80.648],'Arunachal Pradesh':[27.0844,93.6053],
  'Assam':[26.1433,91.7898],'Bihar':[25.5941,85.1376],'Chhattisgarh':[21.2514,81.6296],
  'Goa':[15.2993,74.124],'Gujarat':[23.0225,72.5714],'Haryana':[30.7333,76.7794],
  'Himachal Pradesh':[31.1048,77.1734],'Jharkhand':[23.6102,85.2799],'Karnataka':[12.9716,77.5946],
  'Kerala':[8.5241,76.9366],'Madhya Pradesh':[23.2599,77.4126],'Maharashtra':[19.076,72.8777],
  'Manipur':[24.817,93.9368],'Meghalaya':[25.5788,91.8933],'Mizoram':[23.1645,92.9376],
  'Nagaland':[26.1584,94.5624],'Odisha':[20.9517,85.0985],'Punjab':[30.901,75.8573],
  'Rajasthan':[26.9124,75.7873],'Sikkim':[27.533,88.5122],'Tamil Nadu':[11.0271,78.6569],
  'Telangana':[17.385,78.4867],'Tripura':[23.9408,91.9882],'Uttar Pradesh':[26.8467,80.9462],
  'Uttarakhand':[30.3165,78.0322],'West Bengal':[22.5726,88.3639],
  'Andaman and Nicobar Islands':[11.6670,92.7360],'Chandigarh':[30.7200,76.7800],
  'Dadra and Nagar Haveli and Daman and Diu':[20.2666,73.0166],'Delhi':[28.6699,77.2300],
  'Jammu and Kashmir':[34.3000,74.4667],'Ladakh':[34.1526,77.5770],'Lakshadweep':[10.5626,72.6369],
  'Puducherry':[11.9350,79.8300]
};

export default function Matches({ locations = [], organs = [], tissueTypes = [] }) {
  const [formData, setFormData] = useState({
    age: 40,
    location: "",
    bloodgroup: "",
    organ: "",
    tissue_type: "",
    urgency: 1,
  });
  const [matches, setMatches] = useState([]);
  const [animationMarkers, setAnimationMarkers] = useState({});
  const [requestedDonors, setRequestedDonors] = useState([]);
  const [mapVisible, setMapVisible] = useState(false);

  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.off();
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    // Use env variable in production, fallback to localhost in dev
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    const response = await fetch(`${API_URL}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.statusText}`);
    }

    const data = await response.json();
    setMatches(data.matches || []);
  } catch (error) {
    console.error("Error submitting form:", error);
    alert("Something went wrong. Please try again.");
  }
};


  const sendRequest = (donor) => {
    alert(`Hospital: ${donor.hospital_name}\nEmail: ${donor.email}\nLocation: ${donor.location}`);
    setRequestedDonors(prev => prev.includes(donor.donor_id) ? prev : [...prev, donor.donor_id]);
  };

  const trackDonor = (donor) => {
    const receiverCoords = stateCoords[formData.location];
    const donorCoords = stateCoords[donor.location];
    if (!receiverCoords || !donorCoords) return alert("Coordinates missing for donor or receiver.");

    if (mapRef.current) {
      mapRef.current.off();
      mapRef.current.remove();
      mapRef.current = null;
    }

    setMapVisible(true);

    setTimeout(() => {
      const centerLat = (donorCoords[0] + receiverCoords[0]) / 2;
      const centerLng = (donorCoords[1] + receiverCoords[1]) / 2;

      const newMap = L.map(mapContainerRef.current, {
        center: [centerLat, centerLng],
        zoom: 5,
        preferCanvas: true
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19 }).addTo(newMap);

      // donor emoji
      L.marker(donorCoords, {
        icon: L.divIcon({
          className: "donor-emoji",
          html: `<div style="font-size:32px;">${donorEmoji}</div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        })
      }).addTo(newMap).bindPopup(`Donor: ${donor.location}`);

      // receiver emoji
      L.marker(receiverCoords, {
        icon: L.divIcon({
          className: "receiver-emoji",
          html: `<div style="font-size:32px;">${receiverEmoji}</div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        })
      }).addTo(newMap).bindPopup(`Receiver: ${formData.location}`);

      L.polyline([donorCoords, receiverCoords], { color: "blue", weight: 3, dashArray: "5,10" }).addTo(newMap);

      const icon = L.icon({
        iconUrl: donor.hospital_transportation === 1 ? planeIconImg : carIconImg,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
      });

      const animMarker = L.marker(donorCoords, { icon }).addTo(newMap);
      setAnimationMarkers(prev => ({ ...prev, [donor.donor_id]: animMarker }));

      mapRef.current = newMap;
      setTimeout(() => newMap.invalidateSize(), 100);

      // animate marker
      let step = 0;
      const steps = 600;
      const duration = 600000; // ms
      const latStep = (receiverCoords[0] - donorCoords[0]) / steps;
      const lngStep = (receiverCoords[1] - donorCoords[1]) / steps;
      const animate = () => {
        if (!mapRef.current) return;
        if (step <= steps) {
          animMarker.setLatLng([donorCoords[0] + latStep * step, donorCoords[1] + lngStep * step]);
          step++;
          setTimeout(animate, duration / steps);
        }
      };
      animate();
    }, 50);
  };

  const clearMap = () => {
    if (mapRef.current) {
      mapRef.current.off();
      mapRef.current.remove();
      mapRef.current = null;
    }
    setAnimationMarkers({});
    setMapVisible(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-3xl shadow-xl my-8">
      <h1 className="text-3xl font-bold text-green-600 text-center mb-4">Organ Donor Match Predictor 💖</h1>
      <p className="text-center mb-6 text-gray-700">Fill in your details to find potential organ donors from the database.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Form Fields ... same as before */}
        <div>
          <label className="block font-semibold mb-1">Your Age:</label>
          <input type="number" id="age" value={formData.age} onChange={handleInputChange} min="0" max="120" required
            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"/>
        </div>
        <div>
          <label className="block font-semibold mb-1">Your Location:</label>
          <select id="location" value={formData.location} onChange={handleInputChange} required
            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400">
            <option value="">-- Select State --</option>
            {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
          </select>
        </div>
        <div>
          <label className="block font-semibold mb-1">Blood Group:</label>
          <select id="bloodgroup" value={formData.bloodgroup} onChange={handleInputChange} required
            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400">
            <option value="">-- Select Blood Group --</option>
            {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map(bg => <option key={bg}>{bg}</option>)}
          </select>
        </div>
        <div>
          <label className="block font-semibold mb-1">Organ Needed:</label>
          <select id="organ" value={formData.organ} onChange={handleInputChange} required
            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400">
            <option value="">-- Select Organ --</option>
            {organs.map(org => <option key={org} value={org}>{org}</option>)}
          </select>
        </div>
        <div>
          <label className="block font-semibold mb-1">Required Tissue Type:</label>
          <select id="tissue_type" value={formData.tissue_type} onChange={handleInputChange} required
            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400">
            <option value="">-- Select Tissue Type --</option>
            {tissueTypes.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="block font-semibold mb-1">Urgency Level:</label>
          <select id="urgency" value={formData.urgency} onChange={handleInputChange}
            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400">
            <option value={0}>Low</option>
            <option value={1}>Medium</option>
            <option value={2}>High</option>
          </select>
        </div>

        <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-xl font-bold shadow-md hover:bg-green-700 transition transform hover:-translate-y-1">
          Find Donor 🩺
        </button>
      </form>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Results</h2>
      {matches.length === 0 ? (
        <p className="font-semibold text-gray-700">No donors found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse shadow-lg rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-gradient-to-r from-green-600 to-green-700 text-white">
                <th className="p-3">Donor ID</th>
                <th className="p-3">Age</th>
                <th className="p-3">Health Score</th>
                <th className="p-3">Match Probability</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {matches.map(d => (
                <tr key={d.donor_id} className="text-center hover:bg-green-50 transition-transform transform hover:scale-105">
                  <td className="p-2">{d.donor_id}</td>
                  <td className="p-2">{d.age}</td>
                  <td className="p-2">{d.health_score}</td>
                  <td className="p-2">{(d.match_probability*100).toFixed(2)}%</td>
                  <td className="flex justify-center gap-2 p-2">
                    {!requestedDonors.includes(d.donor_id) ? (
                      <button
                        className="bg-blue-600 text-white py-1 px-3 rounded-lg font-semibold shadow-md hover:bg-blue-700 transition transform hover:scale-105"
                        onClick={() => sendRequest(d)}
                      >
                        Send Request
                      </button>
                    ) : (
                      <button
                        className="bg-purple-600 text-white py-1 px-3 rounded-lg font-semibold shadow-md hover:bg-purple-700 transition transform hover:scale-105"
                        onClick={() => trackDonor(d)}
                      >
                        Track Map
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Map area */}
      <div className="mt-6 relative">
        <div
          ref={mapContainerRef}
          id="map"
          style={{
            height: mapVisible ? "400px" : 0,
            width: "100%",
            borderRadius: "10px",
            overflow: "hidden",
            transition: "height 200ms ease"
          }}
        />
        {mapVisible && (
          <button onClick={clearMap} className="fixed bottom-5 right-5 bg-red-600 text-white py-3 px-5 rounded-2xl font-bold shadow-lg hover:bg-red-700 transform hover:-translate-y-1 transition">
            🗑 Clear Map
          </button>
        )}
      </div>
    </div>
  );
}
