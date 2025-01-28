import { useState, useEffect } from "react";
import axios from 'axios';

function App() {
  const [search, setsearch] = useState('');
  const [weatherdata, setweatherdata] = useState(null);
  const [location, setLocation] = useState(null);
  
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          fetchcurrentlocation(latitude, longitude);
        },
        (error) => {
          alert('Error fetching geolocation: ' + error.message);
        }
      );
    }
  }, []);

  async function fetchcurrentlocation(latitude, longitude) {
    const options = {
      method: 'GET',
      url: 'https://api.weatherstack.com/current',
      params: {
        access_key: process.env.REACT_APP_WEATHERSTACK_API_KEY, // Use environment variable for API key
        query: `${latitude},${longitude}`,
      },
    };
  
    try {
      const response = await axios(options);
      console.log(response.data);
  
      if (response.data.location) {
        setweatherdata(response.data);
        setLocation(response.data.location.name);
      } else {
        alert('Location data not available');
      }
    } catch (error) {
      console.log("Error:", error);
      if (error.response) {
        alert(`Error: ${error.response.data.error.info}`);
      } else if (error.request) {
        alert('Network error, please try again later.');
      } else {
        alert('Error fetching data');
      }
    }
  }

  function searchplace(event) {
    setsearch(event.target.value);
  }

  async function searchpressed() {
    if (!search.trim()) return;

    const options = {
      method: 'GET',
      url: 'https://api.weatherstack.com/current',
      params: {
        access_key: process.env.REACT_APP_WEATHERSTACK_API_KEY, // Use environment variable for API key
        query: search,
      }
    };
    
    try {
      const response = await axios.request(options);
      setweatherdata(response.data);
      setLocation(response.data.location.name);
    } catch (error) {
      console.error(error);
      if (error.response) {
        alert(`Error: ${error.response.data.error.info}`);
      } else if (error.request) {
        alert('Network error, please try again later.');
      } else {
        alert('Error fetching data');
      }
    }
  }

  return (
    <div className="App min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <h2 className="text-5xl font-extrabold mb-6">Weather-App</h2>
      <div className="mb-6">
        <input
          type="text"
          placeholder="Enter city/town..."
          value={search}
          onChange={searchplace}
          className="p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 mr-2 text-black text-xl shadow-md"
        />
        <button
          type="submit"
          onClick={searchpressed}
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300 shadow-lg"
        >
          Search
        </button>
      </div>

      <div className="bg-gray-800 p-8 rounded-lg shadow-xl text-center w-80 md:w-96">
        {weatherdata && weatherdata.location ? (
          <div>
            <h3 className="text-3xl font-semibold text-white">{location}</h3>
            <p className="text-xl font-medium text-gray-400">
              {weatherdata.location.region}, {weatherdata.location.country}
            </p>
            <p className="text-5xl font-bold text-blue-400">
              {weatherdata.current?.temperature ? `${weatherdata.current.temperature}°F` : 'Temperature not available'}
            </p>
            <p className="text-xl text-gray-300">
              {weatherdata.current?.weather_descriptions?.[0] || 'Weather description not available'}
            </p>
            <p className="mt-2 text-lg text-gray-400">
              {weatherdata.current?.humidity ? `Humidity: ${weatherdata.current.humidity}%` : 'Humidity data not available'}
            </p>
          </div>
        ) : (
          <div>
            <p className="text-xl text-gray-400">No data available</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
