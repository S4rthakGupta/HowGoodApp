import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Head from "next/head";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";

const teamMembers = [
  {
    name: "Sarthak Gupta",
    role: "Web Developer",
    image: "/team/Sarthak.jpg",
    campus: "Conestoga, Brantford",
    linkedin: "https://www.linkedin.com/in/s4rthak-gupta",
    github: "https://github.com/S4rthakGupta",
  },
  {
    name: "Girish Bhuteja",
    role: "Full-Stack Developer",
    image: "/team/Girish.jpg",
    campus: "Conestoga, Waterloo",
    linkedin: "https://www.linkedin.com/in/girishbhuteja0744/",
    github: "https://github.com/Girish0744",
  },
  {
    name: "Gaurav",
    role: "Web Developer",
    image: "/team/Gaurav2.jpg",
    campus: "Conestoga, Brantford",
    linkedin: "https://www.linkedin.com/in/gaurav-9411a42a3/",
    github: "https://github.com/GauravChumber",
  },
  {
    name: "Shakila Rajapakse",
    role: "Web Developer",
    image: "/team/Shakila.png",
    campus: "Conestoga, Brantford",
    linkedin: "https://www.linkedin.com/in/shakila-rajapakse/",
    github: "https://github.com/101Shakila",
  },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-[#13531c] text-white">
      <Head>
        <title>HowGood - About Us</title>
        <meta name="description" content="Learn about HowGood and our commitment to sustainability." />
      </Head>

      {/* Navigation Bar */}
      <Nav/>

{/* Website Overview Section */}
      <div className="mt-20 text-center">
        <h1 className="text-5xl font-bold text-white mb-8">  {/* Changed text color to white */}
          Future plans of HowGood
        </h1>
        <p className="text-center text-white max-w-2xl mb-10"> {/* Changed text color to white */}
          HowGood is an innovative platform that helps users discover sustainable products, track their carbon footprint, and make informed choices for a greener future.
        </p>
      </div>

{/* Sustainability Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        <Card>
          <CardHeader>
            <div className="text-black">
              <CardTitle>Eco-Friendly Products</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p>Explore sustainable alternatives to everyday products and reduce your carbon footprint.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="text-black">
              <CardTitle>Waste Management</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p>Learn how to properly recycle, compost, and minimize waste in your daily life.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="text-black">
              <CardTitle>Energy Conservation</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p>Adopt energy-saving practices and explore renewable energy sources for a greener future.</p>
          </CardContent>
        </Card>
      </div>

      {/* Team Section */}
      <div className="max-w-6xl mx-auto px-6 pb-16 mt-24">
        <h2 className="text-4xl font-semibold text-center text-white mb-10">
          Meet Our Team
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="relative group bg-white text-black p-6 rounded-xl shadow-xl border border-gray-200 transition-all duration-300 transform hover:scale-110 hover:shadow-2xl flex flex-col items-center"
            >
              {/* Profile Image */}
              <div className="relative w-32 h-32 mb-4 overflow-hidden rounded-lg">
              <Image
              src={member.image}
              alt={member.name}
              width={180}
              height={180}
              className="rounded-lg shadow-lg transition-all duration-300 group-hover:border-[#13531c]"
              style={{ objectFit: "cover" }}  // ✅ Fix applied
            />

              </div>

              {/* Name & Role */}
              <h3 className="text-xl font-semibold text-center text-[#13531c]">
                {member.name}
              </h3>
              <h4 className="text-center text-gray-600">{member.campus}</h4>
              <p className="text-center text-gray-600 text-md">{member.role}</p>

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
      <Footer/>
    </div>
  );
}
