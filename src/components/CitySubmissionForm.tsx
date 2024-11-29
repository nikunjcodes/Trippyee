'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";

const CitySubmissionForm: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    City: '',
    City_desc: '',
    Min_no_of_days: '',
    Max_no_of_days: '',
    Low_Budget_Per_Day: '',
    Medium_Budget_Per_Day: '',
    High_Budget_Per_Day: '',
    Ideal_duration: '',
    Best_time_to_visit: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post('http://localhost:5000/api/submit-city', formData);
      toast({
        title: "City Submitted",
        description: "Your submission has been recorded successfully.",
      });
      setLoading(false);
      setFormData({
        City: '',
        City_desc: '',
        Min_no_of_days: '',
        Max_no_of_days: '',
        Low_Budget_Per_Day: '',
        Medium_Budget_Per_Day: '',
        High_Budget_Per_Day: '',
        Ideal_duration: '',
        Best_time_to_visit: '',
      });
      navigate('/'); // Redirect to the home page or another route after submission
    } catch (error) {
      console.error("Error submitting city:", error);
      toast({
        title: "Submission Failed",
        description: "There was an error while submitting the city. Please try again later.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-200 flex items-center justify-center">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader>
          <CardTitle>Submit a City</CardTitle>
          <CardDescription>Provide city details for review and consideration.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="City">City Name</Label>
                <Input
                  id="City"
                  name="City"
                  value={formData.City}
                  onChange={handleChange}
                  placeholder="Enter city name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="City_desc">City Description</Label>
                <Textarea
                  id="City_desc"
                  name="City_desc"
                  value={formData.City_desc}
                  onChange={handleChange}
                  placeholder="Enter city description"
                  required
                />
              </div>
              <div>
                <Label htmlFor="Min_no_of_days">Minimum Days Required</Label>
                <Input
                  id="Min_no_of_days"
                  name="Min_no_of_days"
                  value={formData.Min_no_of_days}
                  onChange={handleChange}
                  type="number"
                  placeholder="e.g., 2"
                />
              </div>
              <div>
                <Label htmlFor="Max_no_of_days">Maximum Days Recommended</Label>
                <Input
                  id="Max_no_of_days"
                  name="Max_no_of_days"
                  value={formData.Max_no_of_days}
                  onChange={handleChange}
                  type="number"
                  placeholder="e.g., 5"
                />
              </div>
              <div>
                <Label htmlFor="Best_time_to_visit">Best Time to Visit</Label>
                <Input
                  id="Best_time_to_visit"
                  name="Best_time_to_visit"
                  value={formData.Best_time_to_visit}
                  onChange={handleChange}
                  placeholder="e.g., March to June"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div>
                  <Label htmlFor="Low_Budget_Per_Day">Low Budget Per Day</Label>
                  <Input
                    id="Low_Budget_Per_Day"
                    name="Low_Budget_Per_Day"
                    value={formData.Low_Budget_Per_Day}
                    onChange={handleChange}
                    type="number"
                    placeholder="e.g., 500"
                  />
                </div>
                <div>
                  <Label htmlFor="Medium_Budget_Per_Day">Medium Budget Per Day</Label>
                  <Input
                    id="Medium_Budget_Per_Day"
                    name="Medium_Budget_Per_Day"
                    value={formData.Medium_Budget_Per_Day}
                    onChange={handleChange}
                    type="number"
                    placeholder="e.g., 1500"
                  />
                </div>
                <div>
                  <Label htmlFor="High_Budget_Per_Day">High Budget Per Day</Label>
                  <Input
                    id="High_Budget_Per_Day"
                    name="High_Budget_Per_Day"
                    value={formData.High_Budget_Per_Day}
                    onChange={handleChange}
                    type="number"
                    placeholder="e.g., 3000"
                  />
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <Button type="submit" disabled={loading}>
                {loading ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CitySubmissionForm;
