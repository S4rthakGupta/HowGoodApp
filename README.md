# HowGood Project

## Overview
HowGood is a web-based sustainable application designed to help users discover sustainable products, track waste management, and find eco-friendly alternatives. The project leverages AI-powered APIs and authentication services to provide an intuitive user experience.

## Features
- **Sustainable Product Search**: Search for products by name or URL.
- **AI-Powered Sustainability Rating**: Get sustainability scores for products.
- **Speech-to-Text Search**: Voice-based search functionality.
- **User Authentication**: Secure login/signup using Clerk.
- **Waste Management Tracking**: Learn about recycling and composting.

## Project Architecture
```mermaid
graph LR
    A[Frontend - Next.js] -->|Fetch Data| B[Backend - Node.js]
    B -->|Database Storage| C[MongoDB Atlas]
    B -->|AI Processing| D[Hugging Face API]
    B -->|Search Engine| E[SerpAPI]
    A -->|User Authentication| F[Clerk API]
    B -->|AI-Powered Response| G[OpenAI API]
```

## Prerequisites
Ensure you have the following installed:
- Node.js (v16 or later)
- npm or yarn
- Git

## Installation and Setup
### Clone the repository
```sh
git clone [https://github.com/S4rthakGupta/HowGoodApp/tree/fix-rollback]
cd howgood/frontend
```

### Install dependencies
```sh
npm install
```

### Set up environment variables
Create a `.env.local` file in the root of the `frontend` directory and add the following:
```sh
MONGODB_URI=mongodb+srv://shakilamr124:HzopD5PTIzFX5j7k@howgooddb.bdpyc.mongodb.net/HowGood?retryWrites=true&w=majority
HUGGING_FACE_API_KEY=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
OPENAI_API_KEY=sk-svcacct-89K_iEcRJgE1B2qvStl5DehctV2ZQHRLvTVVx8KKv3gmyjhcuTcEXhe2VmaLsyV5KT3BlbkFJXnAbJhwhCLamtvj_NMfC8EGJEqaO6E1Rl7aumVpdlfRzREwBXYq8J4I1HQ8qOavAA

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_bWVycnktYmVhZ2xlLTQ3LmNsZXJrLmFjY291bnRzLmRldiQ
CLERK_SECRET_KEY=sk_test_BDSuvjDl1ydkhI9VLuvQf2sFfM046TpuhW0wdwmDDQ

SERP_API_KEY=f2b31603d7f9c27719238040e1e3c3341c6e6584d30ead16c4777757dbe22010
```

### Start the Development Server
```sh
npm run dev
```
Visit `http://localhost:3000` in your browser to see the application running.

## Project Structure
```
frontend/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── analyze/
│   │   │   ├── products/
│   │   │   ├── ai.ts
│   │   │   ├── products.ts
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   │   ├── button.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   ├── ProductCard.tsx
│   │   │   │   ├── Nav.tsx
│   │   │   │   ├── Footer.tsx
│   │   ├── styles/
│   ├── lib/
│   ├── middleware.ts
├── public/
├── .env.local
├── next.config.ts
├── package.json
├── tsconfig.json
├── README.md
```

## Team Members
| Name | Role | Institution |
|------|------|------------|
| **Sarthak Gupta** | Full-Stack Developer | Conestoga, Brantford |
| **Girish Bhuteja** | Front-End Developer | Conestoga, Waterloo |
| **Gaurav** | Full-Stack Developer | Conestoga, Brantford |
| **Shakila Rajapakse** | Front-End Developer | Conestoga, Brantford |

## Technologies Used
- **Frontend**: React.js, Next.js, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas
- **APIs**: Hugging Face, OpenAI, SerpAPI, Clerk

## Contributing
If you want to contribute:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Commit changes (`git commit -m 'Added new feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Open a Pull Request.

## License
This project is licensed under the MIT License.

## Contact
For any questions, feel free to reach out to the team!
