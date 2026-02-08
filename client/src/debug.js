// Debug tool to check API configuration
export const debugApiConfig = () => {
  console.log("🔍 API Configuration Debug:");
  console.log("Environment:", import.meta.env.MODE);
  console.log("VITE_API_URL:", import.meta.env.VITE_API_URL);
  console.log("Current URL:", window.location.href);
  console.log("Is Production:", import.meta.env.PROD);
  console.log("Is Development:", import.meta.env.DEV);
  
  // Test API endpoint
  const testUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
  console.log("Testing API URL:", testUrl);
  
  fetch(testUrl)
    .then(response => {
      console.log("✅ API Response:", response.status);
      return response.text();
    })
    .then(data => console.log("✅ API Data:", data))
    .catch(error => {
      console.error("❌ API Error:", error.message);
      console.error("❌ This means your backend is not accessible at:", testUrl);
    });
};

// Call this function in browser console to debug
window.debugApiConfig = debugApiConfig;
