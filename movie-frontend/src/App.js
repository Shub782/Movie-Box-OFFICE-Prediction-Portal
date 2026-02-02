import React, { useState } from "react";
import "./App.css";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function App() {
  const [formData, setFormData] = useState({
    movieName: "",
    budget: "",
    runtime: "",
    popularity: "",
    cast_score: "",
    director_score: "",
    genre: "Action",
    season: "Summer",
    franchise: false,
    marketing_score: "",
    star_power: "",
    director_reputation: "",
    production_studio: "Big Studio",
  });

  const [prediction, setPrediction] = useState(null);
  const [poster, setPoster] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === "checkbox" ? checked : value 
    });
  };

  const handlePosterChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPoster(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://127.0.0.1:5000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        budget: parseFloat(formData.budget),
        runtime: parseFloat(formData.runtime),
        popularity: parseFloat(formData.popularity),
        cast_score: parseFloat(formData.cast_score),
        director_score: parseFloat(formData.director_score),
        genre: formData.genre,
        season: formData.season,
        franchise: formData.franchise,
        marketing_score: parseFloat(formData.marketing_score),
        star_power: parseFloat(formData.star_power),
        director_reputation: parseFloat(formData.director_reputation),
        production_studio: formData.production_studio,
      })
    });
    const result = await response.json();
    setPrediction(result.predicted_revenue);
  };

  const usdMillionToInr = (usdMillion) => usdMillion * 1e6 * 82;
  const inrToCrores = (inr) => (inr / 1e7).toFixed(2);

  const chartData = {
    labels: ["Budget ($ Million)", "Predicted Revenue ($ Million)"],
    datasets: [
      {
        label: "Amount in $ Million",
        data: [parseFloat(formData.budget) || 0, prediction ? prediction.toFixed(2) : 0],
        backgroundColor: ["#87cefa", "#ff4e50"]
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Budget vs Predicted Revenue", font: { size: 18 } }
    }
  };

  return (
    <div style={containerStyle}>
      <style>
        {`
          @keyframes gradientBG {
            0% {background-position: 0% 50%;}
            50% {background-position: 100% 50%;}
            100% {background-position: 0% 50%;}
          }
        `}
      </style>

      <div style={cardStyle}>
        <h1 style={titleStyle}>🎬 Movie Box OFFICE Prediction Portal</h1>
        <p style={subtitleStyle}>Predict Revenue for Upcoming Movies</p>

        <form onSubmit={handleSubmit}>
          {/* Movie Name & Poster */}
          <div style={rowStyle}>
            <div style={{ flex: 1, marginRight: "10px" }}>
              <input type="text" name="movieName" placeholder="Enter Movie Name" onChange={handleChange} style={inputStyle} required />
            </div>
            <div style={{ flex: 1 }}>
              <input type="file" accept="image/*" onChange={handlePosterChange} style={inputStyle} />
              {poster && <img src={poster} alt="poster" style={{ marginTop: "10px", width: "100%", borderRadius: "10px" }} />}
            </div>
          </div>

          {/* Budget & Runtime */}
          <div style={rowStyle}>
            <input type="number" name="budget" placeholder="Budget (in million $)" onChange={handleChange} style={inputStyle} required />
            <input type="number" name="runtime" placeholder="Runtime (minutes)" onChange={handleChange} style={inputStyle} required />
          </div>

          {/* Popularity & Cast Score */}
          <div style={rowStyle}>
            <input type="number" name="popularity" placeholder="Popularity Score" onChange={handleChange} style={inputStyle} required />
            <input type="number" name="cast_score" placeholder="Cast Score (1-10)" onChange={handleChange} style={inputStyle} required />
          </div>

          {/* Director Score & Marketing Score */}
          <div style={rowStyle}>
            <input type="number" name="director_score" placeholder="Director Score (1-10)" onChange={handleChange} style={inputStyle} required />
            <input type="number" name="marketing_score" placeholder="Marketing Score (1-10)" onChange={handleChange} style={inputStyle} required />
          </div>

          {/* Star Power & Director Reputation */}
          <div style={rowStyle}>
            <input type="number" name="star_power" placeholder="Star Power (1-10)" onChange={handleChange} style={inputStyle} required />
            <input type="number" name="director_reputation" placeholder="Director Reputation (1-10)" onChange={handleChange} style={inputStyle} required />
          </div>

          {/* Genre & Season */}
          <div style={rowStyle}>
            <select name="genre" onChange={handleChange} style={inputStyle}>
              <option>Action</option>
              <option>Comedy</option>
              <option>Drama</option>
              <option>Sci-Fi</option>
              <option>Horror</option>
              <option>Romance</option>
            </select>
            <select name="season" onChange={handleChange} style={inputStyle}>
              <option>Summer</option>
              <option>Winter</option>
              <option>Spring</option>
              <option>Fall</option>
              <option>Holidays</option>
            </select>
          </div>

          {/* Franchise & Production Studio */}
          <div style={rowStyle}>
            <label style={checkboxLabelStyle}>
              <input type="checkbox" name="franchise" onChange={handleChange} style={{ marginRight: "8px" }} /> Franchise / Sequel
            </label>
            <select name="production_studio" onChange={handleChange} style={inputStyle}>
              <option>Big Studio</option>
              <option>Medium Studio</option>
              <option>Small Studio</option>
            </select>
          </div>

          <button type="submit" className="button">
            Predict Revenue
          </button>
        </form>

        {prediction && (
          <div style={predictionStyle}>
            💰 Predicted Revenue for <span style={{ color: "#ff4e50" }}>{formData.movieName}</span>: ${prediction.toFixed(2)} Million <br />
            💰 Converted to INR: ₹{usdMillionToInr(prediction).toLocaleString()} (~{inrToCrores(usdMillionToInr(prediction))} Cr)
          </div>
        )}

        {prediction && (
          <div style={{ marginTop: "30px" }}>
            <Bar data={chartData} options={chartOptions} />
          </div>
        )}
      </div>
    </div>
  );
}

// Styles
const containerStyle = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontFamily: "'Poppins', sans-serif",
  padding: "20px",
  background: "linear-gradient(270deg, #ffc1cc, #87cefa, #fffacd, #D70040, #dda0dd, #98ff98, #DA70D6 , #DE3163)",
  backgroundSize: "1600% 1600%",
  animation: "gradientBG 25s ease infinite"
};

const cardStyle = {
  background: "white",
  color: "#333",
  padding: "40px",
  borderRadius: "25px",
  boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
  width: "600px",
  maxWidth: "95%",
  textAlign: "center"
};

const titleStyle = { color: "#ff4e50", marginBottom: "10px", fontFamily: "'Montserrat', sans-serif", fontSize: "32px" };
const subtitleStyle = { color: "#555", marginBottom: "30px", fontSize: "16px" };
const rowStyle = { display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "15px" };

const inputStyle = {
  flex: 1,
  padding: "16px",          // increased padding
  borderRadius: "12px",
  border: "1px solid #ccc",
  outline: "none",
  fontSize: "16px",         // increased font size
  transition: "0.3s",
  boxShadow: "0 3px 6px rgba(0,0,0,0.1)"
};

const buttonStyle = {
  padding: "16px 30px",     // bigger button
  borderRadius: "12px",
  fontSize: "18px",         // larger font
  backgroundColor: "#ff4e50",
  color: "white",
  border: "none",
  cursor: "pointer",
  fontWeight: "bold",
  transition: "0.3s",
  boxShadow: "0 5px 15px rgba(0,0,0,0.2)"
};

const checkboxLabelStyle = {
  flex: 1,
  display: "flex",
  alignItems: "center",
  fontSize: "16px",         // bigger label text
  fontWeight: "500"
};

const predictionStyle = {
  marginTop: "25px",
  padding: "25px",
  borderRadius: "15px",
  background: "linear-gradient(120deg, #ffc1cc, #ffa07a)",
  color: "#ff2e2e",
  fontWeight: "bold",
  fontSize: "18px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
  transition: "all 0.5s ease-in-out"
};

export default App;
