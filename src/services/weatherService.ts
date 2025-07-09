import axios from "axios";

import { urls, baseURL } from "../configs/urls";

const axiosService = axios.create({ baseURL });

const weatherServices = {
  getWeatherByCityName: (cityName: string) => axiosService.get(urls.WeatherByCityName(cityName)),
  getWeatherDetailsByCityName: (cityName: string) =>
    axiosService.get(urls.WeatherDetailsByCityName(cityName)),
};

export { weatherServices };
