import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Head from "next/head";

export default function SustainabilityPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100">
      <Head>
        <title>HowGood - Sustainability</title>
        <meta name="description" content="Learn about sustainability and how to make eco-friendly choices." />
      </Head>
      
      {/* Navigation Bar */}
      <nav className="w-full bg-green-700 text-white py-4 px-6 flex justify-between items-center shadow-md fixed top-0">
        <h1 className="text-2xl font-bold">HowGood</h1>
        <ul className="flex space-x-6">
          <li><a href="#" className="hover:underline">Home</a></li>
          <li><a href="#" className="hover:underline">About</a></li>
          <li><a href="#" className="hover:underline">Contact</a></li>
        </ul>
      </nav>
      
      {/* Main Content */}
      <div className="mt-20 text-center">
        <h1 className="text-5xl font-bold text-green-700 mb-8">
          HowGood
        </h1>
        <p className="text-center text-gray-600 max-w-2xl mb-10">
          Embracing sustainability helps protect our planet for future generations. Discover eco-friendly solutions and make a difference today!
        </p>
      </div>
      
      {/* Cards Section */}
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
    </div>
  );
}
