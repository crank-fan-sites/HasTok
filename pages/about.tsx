import React from 'react';

const About: React.FC = () => {
  return (
    <div className="bg-scanlines bg-custom-purple"> {/* Base background */}
      <div className="relative w-full">
        <div className="w-full aspect-[680/130] relative"> {/* Added relative positioning */}
          <div 
            className="absolute inset-0 bg-cover bg-center z-10" 
            style={{ backgroundImage: "url('/images/top-thin-rect.jpg')" }}
          ></div>
        </div>
        <div className="absolute inset-x-0 bottom-0 bg-black bg-opacity-70 z-30"> {/* Higher opacity, highest z-index */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-blue-500 tracking-wide py-2">
            About HasTok
          </h1>
        </div>
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-white">
          I'm "chase_saddy" around <a href="https://twitter.com/chase_saddy" className="text-blue-500">Twitter</a>, <a href="https://twitch.tv/chase_saddy" className="text-blue-500">Twitch</a>. 
          My Hasan "brand", Hasan's Producer, is at <a href="https://tiktok.com/HasansProducer" className="text-blue-500">Tiktok</a>, <a href="https://twitter.com/HasansProducer" className="text-blue-500">Twitter</a>.</p>
        <p className="text-white">The Twitter of the general umbrella of HasanAbiTV.com is 
          <a href="https://twitter.com/HasanAbisTV" className="text-blue-500"> HasanAbisTV</a>.
        </p>
        <br />
        <p className="text-white">
          It costs roughly $1 per 1000 requests for TikTok API usage. It costs a variable amount of money for the Twitter API upkeep. I pay these out of pocket right now. There's a Patreon coming to support with costs and future development.
        </p>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-center text-red-400">
          <a href="/">Home</a> | <a href="/about">About</a> | <a href="https://twitter.com/hasansproducer">HasanAbi Community Twitter</a> | <a href="https://tiktok.com/hasansproducer">HasanAbi Community TikTok</a>
        </p>
      </div>
    </div>
  );
};

export default About;