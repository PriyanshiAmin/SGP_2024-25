"use client"

import React, { useState } from "react"
import axios from "axios"
import { useGoogleReCaptcha } from "react-google-recaptcha-v3"

const Report: React.FC = () => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [emergencyType, setEmergencyType] = useState("")
  const [customEmergencyType, setCustomEmergencyType] = useState("")
  const [severity, setSeverity] = useState("")
  const [description, setDescription] = useState("")
  const [contact, setContact] = useState("")
  const [photos, setPhotos] = useState<File[]>([])
  const [loading, setLoading] = useState(false)

  const { executeRecaptcha } = useGoogleReCaptcha()

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => {
          console.error("Error getting location:", error)
          alert("Unable to get your location. Please enter it manually.")
        }
      )
    } else {
      alert("Geolocation is not supported by your browser.")
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhotos(Array.from(e.target.files))
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const finalEmergencyType = emergencyType === "other" ? customEmergencyType : emergencyType

    if (!finalEmergencyType || !severity || !location) {
      alert("Please fill all required fields.")
      return
    }

    setLoading(true)

    try {
      if (!executeRecaptcha) {
        alert("Recaptcha not yet ready")
        setLoading(false)
        return
      }

      const recaptchaToken = await executeRecaptcha("submit")

      const formData = new FormData()
      formData.append("disasterName", finalEmergencyType)
      formData.append("location", JSON.stringify(location))
      formData.append("severity", severity)
      formData.append("description", description)
      formData.append("contact", contact)
      formData.append("recaptchaToken", recaptchaToken)
      photos.forEach((file) => formData.append("media", file))

      await axios.post("http://localhost:5000/api/disaster/report", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      alert("Emergency reported successfully!")
      setEmergencyType("")
      setCustomEmergencyType("")
      setSeverity("")
      setDescription("")
      setContact("")
      setPhotos([])
      setLocation(null)
    } catch (err) {
      console.error("Submission failed:", err)
      alert("There was an error submitting your report.")
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-8 md:mb-0">
          <img src="/src/images/report.png" alt="Sign in illustration" />
        </div>

        <div className="flex-1 p-10 max-w order-2">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Report an Emergency</h1>
          </div>
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="emergencyType" className="block text-gray-700 font-medium mb-2">
              Emergency Type
            </label>
            <select
              id="emergencyType"
              required
              value={emergencyType}
              onChange={(e) => setEmergencyType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">Select emergency type</option>
              <option value="flood">Flood</option>
              <option value="fire">Fire</option>
              <option value="earthquake">Earthquake</option>
              <option value="hurricane">Hurricane</option>
              <option value="other">Other</option>
            </select>
          </div>

          {emergencyType === "other" && (
            <div>
              <label htmlFor="customEmergencyType" className="block text-gray-700 font-medium mb-2">
                Specify Emergency Type
              </label>
              <input
                id="customEmergencyType"
                type="text"
                value={customEmergencyType}
                onChange={(e) => setCustomEmergencyType(e.target.value)}
                placeholder="Enter emergency type"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          )}

          <div>
            <label htmlFor="location" className="block text-gray-700 font-medium mb-2">
              Location
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                id="location"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Enter location or use current location"
                value={
                  location
                    ? `Lat: ${location.lat.toFixed(6)}, Lng: ${location.lng.toFixed(6)}`
                    : ""
                }
                readOnly
              />
              <button
                type="button"
                onClick={getCurrentLocation}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-map-pin"
                >
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
              Description
            </label>
            <textarea
              id="description"
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Describe the emergency situation"
            ></textarea>
          </div>

          <div>
            <label htmlFor="severity" className="block text-gray-700 font-medium mb-2">
              Severity Level
            </label>
            <select
              id="severity"
              required
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">Select severity level</option>
              <option value="low">Low - No immediate danger</option>
              <option value="medium">Medium - Potential danger</option>
              <option value="high">High - Immediate danger</option>
              <option value="critical">Critical - Life-threatening</option>
            </select>
          </div>

          <div>
            <label htmlFor="photos" className="block text-gray-700 font-medium mb-2">
              Upload Photos (optional)
            </label>
            <input
              type="file"
              id="photos"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label htmlFor="contact" className="block text-gray-700 font-medium mb-2">
              Your Contact Information
            </label>
            <input
              type="text"
              id="contact"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Phone number or email"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white py-3 px-4 rounded-md hover:bg-red-700 transition-colors duration-300 font-bold text-lg"
          >
            {loading ? "Submitting..." : "REPORT EMERGENCY"}
          </button>
        </form>
        </div>
      </div>
    </div>
    </div>

  )
}

export default Report