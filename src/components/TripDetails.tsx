"use client";

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  MapPin,
  Download,
  Star,
  ArrowLeft,
  Users,
  DollarSign,
  Hotel,
  Cloud,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Place {
  _id: string;
  Place: string;
  Ratings: number;
  Distance: string;
  Place_Desc: string;
}

interface City {
  _id: string;
  City: string;
  Low_Budget_Per_Day: number;
  Medium_Budget_Per_Day: number;
  High_Budget_Per_Day: number;
}

interface TripDetails {
  startDate: string;
  endDate: string;
  tripType: string;
  members: number;
  budget: "low" | "medium" | "high";
}

interface Activity {
  name: string;
  description: string;
  rating: number;
  distance: string;
}

interface ItineraryDay {
  day: number;
  activities: Activity[];
}

interface HotelData {
  name: string;
  type: string;
  thumbnail_url: string;
  link: string;
}
interface WeatherData {
  datetimeStr: string;
  maxt: number;
  mint: number;
  wdir: number;
  uvindex: number;
  preciptype: string;
  conditions: string;
}

export default function TripDetails() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const city = location.state?.city as City;
  const selectedPlaces = location.state?.selectedPlaces as Place[];
  const estimatedDays = location.state?.estimatedDays as number;

  const [tripDetails, setTripDetails] = useState<TripDetails>({
    startDate: "",
    endDate: "",
    tripType: "solo",
    members: 1,
    budget: "medium",
  });

  const [totalBudget, setTotalBudget] = useState(0);
  const [itinerary, setItinerary] = useState<ItineraryDay[]>([]);
  const [hotels, setHotels] = useState<HotelData[]>([]);
  const [hotelLoading, setHotelLoading] = useState(false);
  const [hotelError, setHotelError] = useState<string | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState<string | null>(null);
  useEffect(() => {
    if (!city || !selectedPlaces || !estimatedDays) {
      setError(
        "Missing trip information. Please go back and select a city and places to visit."
      );
      return;
    }

    const defaultEndDate = new Date();
    defaultEndDate.setDate(defaultEndDate.getDate() + estimatedDays);
    setTripDetails((prev) => ({
      ...prev,
      endDate: defaultEndDate.toISOString().split("T")[0],
    }));
  }, [city, selectedPlaces, estimatedDays]);

  useEffect(() => {
    calculateTotalBudget();
  }, [tripDetails, city]);
  const fetchWeatherData = async () => {
    if (!city) return;

    setWeatherLoading(true);
    setWeatherError(null);

    const options = {
      method: "GET",
      url: "https://visual-crossing-weather.p.rapidapi.com/forecast",
      params: {
        aggregateHours: "24",
        location: city.City,
        contentType: "json",
        unitGroup: "metric",
        shortColumnNames: "false",
      },
      headers: {
        "X-RapidAPI-Key": "10a86fb255msh9bb3fc843ce0a1ep1b889fjsn0b3c40a85deb",
        "X-RapidAPI-Host": "visual-crossing-weather.p.rapidapi.com",
      },
    };

    try {
      const response = await axios.request(options);
      const forecastData = response.data.locations[city.City].values;
      setWeatherData(forecastData.slice(0, 7)); // Get forecast for 7 days
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setWeatherError("Failed to fetch weather data");
    }

    setWeatherLoading(false);
  };
  const calculateTotalBudget = () => {
    if (!city || !tripDetails.startDate || !tripDetails.endDate) return;

    const budgetPerDay =
      tripDetails.budget === "low"
        ? city.Low_Budget_Per_Day
        : tripDetails.budget === "medium"
        ? city.Medium_Budget_Per_Day
        : city.High_Budget_Per_Day;

    const tripDuration = Math.ceil(
      (new Date(tripDetails.endDate).getTime() -
        new Date(tripDetails.startDate).getTime()) /
        (1000 * 3600 * 24)
    );
    const calculatedTotalBudget =
      budgetPerDay * tripDetails.members * tripDuration;

    setTotalBudget(calculatedTotalBudget);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTripDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setTripDetails((prev) => ({ ...prev, [name]: value }));
  };

  const searchHotels = async () => {
    if (!city) return;

    setHotelLoading(true);
    setHotelError(null);

    try {
      const options = {
        method: "GET",
        url: `https://tripadvisor16.p.rapidapi.com/api/v1/hotels/searchLocation`,
        params: { query: city.City },
        headers: {
          "x-rapidapi-key":
            "10a86fb255msh9bb3fc843ce0a1ep1b889fjsn0b3c40a85deb",
          "x-rapidapi-host": "tripadvisor16.p.rapidapi.com",
        },
      };

      const response = await axios.request(options);
      setHotels(response.data.data);
    } catch (err) {
      console.error("Error fetching hotels:", err);
      setHotelError("Failed to fetch hotel data");
    }

    setHotelLoading(false);
  };

  const generateItinerary = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post<ItineraryDay[]>(
        "https://trippyee.onrender.com/api/itinerary",
        {
          cityName: city.City,
          tripDetails,
          selectedPlaces,
        }
      );
      setItinerary(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error generating itinerary:", err);
      setError("Failed to generate itinerary. Please try again.");
      setLoading(false);
    }
  };

  const downloadItinerary = () => {
    const itineraryText = generateItineraryText();
    const blob = new Blob([itineraryText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${city?.City}_Itinerary.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateItineraryText = () => {
    let text = `Itinerary for ${city?.City}\n`;
    text += `Trip Dates: ${new Date(
      tripDetails?.startDate || ""
    ).toLocaleDateString()} - ${new Date(
      tripDetails?.endDate || ""
    ).toLocaleDateString()}\n`;
    text += `Number of Members: ${tripDetails?.members}\n`;
    text += `Budget Level: ${tripDetails?.budget}\n`;
    text += `Estimated Total Budget: ₹${totalBudget.toFixed(2)}\n\n`;

    itinerary.forEach((day) => {
      text += `Day ${day.day}:\n`;
      day.activities.forEach((activity) => {
        text += `- ${activity.name}\n`;
        text += `  Description: ${activity.description}\n`;
        text += `  Rating: ${
          activity.rating !== undefined ? activity.rating.toFixed(1) : "N/A"
        } stars\n`;
        text += `  Distance: ${activity.distance}\n`;
        text += `\n`;
      });
      text += "\n";
    });

    return text;
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-red-600">
              Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">{error}</p>
            <Button onClick={() => navigate(-1)} className="w-full">
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 p-8">
      <Card className="max-w-4xl mx-auto shadow-lg">
        <CardHeader className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
          <CardTitle className="text-3xl font-bold">
            Plan Your Trip to {city?.City}
          </CardTitle>
          <CardDescription className="text-green-100">
            Fill in the details to create your personalized itinerary
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              generateItinerary();
            }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={tripDetails.startDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={tripDetails.endDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="tripType">Trip Type</Label>
              <Select
                onValueChange={(value) => handleSelectChange("tripType", value)}
                defaultValue={tripDetails.tripType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select trip type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="solo">Solo</SelectItem>
                  <SelectItem value="couple">Couple</SelectItem>
                  <SelectItem value="family">Family</SelectItem>
                  <SelectItem value="friends">Friends</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="members">Number of People</Label>
              <Input
                id="members"
                name="members"
                type="number"
                min="1"
                value={tripDetails.members}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="budget">Budget</Label>
              <Select
                onValueChange={(value) =>
                  handleSelectChange(
                    "budget",
                    value as "low" | "medium" | "high"
                  )
                }
                defaultValue={tripDetails.budget}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select budget" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="bg-green-100 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                Trip Summary
              </h3>
              <p>
                <strong>Estimated Days:</strong> {estimatedDays}
              </p>
              <p>
                <strong>Selected Places:</strong> {selectedPlaces.length}
              </p>
              <p>
                <strong>Estimated Budget:</strong> ₹{totalBudget.toFixed(2)}
              </p>
            </div>
            <Button
              type="submit"
              className="w-full bg-black "
              disabled={loading}
            >
              {loading ? "Generating Itinerary..." : "Generate Itinerary"}
            </Button>
          </form>

          {itinerary.length > 0 && (
            <div className="mt-8">
              <Button
                onClick={downloadItinerary}
                className="mb-6 w-full sm:w-auto"
                variant="outline"
              >
                <Download className="mr-2" />
                Download Itinerary
              </Button>
              <Tabs defaultValue="itinerary">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
                  <TabsTrigger value="hotels">Hotels</TabsTrigger>
                  <TabsTrigger value="weather">Weather</TabsTrigger>
                </TabsList>
                <TabsContent value="itinerary">
                  <Accordion
                    type="single"
                    collapsible
                    className="w-full space-y-4"
                  >
                    {itinerary.map((day) => (
                      <AccordionItem
                        key={day.day}
                        value={`day-${day.day}`}
                        className="border rounded-lg overflow-hidden"
                      >
                        <AccordionTrigger className="text-xl font-semibold text-green-800 p-4 hover:bg-green-50">
                          Day {day.day}
                        </AccordionTrigger>
                        <AccordionContent className="p-4 bg-white">
                          <ul className="space-y-4">
                            {day.activities.map((activity, index) => (
                              <li
                                key={index}
                                className="border-b pb-4 last:border-b-0 last:pb-0"
                              >
                                <h3 className="font-bold text-lg text-green-700">
                                  {activity.name}
                                </h3>
                                <p className="text-gray-600 mt-1">
                                  {activity.description}
                                </p>
                                <div className="flex items-center mt-2 text-sm text-gray-500">
                                  <Star className="w-4 h-4 text-yellow-400 mr-1" />
                                  <span>
                                    {activity.rating
                                      ? activity.rating.toFixed(1)
                                      : "4.0"}{" "}
                                    stars
                                  </span>
                                  <MapPin className="w-4 h-4 text-blue-500 ml-4 mr-1" />
                                  <span>{activity.distance}</span>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </TabsContent>
                <TabsContent value="hotels">
                  <Card>
                    <CardHeader>
                      <CardTitle>Hotels in {city?.City}</CardTitle>
                      <CardDescription>
                        Find the perfect place for your stay
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button
                        onClick={searchHotels}
                        disabled={hotelLoading}
                        className="mb-4"
                        style={{ color: "black" }}
                      >
                        <Hotel className="w-4 h-4 mr-2" />
                        {hotelLoading ? "Searching..." : "Search Hotels"}
                      </Button>
                      {hotelError && (
                        <p className="text-red-500 mb-4">{hotelError}</p>
                      )}
                      {hotelLoading && <Skeleton className="h-40 w-full" />}
                      {hotels.length > 0 && (
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {hotels.map((hotel) => (
                            <li
                              key={hotel.link}
                              className="border rounded-lg overflow-hidden"
                            >
                              <img
                                src={hotel.thumbnail_url}
                                alt={hotel.name}
                                className="w-full h-40 object-cover"
                              />
                              <div className="p-4">
                                <h3 className="font-bold text-lg">
                                  {hotel.name}
                                </h3>
                                <p className="text-gray-600">{hotel.type}</p>
                                <a
                                  href={hotel.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="mt-2 inline-block"
                                >
                                  <Button variant="outline">
                                    View Details
                                  </Button>
                                </a>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                      {hotels.length === 0 && !hotelLoading && (
                        <p className="text-center text-gray-500">
                          No hotels found. Try searching to see available
                          options.
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="weather">
                  <Card>
                    <CardHeader>
                      <CardTitle>Weather in {city?.City}</CardTitle>
                      <CardDescription>
                        7-day weather forecast for your trip
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button
                        onClick={fetchWeatherData}
                        disabled={weatherLoading}
                        className="mb-4 bg-black"
                      >
                        <Cloud className="w-4 h-4 mr-2" />
                        {weatherLoading
                          ? "Fetching Weather..."
                          : "Get Weather Forecast"}
                      </Button>
                      {weatherError && (
                        <p className="text-red-500 mb-4">{weatherError}</p>
                      )}
                      {weatherLoading && <Skeleton className="h-40 w-full" />}
                      {weatherData.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {weatherData.map((day, index) => (
                            <Card key={index} className="bg-white shadow-sm">
                              <CardContent className="p-4">
                                <p className="font-semibold">
                                  {new Date(
                                    day.datetimeStr
                                  ).toLocaleDateString()}
                                </p>
                                <p className="text-2xl font-bold mt-2">
                                  {day.maxt}°C / {day.mint}°C
                                </p>
                                <p className="text-gray-600 mt-1">
                                  {day.conditions}
                                </p>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                      {weatherData.length === 0 && !weatherLoading && (
                        <p className="text-center text-gray-500">
                          No weather data available. Click the button to fetch
                          the forecast.
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
