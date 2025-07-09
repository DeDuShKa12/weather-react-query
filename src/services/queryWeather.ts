import axios from "axios";
import {
  QueryKey,
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";

import { urls } from "../configs/urls";
import { ApiError, ForecastResponse, WeatherResponse } from "../interfaces/weatherInterfaces";

export const WeatherService = {
  useWeatherByCityName: (
    cityName: string,
    options?: Omit<
      UseQueryOptions<WeatherResponse, ApiError, WeatherResponse, QueryKey>,
      "queryKey" | "queryFn"
    >
  ) => {
    const req = async () => {
      const res = await axios.get(urls.WeatherByCityName(cityName));
      return res.data;
    };

    return useQuery<WeatherResponse, ApiError>({
      queryKey: ["useWeatherByCityName", cityName],
      queryFn: req,
      ...options,
    });
  },
  useWeatherByCityNameMutation: (
    options?: UseMutationOptions<WeatherResponse, ApiError, { cityName: string }>
  ) => {
    const req = async ({ cityName }: { cityName: string }) => {
      const res = await axios.get(urls.WeatherByCityName(cityName));
      return res.data;
    };

    return useMutation<WeatherResponse, ApiError, { cityName: string }>({
      mutationFn: req,
      ...options,
    });
  },
  useWeatherDetailsByCityName: (
    cityName: string,
    options?: UseQueryOptions<ForecastResponse, ApiError>
  ) => {
    const req = async () => {
      console.log(urls.WeatherDetailsByCityName(cityName));

      const res = await axios.get(urls.WeatherDetailsByCityName(cityName));
      console.log(res.data);

      return res.data;
    };

    return useQuery<ForecastResponse, ApiError>({
      queryKey: ["useWeatherDetailsByCityName", cityName],
      queryFn: req,
      ...options,
    });
  },
};
