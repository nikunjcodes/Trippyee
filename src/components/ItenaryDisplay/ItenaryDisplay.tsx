'use client'

import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import axios from "axios"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Download, Star, ArrowLeft, Users, DollarSign, Hotel } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { color } from "framer-motion"

interface Activity {
  name: string
  description: string
  rating: number
  distance: string
}

interface ItineraryDay {
  day: number
  activities: Activity[]
}

interface City {
  _id: string
  City: string
  Low_Budget_Per_Day: number
  Medium_Budget_Per_Day: number
  High_Budget_Per_Day: number
}

interface TripDetails {
  startDate: string
  endDate: string
  tripType: string
  members: number
  budget: 'low' | 'medium' | 'high'
}

interface HotelData {
  name: string
  type: string
  thumbnail_url: string
  link: string
}

export default function ItineraryDisplay() {
  const [itinerary, setItinerary] = useState<ItineraryDay[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const location = useLocation()
  const navigate = useNavigate()
  const city = location.state?.city as City | undefined
  const tripDetails = location.state?.tripDetails as TripDetails | undefined

  const [totalBudget, setTotalBudget] = useState(0)

  const [hotels, setHotels] = useState<HotelData[]>([])
  const [hotelLoading, setHotelLoading] = useState(false)
  const [hotelError, setHotelError] = useState<string | null>(null)

  useEffect(() => {
    const fetchItinerary = async () => {
      if (!city || !tripDetails) {
        setError("No city or trip details found. Please go back and fill in all the information.")
        setLoading(false)
        return
      }

      try {
        const response = await axios.post<ItineraryDay[]>('http://localhost:5000/api/itinerary', {
          cityName: city.City,
          tripDetails
        })
        setItinerary(response.data)

        const budgetPerDay = 
          tripDetails.budget === 'low' ? city.Low_Budget_Per_Day :
          tripDetails.budget === 'medium' ? city.Medium_Budget_Per_Day :
          city.High_Budget_Per_Day

        const tripDuration = Math.ceil((new Date(tripDetails.endDate).getTime() - new Date(tripDetails.startDate).getTime()) / (1000 * 3600 * 24))
        const calculatedTotalBudget = budgetPerDay * tripDetails.members * tripDuration

        setTotalBudget(calculatedTotalBudget)
        setLoading(false)
      } catch (err) {
        setError("Failed to generate itinerary. Please try again.")
        setLoading(false)
      }
    }

    fetchItinerary()
  }, [city, tripDetails])

  const downloadItinerary = () => {
    const itineraryText = generateItineraryText()
    const blob = new Blob([itineraryText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${city?.City}_Itinerary.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const generateItineraryText = () => {
    let text = `Itinerary for ${city?.City}\n`
    text += `Trip Dates: ${new Date(tripDetails?.startDate || '').toLocaleDateString()} - ${new Date(tripDetails?.endDate || '').toLocaleDateString()}\n`
    text += `Number of Members: ${tripDetails?.members}\n`
    text += `Budget Level: ${tripDetails?.budget}\n`
    text += `Estimated Total Budget: ₹${totalBudget.toFixed(2)}\n\n`

    itinerary.forEach((day) => {
      text += `Day ${day.day}:\n`
      day.activities.forEach((activity) => {
        text += `- ${activity.name}\n`
        text += `  Description: ${activity.description}\n`
        text += `  Rating: ${activity.rating !== undefined ? activity.rating.toFixed(1) : 'N/A'} stars\n`
        text += `  Distance: ${activity.distance}\n`
        text += `\n`
      })
      text += '\n'
    })

    return text
  }

  const searchHotels = async () => {
    if (!city) return

    setHotelLoading(true)
    setHotelError(null)

    try {
      const options = {
        method: 'GET',
        url: `https://tripadvisor-scraper.p.rapidapi.com/hotels/search`,
        params: { query: city.City },
        headers: {
          'x-rapidapi-key': '10a86fb255msh9bb3fc843ce0a1ep1b889fjsn0b3c40a85deb', // Replace with your actual API key
          'x-rapidapi-host': 'tripadvisor-scraper.p.rapidapi.com'
        }
      }

      const response = await axios.request(options)
      setHotels(response.data)
    } catch (err) {
      console.error('Error fetching hotels:', err)
      setHotelError('Failed to fetch hotel data')
    }

    setHotelLoading(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 p-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-green-800">Generating Your Itinerary...</CardTitle>
          </CardHeader>
          <CardContent>
            {[...Array(3)].map((_, index) => (
              <div key={index} className="mb-4">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">{error}</p>
            <Button onClick={() => navigate(-1)} className="w-full">Go Back</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 p-8">
      <Card className="max-w-4xl mx-auto shadow-lg">
        <CardHeader className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <CardTitle className="text-3xl font-bold">Your Trip to {city?.City}</CardTitle>
              <CardDescription className="text-green-100 mt-2">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  <span>{new Date(tripDetails?.startDate || '').toLocaleDateString()} - {new Date(tripDetails?.endDate || '').toLocaleDateString()}</span>
                </div>
                <div className="flex items-center mt-1">
                  <Users className="w-5 h-5 mr-2" />
                  <span>{tripDetails?.members} {tripDetails?.members === 1 ? 'Person' : 'People'}</span>
                </div>
              </CardDescription>
            </div>
            <div className="text-right mt-4 md:mt-0">
              <span className="text-xl font-semibold">Total Budget</span>
              <div className="text-4xl font-bold text-yellow-300">₹{totalBudget.toFixed(2)}</div>
              <Badge variant="secondary" className="mt-1">
                {tripDetails?.budget.charAt(0).toUpperCase() + tripDetails?.budget.slice(1)} Budget <br></br>(excluding travel)
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <Button onClick={downloadItinerary} className="mb-6 w-full sm:w-auto" variant="outline">
            <Download className="mr-2" />
            Download Itinerary
          </Button>
          <Tabs defaultValue="itinerary">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
              <TabsTrigger value="hotels">Hotels</TabsTrigger>
            </TabsList>
            <TabsContent value="itinerary">
              <Accordion type="single" collapsible className="w-full space-y-4">
                {itinerary.map((day) => (
                  <AccordionItem key={day.day} value={`day-${day.day}`} className="border rounded-lg overflow-hidden">
                    <AccordionTrigger className="text-xl font-semibold text-green-800 p-4 hover:bg-green-50">
                      Day {day.day}
                    </AccordionTrigger>
                    <AccordionContent className="p-4 bg-white">
                      <ul className="space-y-4">
                        {day.activities.map((activity, index) => (
                          <li key={index} className="border-b pb-4 last:border-b-0 last:pb-0">
                            <h3 className="font-bold text-lg text-green-700">{activity.name}</h3>
                            <p className="text-gray-600 mt-1">{activity.description}</p>
                            <div className="flex items-center mt-2 text-sm text-gray-500">
                              <Star className="w-4 h-4 text-yellow-400 mr-1" />
                              <span>{activity.rating ? activity.rating.toFixed(1) : '4.0'} stars</span>
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
                  <CardTitle >Hotels in {city?.City}</CardTitle>
                  <CardDescription>Find the perfect place for your stay</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={searchHotels} disabled={hotelLoading} className="mb-4" style={{color: "black"}}>
                    <Hotel className="w-4 h-4 mr-2" />
                    {hotelLoading ? 'Searching...' : 'Search Hotels'}
                  </Button>
                  {hotelError && <p className="text-red-500 mb-4">{hotelError}</p>}
                  {hotelLoading && <Skeleton className="h-40 w-full" />}
                  {hotels.length > 0 && (
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {hotels.map((hotel) => (
                        <li key={hotel.link} className="border rounded-lg overflow-hidden">
                          <img src={hotel.thumbnail_url} alt={hotel.name} className="w-full h-40 object-cover" />
                          <div className="p-4">
                            <h3 className="font-bold text-lg">{hotel.name}</h3>
                            <p className="text-gray-600">{hotel.type}</p>
                            <a href={hotel.link} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block">
                              <Button variant="outline">View Details</Button>
                            </a>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                  {hotels.length === 0 && !hotelLoading && (
                    <p className="text-center text-gray-500">No hotels found. Try searching to see available options.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={() => navigate(-1)} variant="outline">
            <ArrowLeft className="mr-2" />
            Go Back
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}