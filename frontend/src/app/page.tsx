import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Head from "next/head";
import { Roboto } from "next/font/google";
import { Button } from "@/components/ui/button";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

const roboto = Roboto({ subsets: ["latin"], weight: "400" });

export default function SustainabilityPage() {
  return (
    <div className={`flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100 ${roboto.className}`}>
      <Head>
        <title>HowGood - Sustainability</title>
        <meta name="description" content="Learn about sustainability and how to make eco-friendly choices." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet" />
      </Head>
      
      {/* Navigation Bar */}
      <nav className="w-full bg-green-700 text-white py-4 px-6 flex justify-between items-center shadow-md fixed top-0 z-50">
        <h1 className="text-2xl font-bold">HowGood</h1>
        <ul className="flex space-x-6">
          <li><a href="#" className="hover:underline">Home</a></li>
          <li><a href="#" className="hover:underline">About</a></li>
          <li><a href="#" className="hover:underline">Contact</a></li>
          <li>
            <SignedOut>
              <SignInButton mode="modal" className="bg-white text-green-700 px-4 py-2 rounded-md hover:bg-gray-200"/>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </li>
        </ul>
      </nav>
      
      {/* Main Content */}
      <div className="mt-28 text-center">
        <h1 className="text-5xl font-bold text-green-700 mb-8">
          HowGood
        </h1>
        <p className="text-center text-gray-600 max-w-2xl mb-10">
          Embracing sustainability helps protect our planet for future generations. Discover eco-friendly solutions and make a difference today!
        </p>
        <Button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-500">
          View Featured Products
        </Button>
      </div>
      
      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mt-10">
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
      
      {/* Footer */}
      <footer className="w-full bg-gray-800 text-white py-4 mt-12 text-center">
        <p>&copy; 2025 HowGood. All rights reserved.</p>
      </footer>
    </div>
  );
}
