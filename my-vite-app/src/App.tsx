// src/App.tsx
import React from 'react';
import ImageUploader from './components/ImageUploader';

const App: React.FC = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <h1>Advanced Image Size Reducer</h1>
      <ImageUploader />
    </div>
  );
};

export default App;
