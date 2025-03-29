const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export async function createUser(data) {
  try {
    const res = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (error) {
    console.error("Error creating user:", error);
    return { error: "Failed to create user" };
  }
}

export async function getImages(email) {
  try {
    const res = await fetch(`${API_BASE}/gallery?email=${email}`);
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }
    const data = await res.json();
    console.log("Fetched images:", data); // Debugging line
    return data;
  } catch (error) {
    console.error("Error fetching images:", error);
    return { error: "Failed to fetch images" };
  }
}
