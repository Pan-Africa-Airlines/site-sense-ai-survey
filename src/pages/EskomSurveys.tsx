
import React from "react";
import { useNavigate } from "react-router-dom";
import NavigationBar from "@/components/navigation/NavigationBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, FileText } from "lucide-react";
import Footer from "@/components/Footer";

const EskomSurveys = () => {
  const navigate = useNavigate();
  
  // Placeholder data for surveys
  const surveys = [
    { id: "1", site_name: "Medupi Power Station", date: "2023-04-10", status: "completed" },
    { id: "2", site_name: "Kusile Power Station", date: "2023-04-15", status: "draft" },
    { id: "3", site_name: "Koeberg Nuclear", date: "2023-04-18", status: "submitted" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavigationBar />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-akhanya">Eskom Site Surveys</h2>
          <Button 
            onClick={() => navigate("/eskom-survey/new")} 
            className="bg-akhanya hover:bg-akhanya-dark flex items-center gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            New Survey
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {surveys.map((survey) => (
            <Card key={survey.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{survey.site_name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600 mb-2">
                  Date: {survey.date}
                </div>
                <div className="flex justify-between items-center">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    survey.status === 'completed' ? 'bg-green-100 text-green-800' :
                    survey.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {survey.status.charAt(0).toUpperCase() + survey.status.slice(1)}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex items-center gap-1"
                    onClick={() => navigate(`/eskom-survey/${survey.id}`)}
                  >
                    <FileText className="h-4 w-4" />
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EskomSurveys;
