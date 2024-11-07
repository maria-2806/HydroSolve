import { useEffect, useState } from 'react'
import axios from 'axios'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, Droplet } from 'lucide-react'

export default function AdminHome() {
  const [issues, setIssues] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [adminName, setAdminName] = useState('')

  const fetchIssues = async () => {
    try {
      const response = await axios.get('http://localhost:5000/admin/issues')
      const updatedIssues = response.data.map(issue => ({
        ...issue,
        resolved: false
      }))
      setIssues(updatedIssues)
      setLoading(false)
    } catch (err) {
      console.error('Error fetching issues:', err)
      setError('Failed to load issues. Please try again later.')
      setLoading(false)
    }
  }

  const fetchAdminName = () => {
    const name = localStorage.getItem('name')
    setAdminName(name || 'Admin')
  }

  useEffect(() => {
    fetchAdminName()
    fetchIssues()
  }, [])

  const toggleResolved = (issueId) => {
    setIssues(prevIssues =>
      prevIssues.map(issue =>
        issue._id === issueId ? { ...issue, resolved: !issue.resolved } : issue
      )
    )
  }

  const getSeverityColor = (severity) => {
    if (typeof severity !== 'number' || severity < 1 || severity > 10) {
      return 'bg-gray-500'
    }
    if (severity <= 3) return 'bg-green-500'
    if (severity <= 6) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getSeverityLabel = (severity) => {
    if (typeof severity !== 'number' || severity < 1 || severity > 10) {
      return 'Unknown'
    }
    if (severity <= 3) return 'Low'
    if (severity <= 6) return 'Medium'
    return 'High'
  }

  const resolvedCount = issues.filter(issue => issue.resolved).length
  const unresolvedCount = issues.length - resolvedCount

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
            <Badge className="bg-green-500 text-white">Resolved: {resolvedCount}</Badge>
            <Badge className="bg-red-500 text-white">Unresolved: {unresolvedCount}</Badge>
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
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={issue.resolved}
                          onChange={() => toggleResolved(issue._id)}
                          className="mr-2"
                        />
                        <h3 className={`text-2xl font-bold ${issue.resolved ? 'line-through text-gray-400' : ''}`}>
                          {issue.subject}
                        </h3>
                      </div>
                      <Badge className={`${getSeverityColor(issue.severity)} text-white`}>
                        {getSeverityLabel(issue.severity)} ({issue.severity})
                      </Badge>
                      <p className="text-sm text-gray-500">Reported by: {issue.name}</p>
                      <p className="text-sm text-gray-500">Date: {new Date(issue.date).toLocaleString()}</p>
                      <p className="text-sm text-gray-500">Location: {issue.location}</p>
                      <p className={`mt-4 ${issue.resolved ? 'line-through text-gray-400' : ''}`}>{issue.description}</p>
                      <p className="text-sm text-gray-500">Contact: {issue.contact}</p>
                    </div>
                    {issue.cloudinary_id && (
                      <img 
                        src={issue.cloudinary_id} 
                        alt="Issue" 
                        className={`w-40 h-40 object-cover rounded-lg shadow-md ${issue.resolved ? 'opacity-50' : ''}`} 
                      />
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
  )
}
