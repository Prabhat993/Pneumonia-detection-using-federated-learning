import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import './App.css';

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [result, setResult] = useState(null);

  const uploadImage = async () => {
    if (!selectedImage) return;

    const formData = new FormData();
    formData.append('image', selectedImage);

    try {
      const response = await axios.post('http://127.0.0.1:5000/classify', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResult(response.data.result);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="app">
      <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="title">
        Pneumonia Classification
      </motion.h1>
      <motion.div
        className="upload-container"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <input
          type="file"
          onChange={(e) => setSelectedImage(e.target.files[0])}
          accept="image/*"
        />
        <button onClick={uploadImage}>Classify</button>
      </motion.div>

      {result && (
        <motion.div
          className="result-container"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          <h2>Result:</h2>
          <ul>
            {result.map((item, index) => (
              <li key={index}>
                {item.label}: {Math.round(item.score * 100)}%
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </div>
  );
}

export default App;
