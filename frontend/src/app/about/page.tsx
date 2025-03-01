import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Head from "next/head";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function SustainabilityPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100">
      <Head>
        <title>HowGood - Sustainability</title>
        <meta name="description" content="Learn about sustainability and how to make eco-friendly choices." />
      </Head>

      {/* Updated Navigation Bar (Copied from HomePage) */}
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
