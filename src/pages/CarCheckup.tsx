
import React from "react";
import NavigationBar from "@/components/navigation/NavigationBar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, CheckCircle } from "lucide-react";

const CarCheckup = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavigationBar />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-akhanya">Vehicle Safety Check</h2>
        </div>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Car className="mr-2 h-5 w-5" />
              Vehicle Safety Inspection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Complete a safety check for your assigned vehicle before heading to a site.</p>
            <Button className="bg-akhanya hover:bg-akhanya-dark">
              <CheckCircle className="mr-2 h-4 w-4" />
              Start Vehicle Check
            </Button>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Checks</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">No recent vehicle checks found.</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Vehicle Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Please select a vehicle to view its information.</p>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CarCheckup;
