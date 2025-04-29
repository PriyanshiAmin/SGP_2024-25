import type React from "react"

interface Disaster {
  id: string
  type: string
  location: string
  severity: "low" | "medium" | "high" | "critical"
  date: string
  status: "active" | "contained" | "resolved"
}

// Mock data for ongoing disasters
const mockDisasters: Disaster[] = [
  {
    id: "1",
    type: "Flood",
    location: "Riverside County, CA",
    severity: "high",
    date: "2025-03-28",
    status: "active",
  },
  {
    id: "2",
    type: "Forest Fire",
    location: "Sierra Mountains, NV",
    severity: "critical",
    date: "2025-04-01",
    status: "active",
  },
  {
    id: "3",
    type: "Hurricane",
    location: "Gulf Coast, FL",
    severity: "high",
    date: "2025-03-25",
    status: "contained",
  },
  {
    id: "4",
    type: "Earthquake",
    location: "San Francisco, CA",
    severity: "medium",
    date: "2025-04-03",
    status: "active",
  },
]

const getSeverityColor = (severity: Disaster["severity"]) => {
  switch (severity) {
    case "low":
      return "bg-yellow-100 text-yellow-800"
    case "medium":
      return "bg-orange-100 text-orange-800"
    case "high":
      return "bg-red-100 text-red-800"
    case "critical":
      return "bg-red-600 text-white"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getStatusColor = (status: Disaster["status"]) => {
  switch (status) {
    case "active":
      return "bg-red-100 text-red-800"
    case "contained":
      return "bg-yellow-100 text-yellow-800"
    case "resolved":
      return "bg-green-100 text-green-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const OngoingDisasters: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold mb-4">Ongoing Disasters</h3>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Type
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Location
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Severity
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Date
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mockDisasters.map((disaster) => (
              <tr key={disaster.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{disaster.type}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{disaster.location}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getSeverityColor(disaster.severity)}`}
                  >
                    {disaster.severity.charAt(0).toUpperCase() + disaster.severity.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(disaster.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(disaster.status)}`}
                  >
                    {disaster.status.charAt(0).toUpperCase() + disaster.status.slice(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-center">
        <button className="text-red-600 hover:text-red-800 font-medium">View All Disasters</button>
      </div>
    </div>
  )
}

export default OngoingDisasters
