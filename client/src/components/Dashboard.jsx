import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Droplet } from 'lucide-react';
import UserNavbar from "./UserNavbar"; // Import the UserNavbar for consistent navigation

export default function Dashboard() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userName, setUserName] = useState('');

  const fetchReports = async () => {
    try {
      const userName = localStorage.getItem('name'); // Retrieve the user's name from localStorage
      const response = await axios.get('http://localhost:5000/user/reports', {
        params: { name: userName }, // Pass the user's name as a query parameter
      });
  
      if (response.status === 200) {
        setReports(response.data); // Set reports (even if empty)
      } else {
        setReports([]); // Fallback to empty array if something goes wrong
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching user reports:', err);
      setError('Failed to load reports. Please try again later.');
      setLoading(false);
    }
  };
  
  
  

  const fetchUserName = () => {
    const name = localStorage.getItem('name');
    setUserName(name || 'User');
  };

  useEffect(() => {
    fetchUserName();
    fetchReports();
  }, []);

  const getSeverityColor = (severity) => {
    if (typeof severity !== 'number' || severity < 1 || severity > 10) {
      return 'bg-gray-500';
    }
    if (severity <= 3) return 'bg-green-500';
    if (severity <= 6) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getSeverityLabel = (severity) => {
    if (typeof severity !== 'number' || severity < 1 || severity > 10) {
      return 'Unknown';
    }
    if (severity <= 3) return 'Low';
    if (severity <= 6) return 'Medium';
    return 'High';
  };

  return (
    <>

    <UserNavbar />
    <div className="min-h-screen bg-gray-100 p-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-3xl font-bold flex items-center">
            <Droplet className="mr-2 h-8 w-8 text-blue-500" />
            Welcome, {userName}!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <h2 className="text-xl font-semibold mb-4">Your Reported Issues</h2>
        </CardContent>
      </Card>

      {loading && (
        <Card>
          <CardContent className="p-6">
            <Skeleton className="w-full h-12 mb-4" />
            <Skeleton className="w-full h-32 mb-4" />
            <Skeleton className="w-full h-32" />
          </CardContent>
        </Card>
      )}

      {error && (
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-6 flex items-center text-red-700">
            <AlertCircle className="mr-2 h-5 w-5" />
            {error}
          </CardContent>
        </Card>
      )}

      {!loading && !error && (
        <ScrollArea className="h-[calc(100vh-250px)]">
          {reports.length > 0 ? (
            reports.map((report) => (
              <Card key={report._id} className="mb-6">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2 w-full">
                      <h3 className="text-2xl font-bold">{report.subject}</h3>
                      <Badge className={`${getSeverityColor(report.severity)} text-white`}>
                        {getSeverityLabel(report.severity)} ({report.severity})
                      </Badge>
                      <p className="text-sm text-gray-500">Date: {new Date(report.date).toLocaleString()}</p>
                      <p className="text-sm text-gray-500">Location: {report.location}</p>
                      <p className="mt-4">{report.description}</p>
                      <p className="text-sm text-gray-500">Contact: {report.contact}</p>
                      <Badge className={`mt-4 ${
                        report.status === 'resolved'
                          ? 'bg-green-500'
                          : report.status === 'in progress'
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      } text-white`}>
                        {report.status.toUpperCase()}
                      </Badge>
                    </div>
                    {report.cloudinary_id && (
                      <img
                        src={report.cloudinary_id}
                        alt="Issue"
                        className="w-40 h-40 object-cover rounded-lg shadow-md"
                      />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-6 text-center text-gray-500">
                No reports found.
              </CardContent>
            </Card>
          )}
        </ScrollArea>
      )}
    </div>
    </>
  );
}
