import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import "./styles/globals.css"
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3"



createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleReCaptchaProvider
      reCaptchaKey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
      scriptProps={{ async: true, defer: true }}
    >
      <App />
    </GoogleReCaptchaProvider>
  </StrictMode>
)
