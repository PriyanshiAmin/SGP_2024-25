import type React from "react"

interface GuideCardProps {
  title: string
  imageUrl: string
  learnMoreUrl: string
}

const GuideCard: React.FC<GuideCardProps> = ({ title, imageUrl, learnMoreUrl }) => {
  return (
    <article className="bg-white rounded-lg overflow-hidden shadow-md transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
      <img src={imageUrl || "/placeholder.svg"} alt={title} className="w-full h-48 object-cover" />
      <div className="p-5">
        <h3 className="text-xl font-bold mb-3">{title}</h3>
        <a
          href={learnMoreUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-red-600 font-semibold hover:text-red-800"
        >
          Learn More
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
            className="ml-1"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </a>
      </div>
    </article>
  )
}

export default GuideCard

