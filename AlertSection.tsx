import type React from "react"
import { Link } from "react-router-dom"

const AlertSection: React.FC = () => {
  return (
    <div className="bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            <span className="text-red-600">See</span> something?
            <span className="text-red-600"> Say </span> something! 🚨
          </h2>
          <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
            Report disasters, hazards, or emergencies now to help your community stay safe. <br />
            Click below to send an ALERT!
          </p>
          <Link to="/report" className="btn report inline-block">
            REPORT NOW
          </Link>
        </div>
      </div>
    </div>
  )
}

export default AlertSection

