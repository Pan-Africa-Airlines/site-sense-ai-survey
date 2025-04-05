
import React, { useEffect, useState } from "react";
import AdminNavBar from "@/components/AdminNavBar";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Search, FileDown, Eye, CheckCircle, XCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock data for demonstration
const MOCK_ASSESSMENT_DATA = [
  { id: 1, siteName: "Eskom Substation A", region: "Gauteng", date: "2025-04-01", status: "completed", engineer: "John Smith" },
  { id: 2, siteName: "Power Station B", region: "Western Cape", date: "2025-04-02", status: "pending", engineer: "Sarah Johnson" },
  { id: 3, siteName: "Transmission Tower C", region: "KwaZulu-Natal", date: "2025-04-03", status: "completed", engineer: "David Williams" },
  { id: 4, siteName: "Distribution Center D", region: "Free State", date: "2025-03-28", status: "completed", engineer: "Emily Brown" },
  { id: 5, siteName: "Renewable Plant E", region: "Eastern Cape", date: "2025-03-25", status: "completed", engineer: "Michael Davis" },
  { id: 6, siteName: "Substation F", region: "Northern Cape", date: "2025-03-20", status: "pending", engineer: "Jessica Wilson" },
  { id: 7, siteName: "Solar Farm G", region: "Limpopo", date: "2025-03-18", status: "completed", engineer: "Robert Taylor" },
  { id: 8, siteName: "Wind Farm H", region: "Mpumalanga", date: "2025-03-15", status: "pending", engineer: "Jennifer Miller" },
  { id: 9, siteName: "Hydroelectric Dam I", region: "North West", date: "2025-03-10", status: "completed", engineer: "Thomas Anderson" },
  { id: 10, siteName: "Coal Plant J", region: "Gauteng", date: "2025-03-05", status: "completed", engineer: "Lisa Garcia" },
];

const AdminAssessments = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean | null>(null);
  const [assessments, setAssessments] = useState(MOCK_ASSESSMENT_DATA);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const adminLoggedIn = localStorage.getItem("adminLoggedIn") === "true";
    setIsAdminAuthenticated(adminLoggedIn);
    
    if (!adminLoggedIn) {
      navigate("/admin/login");
    }
  }, [navigate]);

  if (isAdminAuthenticated === null) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAdminAuthenticated) {
    return null;
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredAssessments = assessments.filter(
    assessment => 
      assessment.siteName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assessment.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assessment.engineer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Exporting assessment data to CSV..."
    });
    // In a real app, this would trigger a CSV download
  };

  const handleApprove = (id: number) => {
    setAssessments(
      assessments.map(assessment =>
        assessment.id === id ? { ...assessment, status: "completed" } : assessment
      )
    );
    toast({
      title: "Assessment Approved",
      description: `Assessment #${id} has been approved.`
    });
  };

  const handleReject = (id: number) => {
    setAssessments(
      assessments.map(assessment =>
        assessment.id === id ? { ...assessment, status: "rejected" } : assessment
      )
    );
    toast({
      title: "Assessment Rejected",
      description: `Assessment #${id} has been rejected.`
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavBar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Site Assessments</h1>
          <Button onClick={handleExport} variant="outline" className="flex items-center gap-2">
            <FileDown size={16} />
            Export Data
          </Button>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="flex items-center mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <Input
                placeholder="Search by site name, region, or engineer..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Site Name</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Engineer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssessments.map((assessment) => (
                  <TableRow key={assessment.id}>
                    <TableCell>{assessment.id}</TableCell>
                    <TableCell className="font-medium">{assessment.siteName}</TableCell>
                    <TableCell>{assessment.region}</TableCell>
                    <TableCell>{assessment.date}</TableCell>
                    <TableCell>{assessment.engineer}</TableCell>
                    <TableCell>
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                        assessment.status === 'completed' ? 'bg-green-100 text-green-800' : 
                        assessment.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {assessment.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-8 w-8 p-0"
                          onClick={() => {
                            toast({
                              title: "View Assessment",
                              description: `Viewing details for ${assessment.siteName}`
                            });
                            // In a real app, this would navigate to a detail view
                          }}
                        >
                          <Eye size={16} />
                        </Button>
                        
                        {assessment.status === 'pending' && (
                          <>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                              onClick={() => handleApprove(assessment.id)}
                            >
                              <CheckCircle size={16} />
                            </Button>
                            
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleReject(assessment.id)}
                            >
                              <XCircle size={16} />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAssessments;
