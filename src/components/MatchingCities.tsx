import React, { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import axios from "axios"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

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
    Best_time_to_visit: string
  }
  const cleanDescription = (description: string) => {
    return description.replace(/[\[\]\"\'']/g, '');
  }
const MatchingCities: React.FC = () => {
  const [cities, setCities] = useState<City[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const location = useLocation()
  const navigate = useNavigate()
  const { tripDuration, budget } = location.state as { tripDuration: number; budget: string }

  useEffect(() => {
    const fetchMatchingCities = async () => {
      try {
        const response = await axios.post<City[]>("http://localhost:5000/api/match-cities", {
          tripDuration,
          budget
        })
        setCities(response.data)
        setLoading(false)
      } catch (err) {
        setError("Failed to fetch matching cities. Please try again.")
        setLoading(false)
      }
    }

    fetchMatchingCities()
  }, [tripDuration, budget])

  const handleCitySelect = (city: City) => {
    navigate("/itinerary", { state: { city, tripDetails: location.state } })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{error}</p>
            <Button onClick={() => navigate(-1)} className="mt-4 w-full">Go Back</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-green-800 mb-8">Matching Cities</h1>
        {cities.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-xl text-gray-700">No matching cities found. Please try different criteria.</p>
              <Button onClick={() => navigate(-1)} className="mt-4">Go Back</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cities.map((city) => (
              <Card key={city._id} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-green-700">{city.City}</CardTitle>
                  <CardDescription>Rating: {city.Ratings.toFixed(1)}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-2">Best time to visit: {city.Best_time_to_visit}</p>
                  <p className="text-gray-600 mb-4">Ideal duration: {city.Min_no_of_days} - {city.Max_no_of_days}</p>
                  <p className="text-gray-700 mb-4 line-clamp-3">{cleanDescription(city.City_desc)}</p>
                  <Button onClick={() => handleCitySelect(city)} className="w-full bg-green-600 hover:bg-green-700 text-white">
                    Select This City
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MatchingCities