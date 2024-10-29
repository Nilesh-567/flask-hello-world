from flask import Flask, request, jsonify
from pymongo import MongoClient

app = Flask(__name__)

# Configure MongoDB connection
client = MongoClient("mongodb+srv://root:root@mydatabase.sgxomt2.mongodb.net/?retryWrites=true&w=majority&appName=mydatabase")
db = client["Vercel"]
collection = db["flask"]

# Route for the sign-up form
@app.route('/signup', methods=['POST'])
def signup():
    try:
        # Get JSON data from the request
        data = request.get_json()
        name = data.get("name")
        age = data.get("age")
        
        # Check if name and age are provided
        if not name or not age:
            return jsonify({"error": "Name and age are required"}), 400

        # Insert data into MongoDB collection
        user_data = {"name": name, "age": age}
        collection.insert_one(user_data)
        
        return jsonify({"message": "Registration successful"}), 201
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)
