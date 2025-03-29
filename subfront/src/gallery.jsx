import React, { useEffect, useState } from 'react';
import { getImages } from './api'; // Ensure correct path

const Gallery = ({ email }) => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      const data = await getImages(email);
      if (data && data.length > 0) {
        setImages(data);
      } else {
        setImages([]); // Ensure state updates correctly
      }
    };
    fetchImages();
  }, [email]);

  return (
    <div>
      
      {images.length > 0 ? (
        <div style={{ display: 'flex', gap: '10px' }}>
          {images.map((img, index) => (
            <img key={index} src={img} alt={`Gallery ${index}`} width="200px" />
          ))}
        </div>
      ) : (
        <p>No images available for your plan.</p>
      )}
    </div>
  );
};

export default Gallery;
