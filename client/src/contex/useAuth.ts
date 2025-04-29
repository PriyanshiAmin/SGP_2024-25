// src/context/useAuth.ts
import { useContext } from "react"
import { AuthContext } from "./AuthContex"

export const useAuth = () => useContext(AuthContext)

export const DEFAULT_PROFILE_PIC = "/src/images/anonymous.jpg"
