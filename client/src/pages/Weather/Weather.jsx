import React, { useEffect, useState } from "react"

import "./Weather.css";
import axios from "axios";
import { WEATHER_API_KEY } from "../../configs/constants";
import clear from "../../components/images/clear.png";
import clouds from "../../components/images/clouds.png";
import drizzle from "../../components/images/drizzle.png";
import humidity from "../../components/images/humidity.png";
import mist from "../../components/images/mist.png";
import rain from "../../components/images/rain.png";
import search from "../../components/images/search.png";
import snow from "../../components/images/snow.png";
import wind from "../../components/images/wind.png";

const Weather = () => {
  const [data, setData] = useState({});
  const [location, setLocation] = useState("");

  const API_BASE_URL = import.meta.env.VITE_WEATHER_API_BASE_URL || 'http://api.openweathermap.org';
  const GEOLOCATION_API_BASE_URL = import.meta.env.VITE_GEOLOCATION_API_BASE_URL || 'https://api.opencagedata.com';

  const getWeatherApiUrl = (location) =>
    `${API_BASE_URL}/data/2.5/weather?q=${location},us&units=imperial&appid=${WEATHER_API_KEY}`;

  const getWeatherApiUrlWithLatLong = (lat, long) =>
    `${API_BASE_URL}/data/2.5/weather?lat=${lat}&lon=${long}&units=imperial&appid=${WEATHER_API_KEY}`;

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const geoLocationAPIUrl = `${GEOLOCATION_API_BASE_URL}/geocode/v1/json?q=${latitude}+${longitude}&key=${WEATHER_API_KEY}`;
        const url = getWeatherApiUrlWithLatLong(latitude, longitude);

        axios.get(url)
          .then((res) => {
            setData(res.data);
          })
          .catch((err) => {
            console.error("Error getting weather data", err);
          });
      });
    }
  }, []);

  const handleSearchInput = (event) => {
    event.preventDefault();
    const url = getWeatherApiUrl(location);

    axios.get(url)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.error("Error getting weather data", err);
      });

    setLocation("");
  };

  const getForecastImage = (weather) => {
    switch (weather) {
      case "Drizzle": return drizzle;
      case "Clouds": return clouds;
      case "Clear": return clear;
      case "Snow": return snow;
      case "Rain": return rain;
      case "Mist": return mist;
      default: return clear;
    }
  };

  return (
    <div className="weather-container">
      <div className="search">
        <form on onSubmit={handleSearchInput}>
          {" "}
          <input
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            type="text"
            className="search-input"
            placeholder="Enter Location"
            spellCheck="false"
          />
          <button type="submit">
            <img src={search} alt="search bar" />
          </button>
        </form>
      </div>

      <div className="weather-details">
        {data.weather ? (
          <img
            src={getForecastImage(data.weather[0].main)}
            alt="clear-icon"
            className="forecast"
          />
        ) : null}

        {data.weather ? <p>{data.weather[0].main}</p> : null}
        <div className="temp">
          {data.main ? <h1>{data.main.temp.toFixed()}°F</h1> : null}
          <p className="city-name">{data.name}</p>
        </div>
        <div className="city-details">
          <div className="col">
            <img src={humidity} alt="" />
            <div className="humidity">
              <h2>Humidity</h2>
              {data.main ? <h2>{data.main.humidity}%</h2> : null}
            </div>
          </div>

          <div className="col">
            <img src={wind} alt="wind-icon" />
            <div className="wind">
              <h2>Wind</h2>
              {data.wind ? <h2>{data.wind.speed.toFixed()}MPH</h2> : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Weather
