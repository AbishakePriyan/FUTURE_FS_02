import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import logo from '../assets/Logo.jpg'

const About = () => {
  return (
    <div><Navbar />
    <div className="bg-black text-white min-h-screen flex items-center justify-center px-6 py-12">
      <div className="max-w-7xl grid md:grid-cols-2 gap-10 items-center">
        {/* Jersey Image */}
        <img
          src={logo} // Replace with your own hosted image URL or use assets if preferred
          alt="Jersey Hub Showcase"
          className="w-full h-auto rounded-lg shadow-lg"
        />

        {/* Text Section */}
        <div>
          <p className="text-yellow-400 font-medium text-lg mb-2">About Jersey Hub</p>
          <h1 className="text-4xl font-bold mb-6 leading-tight">Connected With<br />Our Team Now!</h1>
          <p className="text-gray-300 mb-4">
            At <strong>Jersey Hub</strong>, we believe football is more than a game — it’s a passion, a culture, and a way of life.
            We are dedicated to bringing fans closer to their favorite teams with premium, stylish, and comfortable football jerseys.
          </p>
          <p className="text-gray-400 mb-4">
            Whether you're cheering in the stands or repping your club on the streets, Jersey Hub has the gear to match your spirit.
            From classic designs to modern fits, we provide jerseys that speak your loyalty loud and proud.
          </p>
          <p className="text-gray-500 mb-6">
            Join the movement. Show your colors. Represent your squad. Every game. Every goal. Every heartbeat.
          </p>
          <Link to="/shop">
            <button className="bg-white text-black font-semibold px-6 py-3 rounded-md hover:bg-gray-200 transition">
              Shop Now
            </button>
          </Link>
        </div>
      </div>
    </div>
</div>
  );};

export default About;
