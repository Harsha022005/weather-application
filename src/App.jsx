import { useState, useEffect } from "react";
import { WiDaySunny, WiCloudy, WiRain, WiSnow, WiThunderstorm, WiFog, WiDayCloudy } from "react-icons/wi";

function App() {
  const [search, setSearch] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const BASE_URL = "http://api.weatherapi.com/v1";

  useEffect(() => {
    // Load demo data on initial load
    loadDemoData("New York");

    // Try to get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          fetchCurrentLocation(latitude, longitude);
        },
        (error) => {
          console.log("Geolocation error:", error.message);
          // Keep demo data if geolocation fails
        }
      );
    }
  }, []);

  // Demo data function for display purposes
  function loadDemoData(cityName) {
    const demoData = {
      location: {
        name: cityName,
        region: "NY",
        country: "United States",
      },
      current: {
        temp_f: 72,
        condition: { text: "Partly Cloudy" },
        humidity: 65,
        wind_mph: 8,
        feelslike_f: 75,
      },
    };
    setWeatherData(demoData);
    setLocation(cityName);
  }

  async function fetchCurrentLocation(latitude, longitude) {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${BASE_URL}/current.json?key=${import.meta.env.VITE_REACT_APP_WEATHER_API_KEY}&q=${latitude},${longitude}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch weather data");
      }
      const data = await response.json();
      setWeatherData({
        location: {
          name: data.location.name,
          region: data.location.region,
          country: data.location.country,
        },
        current: {
          temp_f: data.current.temp_f,
          condition: { text: data.current.condition.text },
          humidity: data.current.humidity,
          wind_mph: data.current.wind_mph,
          feelslike_f: data.current.feelslike_f,
        },
      });
      setLocation(data.location.name);
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
      setError("Error fetching location data");
      setLoading(false);
    }
  }

  async function handleSearchSubmit() {
    if (!search.trim()) {
      setError("Please enter a city name");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${BASE_URL}/current.json?key=${process.env.REACT_APP_WEATHER_API_KEY}&q=${encodeURIComponent(search)}`
      );
      if (!response.ok) {
        throw new Error("City not found");
      }
      const data = await response.json();
      setWeatherData({
        location: {
          name: data.location.name,
          region: data.location.region,
          country: data.location.country,
        },
        current: {
          temp_f: data.current.temp_f,
          condition: { text: data.current.condition.text },
          humidity: data.current.humidity,
          wind_mph: data.current.wind_mph,
          feelslike_f: data.current.feelslike_f,
        },
      });
      setLocation(data.location.name);
      setSearch("");
      setLoading(false);
    } catch (err) {
      console.error("Error fetching weather data:", err);
      setError("City not found. Please try again with a different city name.");
      setLoading(false);
    }
  }

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearchSubmit();
    }
  };

  const getWeatherIcon = (description) => {
    const desc = description?.toLowerCase() || "";
    if (desc.includes("sunny") || desc.includes("clear")) return <WiDaySunny size={60} />;
    if (desc.includes("cloud")) return <WiCloudy size={60} />;
    if (desc.includes("rain")) return <WiRain size={60} />;
    if (desc.includes("snow")) return <WiSnow size={60} />;
    if (desc.includes("thunder")) return <WiThunderstorm size={60} />;
    if (desc.includes("fog")) return <WiFog size={60} />;
    return <WiDayCloudy size={60} />;
  };

  return (
    <div className="App min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white flex flex-col items-center justify-center p-4">
      <div className="text-center mb-8">
        <h1 className="text-6xl font-extrabold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Weather App
        </h1>
        <p className="text-xl text-gray-300">Get current weather for any location</p>
      </div>

      <div className="mb-8 flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <input
          type="text"
          placeholder="Enter city name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 p-3 rounded-lg border-2 border-gray-600 bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-white text-lg shadow-lg placeholder-gray-400"
        />
        <button
          type="button"
          onClick={handleSearchSubmit}
          disabled={loading}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition duration-300 shadow-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed min-w-fit"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-600 bg-opacity-20 border border-red-500 rounded-lg text-red-200 text-center max-w-md">
          {error}
        </div>
      )}

      <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg p-8 rounded-2xl shadow-2xl text-center w-full max-w-md border border-gray-700">
        {loading ? (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mb-4"></div>
            <p className="text-xl text-gray-300">Loading weather data...</p>
          </div>
        ) : weatherData && weatherData.location ? (
          <div>
            <div className="mb-4">
              <div className="text-6xl mb-2">
                {getWeatherIcon(weatherData.current?.condition?.text)}
              </div>
              <h3 className="text-3xl font-bold text-white mb-1">{location}</h3>
              <p className="text-lg font-medium text-gray-300">
                {weatherData.location.region}, {weatherData.location.country}
              </p>
            </div>

            <div className="mb-6">
              <p className="text-6xl font-bold text-blue-400 mb-2">
                {weatherData.current?.temp_f
                  ? `${Math.round(weatherData.current.temp_f)}°F`
                  : "N/A"}
              </p>
              <p className="text-2xl text-gray-200 capitalize">
                {weatherData.current?.condition?.text || "Weather data unavailable"}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-700 bg-opacity-50 p-3 rounded-lg">
                <p className="text-gray-400">Feels Like</p>
                <p className="text-lg font-semibold text-blue-300">
                  {weatherData.current?.feelslike_f
                    ? `${Math.round(weatherData.current.feelslike_f)}°F`
                    : "N/A"}
                </p>
              </div>
              <div className="bg-gray-700 bg-opacity-50 p-3 rounded-lg">
                <p className="text-gray-400">Humidity</p>
                <p className="text-lg font-semibold text-purple-300">
                  {weatherData.current?.humidity
                    ? `${weatherData.current.humidity}%`
                    : "N/A"}
                </p>
              </div>
              <div className="bg-gray-700 bg-opacity-50 p-3 rounded-lg">
                <p className="text-gray-400">Wind Speed</p>
                <p className="text-lg font-semibold text-green-300">
                  {weatherData.current?.wind_mph
                    ? `${Math.round(weatherData.current.wind_mph)} mph`
                    : "N/A"}
                </p>
              </div>
              <div className="bg-gray-700 bg-opacity-50 p-3 rounded-lg">
                <p className="text-gray-400">Condition</p>
                <p className="text-lg font-semibold text-yellow-300">
                  {weatherData.current?.condition?.text?.split(" ")[0] || "N/A"}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="text-6xl mb-4">
              <WiDayCloudy size={60} />
            </div>
            <p className="text-xl text-gray-300">Search for a city to get weather data</p>
          </div>
        )}
      </div>

      <div className="mt-6 text-center text-gray-400 text-sm max-w-md">
        <p className="mb-2">
          <span className="font-semibold">Powered by:</span> WeatherAPI.com
        </p>
        <p>Real-time weather data for your location and searches.</p>
      </div>
    </div>
  );
}

export default App;