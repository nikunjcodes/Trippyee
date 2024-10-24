"use client"

import { useState } from "react"
import { Button } from "../src/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../src/components/ui/card"
import { Input } from "../src/components/ui/input"
import { Label } from "../src/components/ui/label"
import { CalendarIcon, Users, User, Users2, Home, IndianRupee, Plus, Minus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../src/components/ui/dialog"

export default function App1() {
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [tripType, setTripType] = useState("")
  const [members, setMembers] = useState(2)
  const [budget, setBudget] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!startDate || !endDate || !tripType || !budget) {
      setErrorMessage("Please fill in all the details before submitting.")
      setShowModal(true)
    } else {
      console.log({ startDate, endDate, tripType, members, budget })
      alert("Trip plan submitted!")
    }
  }

  const incrementMembers = () => setMembers((prev) => prev + 1)
  const decrementMembers = () => setMembers((prev) => (prev > 2 ? prev - 1 : 2))

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl shadow-xl bg-white">
        <CardHeader className="bg-green-600 text-white rounded-t-lg">
          <CardTitle className="text-3xl font-bold">Plan Your Dream Trip</CardTitle>
          <CardDescription className="text-green-100 text-lg">
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
                {[
                  { value: "solo", icon: User, label: "Solo" },
                  { value: "partner", icon: Users, label: "Partner" },
                  { value: "friends", icon: Users2, label: "Friends" },
                  { value: "family", icon: Home, label: "Family" },
                ].map(({ value, icon: Icon, label }) => (
                  <Button
                    key={value}
                    type="button"
                    variant={tripType === value ? "default" : "outline"}
                    className={`w-full justify-start py-6 text-lg ${
                      tripType === value
                        ? "bg-green-600 text-white"
                        : "text-green-700 hover:bg-green-50 border-green-300"
                    }`}
                    onClick={() => setTripType(value)}
                  >
                    <Icon className="w-6 h-6 mr-3" />
                    {label}
                  </Button>
                ))}
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
                {[
                  { value: "low", label: "Low", icons: 1 },
                  { value: "medium", label: "Medium", icons: 2 },
                  { value: "high", label: "High", icons: 3 },
                ].map(({ value, label, icons }) => (
                  <Button
                    key={value}
                    type="button"
                    variant={budget === value ? "default" : "outline"}
                    className={`w-full justify-start py-6 text-lg ${
                      budget === value
                        ? "bg-green-600 text-white"
                        : "text-green-700 hover:bg-green-50 border-green-300"
                    }`}
                    onClick={() => setBudget(value)}
                  >
                    {[...Array(icons)].map((_, i) => (
                      <IndianRupee key={i} className="w-5 h-5 mr-1" />
                    ))}
                    {label}
                  </Button>
                ))}
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
          <Button onClick={() => setShowModal(false)} style={{backgroundColor: "black"}}>Close</Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}