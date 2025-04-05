import React, { useState } from "react";
import NavigationBar from "@/components/NavigationBar";
import NetworkingBanner from "@/components/NetworkingBanner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Sparkles, Car, Fuel, BarChart, Tool } from "lucide-react";

const CarCheckup = () => {
  const [tab, setTab] = useState("vehicle");
  const [vehicleInfo, setVehicleInfo] = useState({
    make: "",
    model: "",
    year: "",
    mileage: "",
    licensePlate: "",
  });
  const [fuelEfficiency, setFuelEfficiency] = useState({
    currentReading: "",
    averageReading: "",
  });
  const [maintenanceChecklist, setMaintenanceChecklist] = useState({
    oilChange: false,
    tireRotation: false,
    brakeInspection: false,
    fluidLevels: false,
  });
  const [engineerNotes, setEngineerNotes] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (tab === "vehicle") {
      setVehicleInfo(prev => ({ ...prev, [name]: value }));
    } else if (tab === "fuel") {
      setFuelEfficiency(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setMaintenanceChecklist(prev => ({ ...prev, [name]: checked }));
  };

  return (
    <div className="min-h-screen bg-background">
      <NavigationBar />
      <NetworkingBanner
        title="Vehicle System Check"
        subtitle="Comprehensive diagnostic and maintenance tracking for field engineer vehicles"
      />
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-akhanya">Vehicle Checkup</CardTitle>
            <CardDescription>Record vehicle status and maintenance details</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="vehicle" className="space-y-4" onValueChange={setTab}>
              <TabsList>
                <TabsTrigger value="vehicle" className="text-akhanya">
                  <Car className="w-4 h-4 mr-2" /> Vehicle Info
                </TabsTrigger>
                <TabsTrigger value="fuel" className="text-akhanya">
                  <Fuel className="w-4 h-4 mr-2" /> Fuel Efficiency
                </TabsTrigger>
                <TabsTrigger value="maintenance" className="text-akhanya">
                  <Tool className="w-4 h-4 mr-2" /> Maintenance
                </TabsTrigger>
              </TabsList>
              <TabsContent value="vehicle" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="make">Make</Label>
                    <Input type="text" id="make" name="make" value={vehicleInfo.make} onChange={handleInputChange} />
                  </div>
                  <div>
                    <Label htmlFor="model">Model</Label>
                    <Input type="text" id="model" name="model" value={vehicleInfo.model} onChange={handleInputChange} />
                  </div>
                  <div>
                    <Label htmlFor="year">Year</Label>
                    <Input type="text" id="year" name="year" value={vehicleInfo.year} onChange={handleInputChange} />
                  </div>
                  <div>
                    <Label htmlFor="mileage">Mileage</Label>
                    <Input type="text" id="mileage" name="mileage" value={vehicleInfo.mileage} onChange={handleInputChange} />
                  </div>
                  <div>
                    <Label htmlFor="licensePlate">License Plate</Label>
                    <Input type="text" id="licensePlate" name="licensePlate" value={vehicleInfo.licensePlate} onChange={handleInputChange} />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="fuel" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="currentReading">Current Reading</Label>
                    <Input type="text" id="currentReading" name="currentReading" value={fuelEfficiency.currentReading} onChange={handleInputChange} />
                  </div>
                  <div>
                    <Label htmlFor="averageReading">Average Reading</Label>
                    <Input type="text" id="averageReading" name="averageReading" value={fuelEfficiency.averageReading} onChange={handleInputChange} />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="maintenance" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="oilChange">
                      <Checkbox
                        id="oilChange"
                        name="oilChange"
                        checked={maintenanceChecklist.oilChange}
                        onCheckedChange={(checked) => handleCheckboxChange({ target: { name: "oilChange", checked } } as any)}
                      />
                      <span className="ml-2">Oil Change</span>
                    </Label>
                  </div>
                  <div>
                    <Label htmlFor="tireRotation">
                      <Checkbox
                        id="tireRotation"
                        name="tireRotation"
                        checked={maintenanceChecklist.tireRotation}
                        onCheckedChange={(checked) => handleCheckboxChange({ target: { name: "tireRotation", checked } } as any)}
                      />
                      <span className="ml-2">Tire Rotation</span>
                    </Label>
                  </div>
                  <div>
                    <Label htmlFor="brakeInspection">
                      <Checkbox
                        id="brakeInspection"
                        name="brakeInspection"
                        checked={maintenanceChecklist.brakeInspection}
                        onCheckedChange={(checked) => handleCheckboxChange({ target: { name: "brakeInspection", checked } } as any)}
                      />
                      <span className="ml-2">Brake Inspection</span>
                    </Label>
                  </div>
                  <div>
                    <Label htmlFor="fluidLevels">
                      <Checkbox
                        id="fluidLevels"
                        name="fluidLevels"
                        checked={maintenanceChecklist.fluidLevels}
                        onCheckedChange={(checked) => handleCheckboxChange({ target: { name: "fluidLevels", checked } } as any)}
                      />
                      <span className="ml-2">Fluid Levels Check</span>
                    </Label>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            <div className="space-y-2 mt-4">
              <Label htmlFor="engineerNotes">Engineer Notes</Label>
              <Textarea
                id="engineerNotes"
                placeholder="Any additional notes about the vehicle"
                value={engineerNotes}
                onChange={(e) => setEngineerNotes(e.target.value)}
              />
            </div>
            <Button className="w-full mt-4 bg-akhanya hover:bg-akhanya-dark">
              Submit Vehicle Checkup
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CarCheckup;
