'use client';

import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import NavBar from "@/components/Nav";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-[Maven Pro]">
      <NavBar />

      {/* Hero Section */}
      <section className="relative flex flex-col lg:flex-row items-center justify-between min-h-screen px-6 lg:px-16">
        {/* Text Content (Left Aligned) */}
        <div className="relative z-10 max-w-xl text-left">
          <h1 className="text-5xl font-bold leading-tight mb-6">
            Clean Energy, Sustainable Future
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            We install advanced wind turbines to generate reliable, efficient, and eco-friendly energy for a greener tomorrow.
          </p>
          <div className="flex space-x-4">
            <Link href="/products">
              <Button className="bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700">
                Browse Products
              </Button>
            </Link>
            <Link href="/about">
            <Button className="border border-gray-900 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100">
              About HowGood
            </Button>
            </Link>
          </div>
        </div>

        {/* Background Image (Right Side) */}
        <div className="relative w-full lg:w-1/2">
          <Image
            src="/images/main.jpg"
            alt="Sustainable Future"
            width={1200}
            height={600}
            objectFit="cover"
            className="rounded-lg"
          />
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 px-6 text-center bg-gray-100">
        <h2 className="text-4xl font-bold mb-6 text-gray-900">
          Promoting Responsible Consumption
        </h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Our goal is to promote **sustainable consumption** and reduce environmental impact by encouraging people to make responsible product choices.
        </p>
      </section>
      <Footer/>
    </div>
  );
}
