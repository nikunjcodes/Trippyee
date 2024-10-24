import React, { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import axios from "axios"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StarIcon, Calendar, Clock, ChevronDown, ChevronUp, X, Cherry } from "lucide-react"

interface City {
  _id: string
  City: string
  Ratings: number
  Ideal_duration: string
  Best_time_to_visit: string
  City_desc: string[]
}

const Cities: React.FC = () => {
  const [cities, setCities] = useState<City[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedCard, setExpandedCard] = useState<string | null>(null)
  const location = useLocation()

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const searchParams = new URLSearchParams(location.search)
        const query = searchParams.get("q") || ""
        const response = await axios.get<City[]>(`http://localhost:5000/api/search?q=${query}`)
        setCities(response.data)
        setLoading(false)
      } catch (err) {
        setError("Failed to fetch cities. Please try again.")
        setLoading(false)
      }
    }

    fetchCities()
  }, [location.search])

  const toggleCardExpansion = (cityId: string) => {
    setExpandedCard(expandedCard === cityId ? null : cityId)
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cities.map((city) => (
              <motion.div
                key={city._id}
                layout
                transition={{ duration: 0.3 }}
                className={expandedCard && expandedCard !== city._id ? "filter blur-sm" : ""}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="bg-green-600 text-white">
                    <CardTitle className="text-2xl">{city.City}</CardTitle>
                    <CardDescription className="text-green-100 flex items-center">
                      <StarIcon className="w-5 h-5 mr-1 fill-current" />
                      {city.Ratings.toFixed(1)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <p className="text-sm text-gray-600 mb-4 flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span className="font-semibold mr-2">Best time to visit:</span> {city.Best_time_to_visit}
                    </p>
                    <p className="text-sm text-gray-600 mb-4 flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      <span className="font-semibold mr-2">Ideal duration:</span> {city.Ideal_duration} days
                    </p>
                    <p className="text-gray-700 line-clamp-4">{city.City_desc}</p>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      onClick={() => toggleCardExpansion(city._id)}
                      variant="outline"
                      className="w-full mt-4"
                    >
                      <ChevronDown className="w-4 h-4 mr-2" />
                      See More
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full mt-4"
                      style={{backgroundColor: "black", color: "white"}}
                      >
                        Personlized Trip
                      </Button>
                  </CardFooter>
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
                <CardTitle className="text-3xl">{cities.find(c => c._id === expandedCard)?.City}</CardTitle>
                <CardDescription className="text-green-100 flex items-center">
                  <StarIcon className="w-6 h-6 mr-2 fill-current" />
                  {cities.find(c => c._id === expandedCard)?.Ratings.toFixed(1)}
                </CardDescription>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 text-white hover:bg-green-700"
                  onClick={() => setExpandedCard(null)}
                >
                  <X className="w-6 h-6" />
                </Button>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-lg text-gray-600 mb-6 flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  <span className="font-semibold mr-2">Best time to visit:</span>
                  {cities.find(c => c._id === expandedCard)?.Best_time_to_visit}
                </p>
                <p className="text-lg text-gray-600 mb-6 flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  <span className="font-semibold mr-2">Ideal duration:</span>
                  {cities.find(c => c._id === expandedCard)?.Ideal_duration} days
                </p>
                <p className="text-gray-700 text-lg leading-relaxed">
                  {cities.find(c => c._id === expandedCard)?.City_desc}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Cities