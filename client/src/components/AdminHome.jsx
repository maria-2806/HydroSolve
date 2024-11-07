import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Droplet, Trash } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AdminHome() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [adminName, setAdminName] = useState('');
  const [selectedStatus, setSelectedStatus] = useState({});
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const fetchIssues = async () => {
    try {
      const response = await axios.get('http://localhost:5000/admin/issues');
      setIssues(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching issues:', err);
      setError('Failed to load issues. Please try again later.');
      setLoading(false);
    }
  };

  const fetchAdminName = () => {
    const name = localStorage.getItem('name');
    setAdminName(name || 'Admin');
  };

  const updateIssueStatus = async (issueId, status) => {
    try {
      setUpdatingStatus(true);
      await axios.patch(`http://localhost:5000/admin/issues/${issueId}/status`, { status });
      fetchIssues(); // Refresh the list after updating
      setUpdatingStatus(false);
    } catch (err) {
      console.error('Error updating issue status:', err);
      setError('Failed to update issue status. Please try again.');
      setUpdatingStatus(false);
    }
  };

  const deleteIssue = async (issueId) => {
    try {
      await axios.delete(`http://localhost:5000/admin/issues/${issueId}`);
      setIssues((prevIssues) => prevIssues.filter((issue) => issue._id !== issueId));
    } catch (err) {
      console.error('Error deleting issue:', err);
      setError('Failed to delete the issue. Please try again later.');
    }
  };

  useEffect(() => {
    fetchAdminName();
    fetchIssues();
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
    <div className="min-h-screen bg-gray-100 p-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-3xl font-bold flex items-center">
            <Droplet className="mr-2 h-8 w-8 text-blue-500" />
            Welcome, {adminName}!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <h2 className="text-xl font-semibold mb-4">Water Issue Reports Dashboard</h2>
          <div className="flex space-x-4">
            <Badge className="bg-green-500 text-white">
              Resolved: {issues.filter(issue => issue.status === 'resolved').length}
            </Badge>
            <Badge className="bg-yellow-500 text-white">
              In Progress: {issues.filter(issue => issue.status === 'in progress').length}
            </Badge>
            <Badge className="bg-red-500 text-white">
              Unresolved: {issues.filter(issue => issue.status === 'unresolved').length}
            </Badge>
          </div>
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
          {issues.length > 0 ? (
            issues.map((issue) => (
              <Card key={issue._id} className="mb-6">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2 w-full">
                      <h3 className="text-2xl font-bold">{issue.subject}</h3>
                      <Badge className={`${getSeverityColor(issue.severity)} text-white`}>
                        {getSeverityLabel(issue.severity)} ({issue.severity})
                      </Badge>
                      <p className="text-sm text-gray-500">Reported by: {issue.name}</p>
                      <p className="text-sm text-gray-500">Date: {new Date(issue.date).toLocaleString()}</p>
                      <p className="text-sm text-gray-500">Location: {issue.location}</p>
                      <p className="mt-4">{issue.description}</p>
                      <p className="text-sm text-gray-500">Contact: {issue.contact}</p>
                      <Badge className={`mt-4 ${
                        issue.status === 'resolved'
                          ? 'bg-green-500'
                          : issue.status === 'in progress'
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      } text-white`}>
                        {issue.status.toUpperCase()}
                      </Badge>
                    </div>
                    {issue.cloudinary_id && (
                      <img
                        src={issue.cloudinary_id}
                        alt="Issue"
                        className="w-40 h-40 object-cover rounded-lg shadow-md"
                      />
                    )}
                  </div>
                  <div className="mt-4 flex items-center space-x-4">
                    <Select
                      onValueChange={(value) => setSelectedStatus((prev) => ({ ...prev, [issue._id]: value }))}
                      value={selectedStatus[issue._id] || issue.status}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="in progress">In Progress</SelectItem>
                        <SelectItem value="unresolved">Unresolved</SelectItem>
                      </SelectContent>
                    </Select>
                    {selectedStatus[issue._id] && (
                      <button
                        onClick={() => updateIssueStatus(issue._id, selectedStatus[issue._id])}
                        className={`px-4 py-2 text-white rounded ${
                          updatingStatus ? 'bg-gray-400' : 'bg-blue-500'
                        }`}
                        disabled={updatingStatus}
                      >
                        {updatingStatus ? 'Updating...' : 'Submit'}
                      </button>
                    )}
                    {/* Delete Button */}
                    {issue.status === 'resolved' && (
                      <button
                        onClick={() => deleteIssue(issue._id)}
                        className="bg-red-500 text-white px-4 py-2 rounded shadow-md hover:bg-red-600 flex items-center"
                      >
                        <Trash className="mr-2 h-5 w-5" />
                        Delete
                      </button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-6 text-center text-gray-500">
                No issues reported yet.
              </CardContent>
            </Card>
          )}
        </ScrollArea>
      )}
    </div>
  );
}
