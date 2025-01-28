# Weather App

A simple weather application built using React that fetches current weather information based on the user's location or a search query. The app utilizes the WeatherStack API to get real-time weather data.

## Features

- **Current Location**: Automatically fetches weather data based on the user's current geolocation.
- **Search Functionality**: Allows the user to search for weather information by city or town name.
- **Weather Data**: Displays current weather conditions including temperature, humidity, and weather descriptions.

## Technologies Used

- React
- Axios (for making HTTP requests)
- Tailwind CSS (for styling)

## Setup Instructions

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/weather-app.git
2. **Install dependencies:**
   Navigate to the project directory and install the required packages:
   cd weather-app
   npm install
3. **Obtain an API key from WeatherStack:**
    Sign up at WeatherStack and obtain an API key.
    Replace the placeholder access_key: '' in the code with your actual API key.
4. **Run the app:**
   npm start
   The app should now be running at http://localhost:3000.

**Code Explanation**:
  Key Sections:
   1. Fetching Weather Data: The app fetches weather data from the WeatherStack API using the user's current geolocation or the city/town    entered   in the search input.
   2. State Management: The app uses React hooks (useState and useEffect) to manage the state of the weather data, search input, and location.
   3. Error Handling: The app includes error handling for both API request failures and missing location data.
**Notes on API Key**:
    The app uses the WeatherStack API for fetching weather data. You will need to sign up for an account and get an API key to replace the     placeholder access_key: '' in the App.js file.

    To avoid exposing your API key publicly, make sure to add it securely using environment variables when deploying your app. For local development,     you can add it in a .env file:

    REACT_APP_WEATHERSTACK_API_KEY=your-api-key-here
    
    Then, modify the API request to use the environment variable:
      const apiKey = process.env.REACT_APP_WEATHERSTACK_API_KEY;
**Troubleshooting**:
    1.  API Rate Limit: If you are receiving an error about exceeding the API request limit, it may be due to the limitations of the free WeatherStack plan. Consider upgrading your plan or using another weather API.
    2. Geolocation Errors: Ensure that your browser has the necessary permissions to access your location.