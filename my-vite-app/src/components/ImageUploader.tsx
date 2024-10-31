// src/components/ImageUploader.tsx
import React, { useState } from 'react';
import imageCompression from 'browser-image-compression';

const ImageUploader: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<File | null>(null);
  const [compressedImage, setCompressedImage] = useState<string | null>(null);
  const [targetSize, setTargetSize] = useState<number>(500); // in KB
  const [quality, setQuality] = useState<number>(0.8);
  const [maxWidth, setMaxWidth] = useState<number>(1024);
  const [maxHeight, setMaxHeight] = useState<number>(1024);
  const [isCompressing, setIsCompressing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showDownloadModal, setShowDownloadModal] = useState<boolean>(false);
  const [selectedFormat, setSelectedFormat] = useState<string>('jpg');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setOriginalImage(file);
      setCompressedImage(null);
      setError(null);
    }
  };

  const handleCompression = async () => {
    if (!originalImage) return;

    const options = {
      maxSizeMB: targetSize / 1024,
      maxWidthOrHeight: Math.max(maxWidth, maxHeight),
      initialQuality: quality,
      useWebWorker: true,
    };

    try {
      setIsCompressing(true);
      const compressedFile = await imageCompression(originalImage, options);
      const compressedUrl = URL.createObjectURL(compressedFile);
      setCompressedImage(compressedUrl);
      setShowDownloadModal(true);
    } catch (error) {
      console.error("Compression error:", error);
      setError("Failed to compress the image. Please try again with different settings.");
    } finally {
      setIsCompressing(false);
    }
  };

  const handleDownload = () => {
    if (!compressedImage) return;
    const link = document.createElement('a');
    link.href = compressedImage;
    link.download = `compressed-image.${selectedFormat}`;
    link.click();
    setShowDownloadModal(false);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ textAlign: 'center' }}>Advanced Image Size Reducer</h2>

      <div style={{ marginBottom: '20px' }}>
        <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'block', margin: '0 auto' }} />
      </div>

      {originalImage && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', width: '300px' }}>
            <div>
              <label>Target Size (KB)</label>
              <input
                type="number"
                value={targetSize}
                onChange={(e) => setTargetSize(Number(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label>Quality (0-1)</label>
              <input
                type="number"
                step="0.1"
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', width: '300px' }}>
            <div>
              <label>Max Width (px)</label>
              <input
                type="number"
                value={maxWidth}
                onChange={(e) => setMaxWidth(Number(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label>Max Height (px)</label>
              <input
                type="number"
                value={maxHeight}
                onChange={(e) => setMaxHeight(Number(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
          </div>
        </div>
      )}

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button
          onClick={handleCompression}
          disabled={!originalImage || isCompressing}
          style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}
        >
          {isCompressing ? "Compressing..." : "Compress Image"}
        </button>
      </div>

      {isCompressing && <p style={{ textAlign: 'center' }}>Compressing image, please wait...</p>}
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      {originalImage && compressedImage && (
        <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '30px', padding: '0 20px' }}>
          <div style={{ textAlign: 'center' }}>
            <h3>Original Image</h3>
            <img src={URL.createObjectURL(originalImage)} alt="Original" style={{ maxWidth: '100%', maxHeight: '200px' }} />
            <p>Size: {(originalImage.size / 1024).toFixed(2)} KB</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <h3>Compressed Image</h3>
            <img src={compressedImage} alt="Compressed" style={{ maxWidth: '100%', maxHeight: '200px' }} />
            <p>Estimated Size: {(targetSize).toFixed(2)} KB</p>
            <button onClick={() => setShowDownloadModal(true)} style={{ marginTop: '10px', padding: '8px 16px' }}>
              Download
            </button>
          </div>
        </div>
      )}

      {showDownloadModal && (
        <div style={{
          position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{
            backgroundColor: '#fff', padding: '20px', borderRadius: '8px', textAlign: 'center', width: '300px'
          }}>
            <h4>Select Download Format</h4>
            <select value={selectedFormat} onChange={(e) => setSelectedFormat(e.target.value)} style={{ marginBottom: '15px' }}>
              <option value="jpg">JPG</option>
              <option value="png">PNG</option>
              <option value="jpeg">JPEG</option>
              <option value="img">IMG</option>
            </select>
            <br />
            <button onClick={handleDownload} style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>
              Download
            </button>
            <button onClick={() => setShowDownloadModal(false)} style={{ marginLeft: '10px', padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
