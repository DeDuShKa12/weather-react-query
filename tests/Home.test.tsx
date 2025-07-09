import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import { Home } from "../src/pages/Home";
import * as WeatherService from "../src/services/queryWeather";

jest.mock("../src/services/queryWeather");

const mockUseWeatherByCityName = WeatherService.WeatherService.useWeatherByCityName as jest.Mock;
const mockUseWeatherByCityNameMutation = WeatherService.WeatherService
  .useWeatherByCityNameMutation as jest.Mock;
const mockUseWeatherDetailsByCityName = WeatherService.WeatherService
  .useWeatherDetailsByCityName as jest.Mock;

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: jest.fn(),
  useNavigate: jest.fn(),
}));

describe("Home component", () => {
  const mockNavigate = jest.fn();
  const mockUseLocation = require("react-router-dom").useLocation;

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseLocation.mockReturnValue({
      search: "",
    });

    const { useNavigate } = require("react-router-dom");
    useNavigate.mockReturnValue(mockNavigate);

    mockUseWeatherByCityName.mockReturnValue({
      data: {
        weather: [{ description: "clear sky", icon: "01d" }],
        main: { temp: 25 },
      },
      refetch: jest.fn(),
      isLoading: false,
      isFetching: false,
    });

    mockUseWeatherDetailsByCityName.mockReturnValue({
      data: {
        hourly: [],
        daily: [],
      },
      isLoading: false,
    });

    mockUseWeatherByCityNameMutation.mockReturnValue({
      mutate: jest.fn(() => Promise.resolve()),
      isError: false,
      error: null,
    });

    Storage.prototype.getItem = jest.fn(() => JSON.stringify(["Kyiv", "Lviv"]));
    Storage.prototype.setItem = jest.fn();
  });

  it("renders cities from localStorage", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(screen.getByText("Kyiv")).toBeInTheDocument();
    expect(screen.getByText("Lviv")).toBeInTheDocument();
  });

  it("adds new city when clicking Add", async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText("Enter a city...");
    const addButton = screen.getByText("Add");

    fireEvent.change(input, { target: { value: "Odesa" } });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(mockUseWeatherByCityNameMutation().mutate).toHaveBeenCalledWith({
        cityName: "Odesa",
      });
    });
  });

  it("opens modal when URL query param has city", () => {
    mockUseLocation.mockReturnValueOnce({
      search: "?city=Kyiv",
    });

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(screen.getByText("Kyiv")).toBeInTheDocument();
  });

  it("removes city when Remove clicked", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    const removeButtons = screen.getAllByText("Remove");
    fireEvent.click(removeButtons[0]);

    expect(screen.queryByText("Kyiv")).not.toBeInTheDocument();
  });

  it("shows error alert if mutation has error", () => {
    mockUseWeatherByCityNameMutation.mockReturnValueOnce({
      mutate: jest.fn(),
      isError: true,
      error: { message: "City not found" },
    });

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(screen.getByRole("alert")).toHaveTextContent("City not found");
  });
});
