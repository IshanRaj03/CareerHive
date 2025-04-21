# CareerHive 🚀

![Next.js](https://img.shields.io/badge/Next.js-14.2.3-black?logo=next.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-%2338B2AC?logo=tailwind-css)

An intelligent job recommendation platform that analyzes resumes using AI and matches candidates with perfect career opportunities. Built with modern web technologies and designed for the future of hiring.

## Architecture
![ChatGPT Image Apr 21, 2025, 02_55_11 PM](https://github.com/user-attachments/assets/d365a2ae-2760-431b-94ca-6e06a991d20d)

The user uploads a resume via the frontend, LangChain extracts its text and Gemini AI generates a summary and search parameters for the Linkedin API. The system queries the LinkedIn API for matching positions (stored in PostgreSQL), then creates vector embeddings of both resume and job data, saves them in Pinecone, and uses cosine similarity to surface the best job matches back to the user.

## 🌟 Features

### Resume Processing
- **File Upload**: Drag-and-drop PDF support with animated UI
- **AI Analysis**: Skills extraction and experience scoring (Integrate with NLP services)
- **Real-time Preview**: Instant file validation and size checks

### Job Matching
- **Personalized Recommendations**: ML-powered job matching algorithm
- **Rich Job Cards**:
  - Company logos (LinkedIn CDN optimized)
  - Salary range analysis
- **Pagination**: Smooth navigation with animated transitions

### Modern UI/UX (Used Aceternity)
- **Animations**: Framer Motion-powered interactions
  - Hover effects on cards
  - Smooth page transitions
  - Loading skeletons
- **Responsive Design**: Mobile-first approach with Tailwind CSS

## 🛠️ Tech Stack

**Frontend**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS + Shadcn UI Components
- Framer Motion (Animations)
- Axios (HTTP Client)
- React Dropzone (File Upload)

**Backend**
- Next.js API Routes
- AI Service Integration (Gemini)
- PostgreSQL (Job Storage)
- PineCone (Vectore Embedding Storage)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database
- PineCone database
- API keys for AI services

### Installation
```bash
# Clone repository
git clone https://github.com/yourusername/careerhive.git
cd careerhive

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

### Configuration
Populate .env:
```bash
# Database
DATABASE_URL=""         #Your Postgresql Connection String
PINECONE_API_KEY= ""    # Your PineCone DB API Key

# AI Services
GEMINI_API_KEY=your_gemini_key
```

### Running Locally
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Configuration
In your next.config.ts:
```bash
export default {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'media.licdn.com',
      },
      {
        protocol: 'https',
        hostname: 'static.licdn.com',
      },
    ],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
}
```

