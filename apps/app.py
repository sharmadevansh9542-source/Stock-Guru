import numpy as np
import pandas as pd
import yfinance as yf
from flask import Flask, request, jsonify
from keras.models import load_model
from sklearn.preprocessing import MinMaxScaler

app = Flask(__name__)

# Load trained model
model = load_model("Stock Predictions Model.h5")


@app.route("/")
def home():
    return "Stock Prediction API is Running 🚀"

@app.route("/predict", methods=["POST"])
def predict():

    data = request.get_json()
    stock = data["stock"]

    start = "2012-01-01"
    end = "2022-12-31"

    # Download stock data
    df = yf.download(stock, start=start, end=end)

    if df.empty:
        return jsonify({"error": "Invalid stock symbol"})

    df = df[['Close']]
    df.dropna(inplace=True)

    # Train-test split
    data_train = pd.DataFrame(df[0:int(len(df)*0.80)])
    data_test = pd.DataFrame(df[int(len(df)*0.80):])

    # Scaling
    scaler = MinMaxScaler(feature_range=(0,1))
    data_train_scaled = scaler.fit_transform(data_train)

    # Prepare test data
    past_100_days = data_train.tail(100)
    final_df = pd.concat([past_100_days, data_test], ignore_index=True)
    input_data = scaler.transform(final_df)

    x_test = []

    for i in range(100, input_data.shape[0]):
        x_test.append(input_data[i-100:i])

    x_test = np.array(x_test)

    # Prediction
    y_predicted = model.predict(x_test)

    # Reverse scaling
    y_predicted = scaler.inverse_transform(y_predicted)

    return jsonify({
        "stock": stock,
        "predicted_prices": y_predicted.flatten().tolist()
    })

if __name__ == "__main__":
    app.run(debug=True)
