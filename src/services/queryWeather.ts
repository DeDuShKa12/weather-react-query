import axios from "axios";
import { urls } from "../configs/urls";
import {
  QueryKey,
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";
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
      const res = await axios.get(urls.wetherByCityName(cityName));
      return res.data;
    };

    return useQuery<WeatherResponse, ApiError>({
      queryKey: ["useWeatherByCityName", cityName],
      queryFn: req,
      ...options,
    });
  },
  useWeatherByCityNameMutation: (
    options?: UseMutationOptions<
      WeatherResponse,
      ApiError,
      { cityName: string }
    >
  ) => {
    const req = async ({ cityName }: { cityName: string }) => {
      const res = await axios.get(urls.wetherByCityName(cityName));
      return res.data;
    };

    return useMutation<WeatherResponse, ApiError, { cityName: string }>({
      mutationFn: req,
      ...options,
    });
  },
  useWetherDetailsByCityName: (
    cityName: string,
    options?: UseQueryOptions<ForecastResponse, ApiError>
  ) => {
    const req = async () => {
      console.log(urls.wetherDetailsByCityName(cityName));

      const res = await axios.get(urls.wetherDetailsByCityName(cityName));
      console.log(res.data);
      
      return res.data;
    };

    return useQuery<ForecastResponse, ApiError>({
      queryKey: ["useWetherDetailsByCityName", cityName],
      queryFn: req,
      ...options,
    });
  },
};
