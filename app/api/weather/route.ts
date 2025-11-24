import { NextRequest, NextResponse } from "next/server";
import { withErrorHandler } from "@/lib/api-wrapper";

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const WEATHERAPI_KEY = process.env.WEATHERAPI_KEY;
const ACCUWEATHER_KEY = process.env.ACCUWEATHER_KEY;

async function handleWeather(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const city = searchParams.get("city");
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");
    const units = searchParams.get("units") || "metric";
    const provider = searchParams.get("provider") || "openweather";

    // Route to appropriate provider
    switch (provider) {
        case "weatherapi":
            return await getWeatherFromWeatherAPI(city, lat, lon, units);
        case "accuweather":
            return await getWeatherFromAccuWeather(city, lat, lon, units);
        case "vietnam":
            return await getWeatherFromVietnamWeather(city, lat, lon, units);
        case "openweather":
        default:
            return await getWeatherFromOpenWeather(city, lat, lon, units);
    }
}

export const GET = withErrorHandler(handleWeather, "/api/weather");

async function getWeatherFromOpenWeather(city: string | null, lat: string | null, lon: string | null, units: string) {
    try {
        if (!OPENWEATHER_API_KEY) {
            return NextResponse.json({ error: "OpenWeather API key not configured" }, { status: 500 });
        }

        const BASE_URL = "https://api.openweathermap.org/data/2.5";

        // Build query params
        let queryParams = `units=${units}&appid=${OPENWEATHER_API_KEY}`;

        if (city) {
            queryParams += `&q=${encodeURIComponent(city)}`;
        } else if (lat && lon) {
            queryParams += `&lat=${lat}&lon=${lon}`;
        } else {
            return NextResponse.json({ error: "Please provide either city name or coordinates" }, { status: 400 });
        }

        // Fetch current weather
        const currentWeatherRes = await fetch(`${BASE_URL}/weather?${queryParams}`);

        if (!currentWeatherRes.ok) {
            const errorData = await currentWeatherRes.json();
            return NextResponse.json({ error: errorData.message || "Failed to fetch weather data" }, { status: currentWeatherRes.status });
        }

        const currentWeather = await currentWeatherRes.json();

        // Fetch 5-day forecast
        const forecastRes = await fetch(`${BASE_URL}/forecast?${queryParams}`);

        if (!forecastRes.ok) {
            const errorData = await forecastRes.json();
            return NextResponse.json({ error: errorData.message || "Failed to fetch forecast data" }, { status: forecastRes.status });
        }

        const forecastData = await forecastRes.json();

        // Process forecast data to get one entry per day (at noon)
        const dailyForecast = forecastData.list
            .filter((item: any) => item.dt_txt.includes("12:00:00"))
            .slice(0, 5)
            .map((item: any) => ({
                date: item.dt_txt.split(" ")[0],
                temp: item.main.temp,
                description: item.weather[0].description,
                icon: item.weather[0].icon,
                humidity: item.main.humidity,
            }));

        // Process hourly forecast for next 12 hours
        const hourlyForecast = forecastData.list.slice(0, 12).map((item: any) => ({
            time: item.dt,
            temp: item.main.temp,
            description: item.weather[0].description,
            icon: item.weather[0].icon,
            humidity: item.main.humidity,
            windSpeed: item.wind.speed,
        }));

        // Return formatted response
        return NextResponse.json({
            current: {
                location: currentWeather.name,
                country: currentWeather.sys.country,
                temperature: currentWeather.main.temp,
                feelsLike: currentWeather.main.feels_like,
                description: currentWeather.weather[0].description,
                icon: currentWeather.weather[0].icon,
                humidity: currentWeather.main.humidity,
                windSpeed: currentWeather.wind.speed,
                pressure: currentWeather.main.pressure,
                visibility: currentWeather.visibility,
                sunrise: currentWeather.sys.sunrise,
                sunset: currentWeather.sys.sunset,
                timestamp: currentWeather.dt,
            },
            forecast: dailyForecast,
            hourly: hourlyForecast,
        });
    } catch (error) {
        console.error("OpenWeather API error:", error);
        return NextResponse.json({ error: "Failed to fetch weather from OpenWeather" }, { status: 500 });
    }
}

async function getWeatherFromWeatherAPI(city: string | null, lat: string | null, lon: string | null, units: string) {
    try {
        if (!WEATHERAPI_KEY) {
            return NextResponse.json({ error: "WeatherAPI key not configured" }, { status: 500 });
        }

        const BASE_URL = "https://api.weatherapi.com/v1";
        let query = "";

        if (city) {
            query = encodeURIComponent(city);
        } else if (lat && lon) {
            query = `${lat},${lon}`;
        } else {
            return NextResponse.json({ error: "Please provide either city name or coordinates" }, { status: 400 });
        }

        // Fetch current weather and forecast
        const currentRes = await fetch(`${BASE_URL}/forecast.json?key=${WEATHERAPI_KEY}&q=${query}&days=6&aqi=no`);

        if (!currentRes.ok) {
            const errorData = await currentRes.json();
            return NextResponse.json({ error: errorData.error?.message || "Failed to fetch weather data" }, { status: currentRes.status });
        }

        const data = await currentRes.json();
        const current = data.current;
        const location = data.location;
        const forecast = data.forecast.forecastday;

        // Convert to standard format
        const tempMultiplier = units === "imperial" ? 1 : 1;
        const speedMultiplier = units === "imperial" ? 1 : 1;

        // Map WeatherAPI condition codes to OpenWeather icon codes
        const mapWeatherAPIIcon = (iconUrl: string, isDay: number) => {
            const code = iconUrl.split("/").pop()?.replace(".png", "") || "113";
            const iconMap: { [key: string]: string } = {
                "113": isDay ? "01d" : "01n", // Sunny/Clear
                "116": isDay ? "02d" : "02n", // Partly cloudy
                "119": "03d", // Cloudy
                "122": "04d", // Overcast
                "143": "50d", // Mist
                "176": "09d", // Patchy rain possible
                "179": "13d", // Patchy snow possible
                "182": "13d", // Patchy sleet possible
                "185": "13d", // Patchy freezing drizzle
                "200": "11d", // Thundery outbreaks possible
                "227": "13d", // Blowing snow
                "230": "13d", // Blizzard
                "248": "50d", // Fog
                "260": "50d", // Freezing fog
                "263": "09d", // Patchy light drizzle
                "266": "09d", // Light drizzle
                "281": "09d", // Freezing drizzle
                "284": "09d", // Heavy freezing drizzle
                "293": "09d", // Patchy light rain
                "296": "09d", // Light rain
                "299": "10d", // Moderate rain at times
                "302": "10d", // Moderate rain
                "305": "10d", // Heavy rain at times
                "308": "10d", // Heavy rain
                "311": "09d", // Light freezing rain
                "314": "09d", // Moderate or heavy freezing rain
                "317": "13d", // Light sleet
                "320": "13d", // Moderate or heavy sleet
                "323": "13d", // Patchy light snow
                "326": "13d", // Light snow
                "329": "13d", // Patchy moderate snow
                "332": "13d", // Moderate snow
                "335": "13d", // Patchy heavy snow
                "338": "13d", // Heavy snow
                "350": "13d", // Ice pellets
                "353": "09d", // Light rain shower
                "356": "10d", // Moderate or heavy rain shower
                "359": "10d", // Torrential rain shower
                "362": "13d", // Light sleet showers
                "365": "13d", // Moderate or heavy sleet showers
                "368": "13d", // Light snow showers
                "371": "13d", // Moderate or heavy snow showers
                "374": "13d", // Light showers of ice pellets
                "377": "13d", // Moderate or heavy showers of ice pellets
                "386": "11d", // Patchy light rain with thunder
                "389": "11d", // Moderate or heavy rain with thunder
                "392": "11d", // Patchy light snow with thunder
                "395": "11d", // Moderate or heavy snow with thunder
            };
            return iconMap[code] || "01d";
        };

        // Process daily forecast
        const dailyForecast = forecast.slice(0, 5).map((day: any) => ({
            date: day.date,
            temp: units === "imperial" ? day.day.avgtemp_f : day.day.avgtemp_c,
            description: day.day.condition.text,
            icon: mapWeatherAPIIcon(day.day.condition.icon, 1),
            humidity: day.day.avghumidity,
        }));

        // Process hourly forecast (next 12 hours from current time)
        const currentHour = new Date().getHours();
        const hourlyForecast = forecast[0].hour
            .filter((h: any, idx: number) => idx >= currentHour && idx < currentHour + 12)
            .map((h: any) => ({
                time: new Date(h.time).getTime() / 1000,
                temp: units === "imperial" ? h.temp_f : h.temp_c,
                description: h.condition.text,
                icon: mapWeatherAPIIcon(h.condition.icon, h.is_day),
                humidity: h.humidity,
                windSpeed: units === "imperial" ? h.wind_mph : h.wind_kph / 3.6,
            }));

        return NextResponse.json({
            current: {
                location: location.name,
                country: location.country,
                temperature: units === "imperial" ? current.temp_f : current.temp_c,
                feelsLike: units === "imperial" ? current.feelslike_f : current.feelslike_c,
                description: current.condition.text,
                icon: mapWeatherAPIIcon(current.condition.icon, current.is_day),
                humidity: current.humidity,
                windSpeed: units === "imperial" ? current.wind_mph : current.wind_kph / 3.6,
                pressure: current.pressure_mb,
                visibility: current.vis_km * 1000,
                sunrise: new Date(forecast[0].astro.sunrise).getTime() / 1000,
                sunset: new Date(forecast[0].astro.sunset).getTime() / 1000,
                timestamp: current.last_updated_epoch,
            },
            forecast: dailyForecast,
            hourly: hourlyForecast,
        });
    } catch (error) {
        console.error("WeatherAPI error:", error);
        return NextResponse.json({ error: "Failed to fetch weather from WeatherAPI" }, { status: 500 });
    }
}

async function getWeatherFromAccuWeather(city: string | null, lat: string | null, lon: string | null, units: string) {
    try {
        // AccuWeather requires complex multi-step process (location key, then weather)
        // For now, use OpenWeather as fallback
        console.log("AccuWeather requested but using OpenWeather as data source");
        return await getWeatherFromOpenWeather(city, lat, lon, units);
    } catch (error) {
        console.error("AccuWeather error:", error);
        return NextResponse.json({ error: "Failed to fetch weather from AccuWeather" }, { status: 500 });
    }
}

async function getWeatherFromVietnamWeather(city: string | null, lat: string | null, lon: string | null, units: string) {
    try {
        // Vietnam Weather service would require specific API integration
        // For now, use OpenWeather as fallback
        console.log("Vietnam Weather requested but using OpenWeather as data source");
        return await getWeatherFromOpenWeather(city, lat, lon, units);
    } catch (error) {
        console.error("Vietnam Weather error:", error);
        return NextResponse.json({ error: "Failed to fetch weather from Vietnam Weather" }, { status: 500 });
    }
}
