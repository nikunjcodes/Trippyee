'use client'

import React, { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import axios from "axios"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StarIcon, Calendar, Clock, ChevronDown, X } from "lucide-react"

interface City {
  _id: string
  City: string
  Ratings: number
  City_desc: string
  Min_no_of_days: number
  Max_no_of_days: number
  Low_Budget_Per_Day: number
  Medium_Budget_Per_Day: number
  High_Budget_Per_Day: number
  Ideal_duration: string
  Best_time_to_visit: string
  Image_url: string // New field for city image
}

interface Place {
  _id: string
  Place: string
  Ratings: number
  Distance: string
  Place_Desc: string
}

const Cities: React.FC = () => {
  const navigate = useNavigate()
  
  const handlePersonalizedTrip = (city: City) => {
    navigate("/personalized-trip", { state: { city } })
  }

  const cleanPlaceDescription = (description: string) => {
    return description 
      ? description.replace(/[\[\]\"\'0-9.]/g, '')
      : ''
  }

  const [cities, setCities] = useState<City[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedCard, setExpandedCard] = useState<string | null>(null)
  const [places, setPlaces] = useState<Place[]>([])
  const location = useLocation()

useEffect(() => {
  const fetchCities = async () => {
    try {
      const searchParams = new URLSearchParams(location.search);
      const query = searchParams.get("q") || "";
      const response = await axios.get<City[]>(`http://localhost:5000/api/search?q=${query}`);
      
      // Fetch images for each city
      const citiesWithImages = await Promise.all(response.data.map(async (city) => {
        const options = {
          method: 'GET',
          url: `https://tripadvisor16.p.rapidapi.com/api/v1/hotels/searchLocation`,
          params: { query: city.City },
          headers: {
            'x-rapidapi-key': 'd3e87dc719mshd869306fc6e8f5cp19e110jsnd0e0df1bdeb8',
            'x-rapidapi-host': 'tripadvisor16.p.rapidapi.com',
          },
        };
        
        try {
          const imageResponse = await axios.request(options);
          const cityData = imageResponse.data.data; // Use the correct path to access the city data

          // If cityData is not empty, fetch the image URL using the geoId
          if (cityData.length > 0) {
            const geoId = cityData[0].geoId;
            const imageOptions = {
              method: 'GET',
              url: `https://tripadvisor16.p.rapidapi.com/api/v1/hotels/getDetails`,
              params: { geoId },
              headers: {
                'x-rapidapi-key': 'd3e87dc719mshd869306fc6e8f5cp19e110jsnd0e0df1bdeb8',
                'x-rapidapi-host': 'tripadvisor16.p.rapidapi.com',
              },
            };

            // Fetching details to get the image URL
            const detailsResponse = await axios.request(imageOptions);
            const imageUrl = detailsResponse.data.data?.images[0]?.url || '/placeholder.svg'; // Adjust according to the response structure
            return { ...city, Image_url: imageUrl };
          } else {
            return { ...city, Image_url: '/placeholder.svg' };
          }
        } catch (error) {
          console.error(`Failed to fetch image for ${city.City}:`, error);
          return { ...city, Image_url: '/placeholder.svg' };
        }
      }));

      setCities(citiesWithImages);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch cities. Please try again.");
      setLoading(false);
    }
  };

  fetchCities();
}, [location.search]);


  const toggleCardExpansion = async (cityName: string) => {
    if (expandedCard === cityName) {
      setExpandedCard(null)
      setPlaces([])
    } else {
      setExpandedCard(cityName)
      try {
        const response = await axios.get<Place[]>(`http://localhost:5000/api/places/${encodeURIComponent(cityName)}`)
        setPlaces(response.data)
      } catch (err) {
        console.error("Failed to fetch places:", err)
      }
    }
  }

  const parseDistance = (distanceString: string): number => {
    const match = distanceString.match(/(\d+\.?\d*)\s*km/)
    return match ? parseFloat(match[1]) : 0
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-green-100 to-blue-100">
        <div className="text-2xl font-semibold text-green-800">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-green-100 to-blue-100">
        <div className="text-2xl font-semibold text-red-600">{error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-green-800 mb-12">Discover Amazing Cities</h1>
        {cities.length === 0 ? (
          <div className="text-2xl font-semibold text-center text-green-800">No cities found. Try a different search.</div>
        ) : (
          <div className="space-y-8">
            {cities.map((city) => (
              <motion.div
                key={city._id}
                layout
                transition={{ duration: 0.3 }}
                className={expandedCard && expandedCard !== city.City ? "filter blur-sm" : ""}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col md:flex-row">
                  <div className="md:w-1/3">
                    <img src={city.Image_url} alt={city.City} className="w-full h-full object-cover" />
                  </div>
                  <div className="md:w-2/3 flex flex-col">
                    <CardHeader className="bg-green-600 text-white">
                      <CardTitle className="text-2xl">{city.City}</CardTitle>
                      <CardDescription className="text-green-100 flex items-center">
                        <StarIcon className="w-5 h-5 mr-1 fill-current" />
                        {city.Ratings ? city.Ratings.toFixed(1) : '3.8'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 flex-grow">
                      <p className="text-sm text-gray-600 mb-4 flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span className="font-semibold mr-2">Best time to visit:</span> {city.Best_time_to_visit}
                      </p>
                      <p className="text-sm text-gray-600 mb-4 flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        <span className="font-semibold mr-2">Ideal duration:</span> {city.Min_no_of_days} - {city.Max_no_of_days} days
                      </p>
                      <p className="text-gray-700 line-clamp-4">{city.City_desc}</p>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                      <Button 
                        onClick={() => toggleCardExpansion(city.City)}
                        variant="outline"
                        className="w-full"
                      >
                        <ChevronDown className="w-4 h-4 mr-2" />
                        {expandedCard === city.City ? "See Less" : "See More"}
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full"
                        style={{backgroundColor: "black", color: "white"}}
                        onClick={() => handlePersonalizedTrip(city)}
                      >
                        Personalized Trip
                      </Button>
                    </CardFooter>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      <AnimatePresence>
        {expandedCard && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
          >
            <Card className="w-full max-w-4xl overflow-auto max-h-[90vh]">
              <CardHeader className="bg-green-600 text-white sticky top-0 z-10">
                <CardTitle className="text-3xl">{expandedCard}</CardTitle>
                <CardDescription className="text-green-100 flex items-center">
  <StarIcon className="w-6 h-6 mr-2 fill-current" />
  {typeof cities.find(c => c.City === expandedCard)?.Ratings === 'number' 
    ? cities.find(c => c.City === expandedCard)?.Ratings.toFixed(1) 
    : 'N/A'}
</CardDescription>

                <Button
                  variant="ghost"
                  size="icon"
                  style={{zIndex:100}}
                  className="absolute top-2 right-2 text-white hover:bg-green-700"
                  onClick={() => {setExpandedCard(null)
                    console.log("Expanded card")
                  }
                  }
                >
                  <X />
                </Button>
              </CardHeader>
              <CardContent>
                {places.map(place => (
                  <div key={place._id} className="mb-4">
                    <h3 className="text-lg font-semibold">{cleanPlaceDescription(place.Place)}</h3>
                    <p className="text-sm text-gray-600">
                      <StarIcon className="w-4 h-4 inline-block mr-1 fill-current" />
                      {place.Ratings ? place.Ratings.toFixed(1) : '4.0'} | {parseDistance(place.Distance)} km away
                    </p>
                    <p className="text-gray-700">{cleanPlaceDescription(place.Place_Desc)}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Cities
