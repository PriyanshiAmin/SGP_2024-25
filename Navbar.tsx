"use client"

import type React from "react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth, DEFAULT_PROFILE_PIC } from "../contex/useAuth"


const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen)
  }

  const handleLogout = () => {
    logout()
    navigate("/")
    setIsProfileMenuOpen(false)
  }

  const profilePicture = user?.profilePicture || DEFAULT_PROFILE_PIC

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            {/* Logo can be added here */}
            <h1 className="text-xl font-bold">RescueNet</h1>
          </div>

          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-gray-700 focus:outline-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-menu"
              >
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            </button>
          </div>

          <ul
            className={`md:flex space-x-8 ${isMenuOpen ? "block absolute top-16 left-0 right-0 bg-white shadow-md z-10 p-4" : "hidden"} md:static md:shadow-none`}
          >
            <li>
              <Link to="/" className="text-gray-700 hover:text-red-600">
                Home
              </Link>
            </li>
            <li>
              <Link to="/guides" className="text-gray-700 hover:text-red-600">
                Guides
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-gray-700 hover:text-red-600">
                Contact
              </Link>
            </li>
            <li>
              <Link to="/volunteer" className="text-gray-700 hover:text-red-600">
                Volunteer
              </Link>
            </li>
          </ul>

          <div className="hidden md:flex space-x-4 items-center">
            <Link to="/report" className="btn report">
              Report Now
            </Link>

            {isAuthenticated ? (
              <div className="relative">
                <button onClick={toggleProfileMenu} className="focus:outline-none">
                  <img
                    src={profilePicture || "/placeholder.svg"}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover border-2 border-red-500"
                  />
                </button>

                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      Your Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/signin" className="btn sign_in">
                Sign In
              </Link>
            )}
          </div>
        </div>

        {isMenuOpen && (
          <div className="mt-4 md:hidden flex flex-col space-y-2">
            <Link to="/report" className="btn report text-center">
              Report Now
            </Link>

            {isAuthenticated ? (
              <>
                <Link to="/profile" className="btn sign_in text-center">
                  Your Profile
                </Link>
                <button onClick={handleLogout} className="btn sign_in text-center">
                  Sign out
                </button>
              </>
            ) : (
              <Link to="/signin" className="btn sign_in text-center">
                Sign In
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar

