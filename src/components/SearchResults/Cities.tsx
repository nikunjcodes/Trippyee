    'use client'

    import React, { useEffect, useState } from "react"
    import { useLocation, useNavigate } from "react-router-dom"
    import axios from "axios"
    import { motion, AnimatePresence } from "framer-motion"
    import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
    import { Button } from "@/components/ui/button"
    import { Checkbox } from "@/components/ui/checkbox"
    import { StarIcon, Calendar, Clock, ChevronDown, X } from 'lucide-react'
    import { toast } from "@/components/ui/use-toast"
    import { PlusCircle } from 'lucide-react'

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
      Image_url? : string
    }

    interface Place {
      _id: string
      Place: string
      Ratings: number
      Distance: string
      Place_Desc: string
    }
    const UNSPLASH_ACCESS_KEY = "YOUR_API_KEY"; 
    const Cities: React.FC = () => {
      const navigate = useNavigate()
      const [cities, setCities] = useState<City[]>([])
      const [loading, setLoading] = useState(true)
      const [error, setError] = useState<string | null>(null)
      const [expandedCard, setExpandedCard] = useState<string | null>(null)
      const [places, setPlaces] = useState<Place[]>([])
      const [selectedPlaces, setSelectedPlaces] = useState<string[]>([])
      const [estimatedDays, setEstimatedDays] = useState(0)
      const location = useLocation()

      useEffect(() => {
        const fetchCities = async () => {
          try {
            const searchParams = new URLSearchParams(location.search)
            const query = searchParams.get("q") || ""
            const response = await axios.get<City[]>(`http://localhost:5000/api/search?q=${query}`)
      
            // Fetch Unsplash images for each city
            const citiesWithImages = await Promise.all(response.data.map(async (city) => {
              try {
                // Unsplash API call to fetch city image
                const unsplashResponse = await axios.get(
                  `https://api.unsplash.com/search/photos`, 
                  {
                    params: {
                      query: city.City,
                      client_id: UNSPLASH_ACCESS_KEY,
                      per_page: 1,
                    },
                  }
                );
      
                const imageUrl = unsplashResponse.data.results[0]?.urls?.regular || '/placeholder.svg';
                
                return { ...city, Image_url: imageUrl };
              } catch (err) {
                console.error(`Failed to fetch image for ${city.City}`, err);
                return { ...city, Image_url: '/placeholder.svg' }; // Use placeholder if image fetch fails
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
          setSelectedPlaces([])
          setEstimatedDays(0)
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

      const handlePersonalizedTrip = (city: City) => {
        navigate("/personalized-trip", { state: { city } })
      }

      const togglePlaceSelection = (placeId: string) => {
        setSelectedPlaces(prev => 
          prev.includes(placeId) 
            ? prev.filter(id => id !== placeId)
            : [...prev, placeId]
        )
        updateEstimatedDays()
      }

      const updateEstimatedDays = () => {
        const selectedCount = selectedPlaces.length + 1 // +1 to account for the newly selected/deselected place
        setEstimatedDays(Math.ceil(selectedCount / 4)) // Assuming 4 places per day
      }

      const cleanPlaceDescription = (description: string) => {
        return description 
          ? description.replace(/[\[\]\"\'0-9.]/g, '')
          : ''
      }

      const handleCreateItinerary = (city: City) => {
        if (selectedPlaces.length === 0) {
          toast({
            title: "No places selected",
            description: "Please select at least one place to visit before creating your itinerary.",
            variant: "destructive",
          })
          return
        }
        navigate("/trip-details", { 
          state: { 
            city, 
            selectedPlaces: places.filter(place => selectedPlaces.includes(place._id)),
            estimatedDays 
          } 
        })
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

    const handleSubmitNewCity = () => {
      navigate("/submit-city");
    };

    if (loading) {
      return (
        <div className="flex justify-center items-center h-screen bg-gradient-to-br from-green-100 to-blue-100">
          <div className="text-2xl font-semibold text-green-800">Loading...</div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex justify-center items-center h-screen bg-gradient-to-br from-green-100 to-blue-100">
          <div className="text-2xl font-semibold text-red-600">{error}</div>
        </div>
      );
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
          <Card className="w-full max-w-4xl overflow-auto max-h-[90vh] bg-gradient-to-r from-brown-600 to-brown-800 rounded-lg shadow-xl">
            <CardHeader className="bg-blue-500 text-white sticky top-0 z-10 py-4 px-6">
              <CardTitle className="text-3xl font-bold">{expandedCard}</CardTitle>
              <CardDescription className="text-green-100 flex items-center">
                <StarIcon className="w-6 h-6 mr-2 fill-current" />
                {typeof cities.find(c => c.City === expandedCard)?.Ratings === 'number'
                  ? cities.find(c => c.City === expandedCard)?.Ratings.toFixed(1)
                  : 'N/A'}
              </CardDescription>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 text-white hover:bg-red-700"
                onClick={() => setExpandedCard(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="px-6 py-4">
              {places.map(place => (
                <div key={place._id} className="mb-6 flex items-start space-x-4">
                  <Checkbox
                    id={place._id}
                    checked={selectedPlaces.includes(place._id)}
                    onCheckedChange={() => togglePlaceSelection(place._id)}
                    className="checkbox h-6 w-6 border-2 border-green-600 rounded-lg bg-white text-green-600 focus:ring-green-600 focus:ring-4 focus:ring-green-500 checked:bg-green-600 checked:border-green-600 checked:text-white"
                  />
                  <div className="flex-1">
                    <label
                      htmlFor={place._id}
                      className="text-xl font-semibold cursor-pointer flex items-start"
                    >
                      <span className="ml-2">{cleanPlaceDescription(place.Place)}</span>
                    </label>
                    <p className="text-sm text-gray-600 ml-2">
                      <StarIcon className="w-4 h-4 inline-block mr-1 fill-current text-yellow-400" />
                      {place.Ratings ? place.Ratings.toFixed(1) : '4.0'} | {place.Distance}
                    </p>
                    <p className="text-gray-700 ml-2">{cleanPlaceDescription(place.Place_Desc)}</p>
                  </div>
                </div>
              ))}
            </CardContent>
            <CardFooter className="px-6 py-4 flex flex-col items-start space-y-4 bg-green-700 rounded-b-lg">
              <p className="text-lg font-semibold text-white">Estimated trip duration: {estimatedDays} days</p>
              <Button
                onClick={() => handleCreateItinerary(cities.find(c => c.City === expandedCard)!)}
                className="w-full bg-green-800 text-white hover:bg-green-900"
              >
                Create Itinerary with Selected Places
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>

        <div className="fixed bottom-4 right-4">
        <Button onClick={handleSubmitNewCity} className="bg-green-600 hover:bg-green-700 text-white">
          <PlusCircle className="w-5 h-5 mr-2" />
          Submit a New City
        </Button>
        <div>
      <AnimatePresence>
        {expandedCard && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
          >
            {/* Expanded card logic */}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  </div>
  </div>
      )
    }

    export default Cities 