import type React from "react"
import AlertSection from "../components/AlertSection"

const Home: React.FC = () => {
  return (
    <div>
      <header className="relative">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <img src="/src/images/homepage.png" alt="Disaster response" className="w-full h-auto rounded-lg shadow-lg" />
            </div>
            <div className="md:w-1/2 md:pl-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="text-red-600">Disasters</span> strike, <br />
                but Together we <span className="text-red-600">Rise</span>
              </h1>
              <p className="text-xl text-gray-700">
                Alertness saves lives. Resilience rebuilds communities. Together, we stand stronger against disasters.
              </p>
            </div>
          </div>
        </div>
      </header>

      <AlertSection />
    </div>
  )
}

export default Home

