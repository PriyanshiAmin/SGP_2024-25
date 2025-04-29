import type React from "react"
import GuideCard from "../components/GuideCard"

// Define the guide data
const guides = [
  {
    id: 1,
    title: "Flood",
    imageUrl: "/src/images/flood.png",
    learnMoreUrl: "https://ndma.gov.in/sites/default/files/PDF/Floods/flood.pdf",
  },
  {
    id: 2,
    title: "Building Fire",
    imageUrl: "/src/images/building fire.jpg",
    learnMoreUrl: "https://fire.telangana.gov.in/WebSite/Downloads/Business%20Buildings.pdf",
  },
  {
    id: 3,
    title: "Earthquake",
    imageUrl: "/src/images/earthquake.png",
    learnMoreUrl: "https://ndma.gov.in/sites/default/files/PDF/Earthquake/earthquakes.pdf",
  },
  {
    id: 4,
    title: "Hurricane",
    imageUrl: "/src/images/hurrican.png",
    learnMoreUrl: "https://ndma.gov.in/sites/default/files/PDF/cyclone/cyclones.pdf",
  },
  {
    id: 5,
    title: "Forest Fire",
    imageUrl: "/src/images/forest fire.png",
    learnMoreUrl: "https://ndma.gov.in/sites/default/files/PDF/Reports/BestPracticesForestFire_final.pdf",
  },
  {
    id: 6,
    title: "Rock Fall",
    imageUrl: "/src/images/ls.jpg",
    learnMoreUrl: "https://ndma.gov.in/sites/default/files/PDF/Landslide/landslidessnowavalanches.pdf",
  },
  {
    id: 7,
    title: "Mob Lynching",
    imageUrl: "/src/images/mob lynching.png",
    learnMoreUrl: "#",
  },
  {
    id: 8,
    title: "Tsunami",
    imageUrl: "/src/images/tsunami.png",
    learnMoreUrl:
      "https://ndma.gov.in/sites/default/files/PDF/Tsunami/ndma%20guidelines-%20management%20of%20tsunamis.pdf",
  },
]

const Guides: React.FC = () => {
  return (
    <div>
      <header className="relative">
        <div className="container mx-auto px-4 py-16">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/3 mb-8 md:mb-0">
              <img src="/src/images/20944668.jpg" alt="Disaster guides" className="w-full h-auto rounded-lg shadow-lg" />
            </div>
            <div className="md:w-1/2 md:pl-12">
              <h1 className="text-3xl md:text-4xl font-bold mb-6">
                Explore our essential <span className="text-red-600">Guides</span> to protect yourself and your
                community.
              </h1>
              <p className="text-xl text-gray-700">
                Individuals who take at least three preparedness actions increase their disaster survival odds by{" "}
                <span className="text-red-600 font-bold">80%</span>.
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {guides.map((guide) => (
            <GuideCard key={guide.id} title={guide.title} imageUrl={guide.imageUrl} learnMoreUrl={guide.learnMoreUrl} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Guides

