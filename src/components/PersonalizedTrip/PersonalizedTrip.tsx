'use client'

import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CalendarIcon, Users, User, Users2, Home, IndianRupee, Plus, Minus } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface City {
  _id: string
  City: string
}

export default function PersonalizedTrip() {
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [tripType, setTripType] = useState("")
  const [members, setMembers] = useState(2)
  const [budget, setBudget] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const navigate = useNavigate()
  const location = useLocation()
  const city = location.state?.city as City | undefined

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!startDate || !endDate || !tripType || !budget) {
      setErrorMessage("Please fill in all the details before submitting.")
      setShowModal(true)
    } else if (!city) {
      setErrorMessage("No city selected. Please go back and choose a city.")
      setShowModal(true)
    } else {
      navigate("/itinerary", { state: { city, tripDetails: { startDate, endDate, tripType, members, budget } } })
    }
  }

  const incrementMembers = () => setMembers((prev) => prev + 1)
  const decrementMembers = () => setMembers((prev) => (prev > 2 ? prev - 1 : 2))

  const renderTripTypeButton = (value: string, Icon: any, label: string) => (
    <Button
      key={value}
      type="button"
      variant={tripType === value ? "default" : "outline"}
      className={`w-full justify-start py-6 text-lg ${
        tripType === value ? "bg-green-600 text-white" : "text-green-700 hover:bg-green-50 border-green-300"
      }`}
      onClick={() => setTripType(value)}
    >
      <Icon className="w-6 h-6 mr-3" />
      {label}
    </Button>
  )

  const renderBudgetButton = (value: string, label: string, icons: number) => (
    <Button
      key={value}
      type="button"
      variant={budget === value ? "default" : "outline"}
      className={`w-full justify-start py-6 text-lg ${
        budget === value ? "bg-green-600 text-white" : "text-green-700 hover:bg-green-50 border-green-300"
      }`}
      onClick={() => setBudget(value)}
    >
      {[...Array(icons)].map((_, i) => (
        <IndianRupee key={i} className="w-5 h-5 mr-1" />
      ))}
      {label}
    </Button>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl shadow-xl bg-white">
        <CardHeader className="bg-green-600 text-white rounded-t-lg">
          <CardTitle className="text-3xl font-bold text-center">Plan Your Dream Trip to {city?.City}</CardTitle>
          <CardDescription className="text-green-100 text-lg text-center">
            Fill in the details to start your adventure
          </CardDescription>
        </CardHeader>
        <CardContent className="mt-8 space-y-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label htmlFor="start-date" className="flex items-center space-x-2 text-base font-medium text-green-700">
                  <CalendarIcon className="w-5 h-5 text-green-600" />
                  <span>Start Date</span>
                </Label>
                <Input
                  id="start-date"
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full border-green-300 focus:border-blue-300 focus:ring-blue-300 text-lg"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="end-date" className="flex items-center space-x-2 text-base font-medium text-green-700">
                  <CalendarIcon className="w-5 h-5 text-green-600" />
                  <span>End Date</span>
                </Label>
                <Input
                  id="end-date"
                  type="date"
                  required
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full border-green-300 focus:border-blue-300 focus:ring-blue-300 text-lg"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-base font-medium text-green-700">Trip Type</Label>
              <div className="grid grid-cols-2 gap-6">
                {renderTripTypeButton("solo", User, "Solo")}
                {renderTripTypeButton("partner", Users, "Partner")}
                {renderTripTypeButton("friends", Users2, "Friends")}
                {renderTripTypeButton("family", Home, "Family")}
              </div>
            </div>

            {(tripType === "friends" || tripType === "family") && (
              <div className="space-y-3">
                <Label className="flex items-center space-x-2 text-base font-medium text-green-700">
                  <Users className="w-5 h-5 text-green-600" />
                  <span>Number of Members</span>
                </Label>
                <div className="flex items-center space-x-6">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={decrementMembers}
                    className="border-green-300 text-green-600 hover:bg-green-50 w-12 h-12"
                  >
                    <Minus className="w-6 h-6" />
                  </Button>
                  <span className="text-3xl font-bold text-green-700">{members}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={incrementMembers}
                    className="border-green-300 text-green-600 hover:bg-green-50 w-12 h-12"
                  >
                    <Plus className="w-6 h-6" />
                  </Button>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <Label className="text-base font-medium text-green-700">Budget</Label>
              <div className="grid grid-cols-3 gap-6">
                {renderBudgetButton("low", "Low", 1)}
                {renderBudgetButton("medium", "Medium", 2)}
                {renderBudgetButton("high", "High", 3)}
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="w-full bg-green-600 text-white hover:bg-green-700 transition-colors py-6 text-xl"
            onClick={handleSubmit}
          >
            Plan My Dream Trip
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Incomplete Details</DialogTitle>
            <DialogDescription>{errorMessage}</DialogDescription>
          </DialogHeader>
          <Button onClick={() => setShowModal(false)} className="bg-black text-white">
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}