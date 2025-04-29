"use client"

import React, { useState, useEffect } from "react"
import ProfilePicture from "../components/ProfilePicture"
import ChangePassword from "../components/ChangePassword"
import { useAuth } from "../contex/useAuth"
import axios from "axios"

const UserProfile: React.FC = () => {
  const [activeTab, setActiveTab] = useState("profile")
  const { user, updateUser } = useAuth()
  const [formData, setFormData] = useState({
    firstName: user?.name?.split(" ")[0] || "",
    lastName: user?.name?.split(" ")[1] || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    emergencyContact: user?.emergencyContact || ""
  })
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState({ text: "", type: "" })

  useEffect(() => {
    // Update form data when user data changes
    if (user) {
      setFormData({
        firstName: user.name?.split(" ")[0] || "",
        lastName: user.name?.split(" ")[1] || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        emergencyContact: user.emergencyContact || ""
      })
    }
  }, [user])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage({ text: "", type: "" })

    try {
      // Combine first and last name
      const fullName = `${formData.firstName} ${formData.lastName}`.trim()

      const token = localStorage.getItem("token")
      const response = await axios.put("http://localhost:5000/api/users/update", {
        name: fullName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        emergencyContact: formData.emergencyContact
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })

      // Update the user context with the new data
      if (response.data.user) {
        updateUser({
          ...response.data.user,
          id: response.data.user._id // Ensure ID is properly mapped
        })
      }

      setMessage({ text: "Profile updated successfully!", type: "success" })
    } catch (error) {
      console.error("Error updating profile:", error)
      setMessage({ text: "Failed to update profile. Please try again.", type: "error" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="md:flex">
            {/* Sidebar */}
            <div className="md:w-1/4 bg-gray-50 p-6 border-r border-gray-200">
              <ProfilePicture />

              <div className="mt-8">
                <nav className="space-y-2">
                  {[
                    { label: "Profile Information", value: "profile", icon: "user" },
                    { label: "Ongoing Disasters", value: "disasters", icon: "map-pin" },
                    { label: "Security", value: "security", icon: "lock" },
                    { label: "My Reports", value: "reports", icon: "file" },
                  ].map((tab) => (
                    <button
                      key={tab.value}
                      onClick={() => setActiveTab(tab.value)}
                      className={`w-full text-left px-4 py-2 rounded-md flex items-center ${
                        activeTab === tab.value ? "bg-red-100 text-red-700" : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <span className="mr-3">
                      </span>
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Main content */}
            <div className="md:w-3/4 p-6">
              {activeTab === "profile" && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Profile Information</h2>

                  {message.text && (
                    <div className={`mb-4 p-3 rounded-md ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {message.text}
                    </div>
                  )}

                  <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">First Name</label>
                        <input
                          type="text"
                          name="firstName"
                          className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-red-500"
                          value={formData.firstName}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">Last Name</label>
                        <input
                          type="text"
                          name="lastName"
                          className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-red-500"
                          value={formData.lastName}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Email</label>
                      <input
                        type="email"
                        name="email"
                        className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-red-500"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-red-500"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </div>

                    <button
                      type="submit"
                      className="bg-red-600 text-white py-2 px-6 rounded-md hover:bg-red-700 transition-colors duration-300"
                      disabled={isLoading}
                    >
                      {isLoading ? "Saving..." : "Save Changes"}
                    </button>
                  </form>
                </div>
              )}

              {activeTab === "disasters" && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Ongoing Disasters</h2>
                  {/* <OngoingDisasters /> */}
                </div>
              )}

              {activeTab === "security" && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Security Settings</h2>
                  <ChangePassword />
                </div>
              )}

              {activeTab === "reports" && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">My Reports</h2>
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <p className="text-gray-500 text-center py-8">You haven't submitted any reports yet.</p>
                    <div className="text-center">
                      <a
                        href="/report"
                        className="inline-block bg-red-600 text-white py-2 px-6 rounded-md hover:bg-red-700 transition-colors duration-300"
                      >
                        Report an Emergency
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfile