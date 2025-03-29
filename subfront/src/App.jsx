import React, { useState } from 'react';
import './App.css';
import Pack from './pack';
import LoginForm from './loginform';
import Gallery from './gallery';

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [user, setUser] = useState(null);
  const [images, setImages] = useState([]);

  const handleSubscribe = (plan) => {
    setSelectedPlan(plan);
    setShowLogin(true);
  };

  const handleLoginSubmit = async (userData, fetchedImages) => {
    setUser(userData);
    setImages(fetchedImages);
    setShowLogin(false);
  };

  return (
    <div className="container">
      <Pack onSubscribe={handleSubscribe} />

      {showLogin && (
        <LoginForm
          plan={selectedPlan}
          onSubmit={handleLoginSubmit}
        />
      )}

      {user && (
        <>
          <h2 className="gallery-title">Image Gallery</h2>
          <Gallery email={user?.email} />

        </>
      )}
    </div>
  );
}

export default App;

