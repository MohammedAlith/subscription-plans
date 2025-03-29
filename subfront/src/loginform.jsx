import React, { useState } from 'react';
import { createUser, getImages } from './api';

function LoginForm({ plan, onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    plan,
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const userData = await createUser(formData);

      if (userData?.message) {
        alert(userData.message);
      }

      // Optional: Store user info
      localStorage.setItem('user', JSON.stringify(userData));

      // ✅ FIX: get images using email, not plan
      const images = await getImages(formData.email);

      onSubmit(formData, images);
      setSuccess(true);
    } catch (err) {
      alert('Something went wrong. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Login to Subscribe</h2>

        <input
          type="text"
          name="name"
          placeholder="Name"
          required
          value={formData.name}
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          value={formData.email}
          onChange={handleChange}
        />

        <input
          type="text"
          name="plan"
          value={plan}
          disabled
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit'}
        </button>

        {success && <p className="success-msg">Logged in! Enjoy your images 🎉</p>}
      </form>
    </div>
  );
}

export default LoginForm;
