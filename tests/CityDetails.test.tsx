import { render, screen } from "@testing-library/react";

import { CityDetails } from "../src/components/CityWeatherDetails";
import { WeatherService } from "../src/services/queryWeather";

jest.mock("../src/services/queryWeather");

const mockedUseWeatherByCityName = WeatherService.useWeatherByCityName as jest.Mock;
const mockedUseWeatherDetailsByCityName = WeatherService.useWeatherDetailsByCityName as jest.Mock;

describe("CityDetails", () => {
  const city = "Kyiv";

  beforeEach(() => {
    mockedUseWeatherByCityName.mockReturnValue({
      data: {
        weather: [{ icon: "01d", description: "clear sky" }],
        main: { temp: 25 },
      },
      isLoading: false,
    });

    mockedUseWeatherDetailsByCityName.mockReturnValue({
      data: {
        list: Array(12)
          .fill(null)
          .map((_, i) => ({
            dt: 1620000000 + i * 3600,
            main: { temp: 20 + i },
          })),
      },
      isLoading: false,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders city name, weather and hourly chart", () => {
    render(<CityDetails city={city} />);

    expect(screen.getByText(city)).toBeInTheDocument();
    expect(screen.getByText(/clear sky/i)).toBeInTheDocument();
    expect(screen.getByText(/25°C/)).toBeInTheDocument();
    expect(screen.getByText(/Hourly Temperature Forecast/i)).toBeInTheDocument();

    expect(screen.getByRole("img", { hidden: true })).toBeInTheDocument();
  });
});
