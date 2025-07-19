from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
from transformers import pipeline
from PIL import Image
import os

app = Flask(__name__)
CORS(app)  # Enable CORS

app.config['UPLOAD_FOLDER'] = './uploads'

# Load the Hugging Face model
classifier = pipeline(task="image-classification", model="lxyuan/vit-xray-pneumonia-classification")

# Route to upload image and classify
@app.route('/classify', methods=['POST'])
def classify_image():
    if 'image' not in request.files:
        return jsonify({"error": "No image uploaded"}), 400
    
    file = request.files['image']
    if file:
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(filepath)

        # Open and classify the image
        image = Image.open(filepath).convert("RGB")
        result = classifier(image)

        # Remove the uploaded image after processing
        os.remove(filepath)

        return jsonify({"result": result})
    else:
        return jsonify({"error": "Invalid file"}), 400

if __name__ == "__main__":
    os.makedirs('./uploads', exist_ok=True)
    app.run(debug=True)
