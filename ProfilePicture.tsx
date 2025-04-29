"use client"

import type React from "react"
import { useState, useRef } from "react"
import { useAuth, DEFAULT_PROFILE_PIC } from "../contex/useAuth"


const ProfilePicture: React.FC = () => {
  const { user, updateUser } = useAuth()
  const [isHovering, setIsHovering] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const profilePicture = user?.profilePicture || DEFAULT_PROFILE_PIC

  const handlePictureClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === "string") {
        updateUser({ profilePicture: reader.result })
      }
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="flex flex-col items-center">
      <div
        className="relative w-32 h-32 mb-4"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onClick={handlePictureClick}
      >
        <img
          src={profilePicture || "/placeholder.svg"}
          alt="Profile"
          className="w-full h-full rounded-full object-cover border-4 border-red-500 cursor-pointer"
        />

        {isHovering && (
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center cursor-pointer">
            <span className="text-white font-medium">Change Photo</span>
          </div>
        )}

        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
      </div>

      <h2 className="text-2xl font-bold">{user?.name || "User"}</h2>
      <p className="text-gray-600">{user?.email || "user@example.com"}</p>
    </div>
  )
}

export default ProfilePicture

