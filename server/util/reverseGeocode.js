import fetch from 'node-fetch';

const reverseGeocode = async (latitude, longitude) => {
  const apiKey = process.env.OPENCAGE_API_KEY;
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    const location = data.results[0]?.formatted;
    return location || "Unknown location";
  } catch (error) {
    console.error("Reverse geocoding failed:", error);
    return "Unknown location";
  }
};

export default reverseGeocode;

