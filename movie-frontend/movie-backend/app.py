from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
import pickle

app = Flask(__name__)
CORS(app)

# ------------------ Training Sample Model -------------------
# Dummy dataset (budget, runtime, popularity, cast_score, director_score, revenue)
data = {
    "budget": [100, 200, 50, 300, 400, 150],
    "runtime": [120, 150, 90, 180, 160, 140],
    "popularity": [80, 95, 60, 100, 120, 85],
    "cast_score": [7, 8, 6, 9, 10, 7],
    "director_score": [8, 9, 7, 9, 10, 8],
    "revenue": [300, 600, 100, 1000, 1200, 400]
}

df = pd.DataFrame(data)
X = df.drop("revenue", axis=1)
y = df["revenue"]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = LinearRegression()
model.fit(X_train, y_train)

# ------------------ API Routes -------------------
@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json
        features = [[
            data["budget"],
            data["runtime"],
            data["popularity"],
            data["cast_score"],
            data["director_score"]
        ]]
        
        prediction = model.predict(features)[0]
        return jsonify({"predicted_revenue": round(prediction, 2)})
    
    except Exception as e:
        return jsonify({"error": str(e)})


@app.route("/")
def home():
    return "🎬 Movie Box Office Prediction API is running!"


if __name__ == "__main__":
    app.run(debug=True)
