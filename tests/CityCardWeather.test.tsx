import { render, screen, fireEvent } from "@testing-library/react";

import { CityCardWeather } from "../src/components/CityCardWeather";
import { WeatherService } from "../src/services/queryWeather";

jest.mock("../src/services/queryWeather");

const mockedUseWeatherByCityName = WeatherService.useWeatherByCityName as jest.Mock;

describe("CityCardWeather", () => {
  const city = "Kyiv";

  beforeEach(() => {
    mockedUseWeatherByCityName.mockReturnValue({
      data: {
        weather: [{ icon: "01d", description: "clear sky" }],
        main: { temp: 25 },
      },
      refetch: jest.fn(),
      isLoading: false,
      isFetching: false,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders city name, weather description, temp and icon", () => {
    render(
      <CityCardWeather
        city={city}
        isModalOpen={false}
        closeModal={jest.fn()}
        onRemove={jest.fn()}
        onOpenModal={jest.fn()}
      />
    );

    expect(screen.getByText(city)).toBeInTheDocument();
    expect(screen.getByText(/clear sky/i)).toBeInTheDocument();
    expect(screen.getByText(/25°C/)).toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveAttribute(
      "src",
      "https://openweathermap.org/img/wn/01d@2x.png"
    );
  });

  it("calls onOpenModal when clicking city info", () => {
    const onOpenModal = jest.fn();

    render(
      <CityCardWeather
        city={city}
        isModalOpen={false}
        closeModal={jest.fn()}
        onRemove={jest.fn()}
        onOpenModal={onOpenModal}
      />
    );

    fireEvent.click(screen.getByText(city));
    expect(onOpenModal).toHaveBeenCalledWith(city);
  });

  it("calls refetch on Refresh button click", () => {
    const refetch = jest.fn();

    mockedUseWeatherByCityName.mockReturnValueOnce({
      data: {
        weather: [{ icon: "01d", description: "clear sky" }],
        main: { temp: 25 },
      },
      refetch,
      isLoading: false,
      isFetching: false,
    });

    render(
      <CityCardWeather
        city={city}
        isModalOpen={false}
        closeModal={jest.fn()}
        onRemove={jest.fn()}
        onOpenModal={jest.fn()}
      />
    );

    fireEvent.click(screen.getByText("Refresh"));
    expect(refetch).toHaveBeenCalled();
  });

  it("calls onRemove when clicking Remove button", () => {
    const onRemove = jest.fn();

    render(
      <CityCardWeather
        city={city}
        isModalOpen={false}
        closeModal={jest.fn()}
        onRemove={onRemove}
        onOpenModal={jest.fn()}
      />
    );

    fireEvent.click(screen.getByText("Remove"));
    expect(onRemove).toHaveBeenCalledWith(city);
  });
});
