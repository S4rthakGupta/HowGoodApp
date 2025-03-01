import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Head from "next/head";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { FaLinkedin, FaGithub } from "react-icons/fa";

const teamMembers = [
  {
    name: "Sarthak Gupta",
    role: "Web Developer",
    image: "/team/Sarthak.png",
    campus: "Conestoga Brantford",
    linkedin: "https://www.linkedin.com/in/s4rthak-gupta",
    github: "https://github.com/S4rthakGupta",
  },
  {
    name: "Girish Bhuteja",
    role: "Full-Stack Developer",
    image: "/team/Girish.jpeg",
    campus: "Conestoga Waterloo",
    linkedin: "https://www.linkedin.com/in/girishbhuteja0744/",
    github: "https://github.com/Girish0744",
  },
  {
    name: "Gaurav",
    role: "Web Developer",
    image: "/team/Gaurav.jpg",
    campus: "Conestoga Brantford",
    linkedin: "https://www.linkedin.com/in/gaurav-9411a42a3/",
    github: "https://github.com/GauravChumber",
  },
  {
    name: "Shakila Rajapakse",
    role: "Web Developer",
    image: "/team/shakila.png",
    campus: "Conestoga Brantford",
    linkedin: "https://www.linkedin.com/in/shakila-rajapakse/",
    github: "https://github.com/101Shakila",
  },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100">
      <Head>
        <title>HowGood - About Us</title>
        <meta name="description" content="Learn about HowGood and our commitment to sustainability." />
      </Head>

      {/* Navigation Bar */}
      <nav className="fixed top-0 w-full bg-white shadow-md py-4 px-8 flex justify-between items-center z-50">
        <h1 className="text-2xl font-semibold tracking-wide">HowGood</h1>
        <ul className="flex space-x-6 text-lg">
          <li><Link href="/" className="hover:text-gray-600">Home</Link></li>
          <li><Link href="/about" className="hover:text-gray-600">About</Link></li>
          <li><Link href="/contact" className="hover:text-gray-600">Contact</Link></li>
          <li>
            <SignedOut>
              <div className="bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-700 cursor-pointer">
                <SignInButton mode="modal" />
              </div>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </li>
        </ul>
      </nav>

      {/* Website Overview Section */}
      <div className="mt-20 text-center">
        <h1 className="text-5xl font-bold text-green-700 mb-8">
          About HowGood
        </h1>
        <p className="text-center text-gray-600 max-w-2xl mb-10">
          HowGood is an innovative platform that helps users discover sustainable products, track their carbon footprint, and make informed choices for a greener future.
        </p>
      </div>

      {/* Sustainability Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        <Card>
          <CardHeader>
            <CardTitle>Eco-Friendly Products</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Explore sustainable alternatives to everyday products and reduce your carbon footprint.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Waste Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Learn how to properly recycle, compost, and minimize waste in your daily life.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Energy Conservation</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Adopt energy-saving practices and explore renewable energy sources for a greener future.</p>
          </CardContent>
        </Card>
      </div>

      {/* Team Section */}
      <div className="max-w-6xl mx-auto px-6 pb-16 mt-16">
        <h2 className="text-4xl font-semibold text-center text-gray-800 mb-10">
          Meet Our Team
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="relative group bg-white p-6 rounded-xl shadow-xl 
              border border-gray-200 hover:shadow-2xl transition-all 
              duration-300 transform hover:scale-105"
            >
              {/* Profile Image */}
              <div className="relative">
                <Image
                  src={member.image}
                  alt={member.name}
                  width={150}
                  height={150}
                  className="rounded-full mx-auto border-4 border-green-500 
                  shadow-md transition-all duration-300 group-hover:border-green-400"
                />
              </div>

              {/* Name & Role */}
              <h3 className="text-xl font-semibold mt-4 text-gray-900">
                {member.name}
              </h3>
              <h4>{member.campus}</h4>
              <p className="text-gray-600 text-md">{member.role}</p>

              {/* Social Media Links */}
              <div className="flex justify-center gap-4 mt-3">
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 transition"
                >
                  <FaLinkedin size={24} />
                </a>
                <a
                  href={member.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 hover:text-gray-900 transition"
                >
                  <FaGithub size={24} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-gray-500 text-sm pb-16">
        ©️ {new Date().getFullYear()} HowGood. All rights reserved.
      </footer>
    </div>
  );
}