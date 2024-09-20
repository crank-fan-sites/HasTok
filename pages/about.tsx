import React from 'react';
import PageHeader from "@/components/PageHeader";
import Footer from "@/components/Footer";

const About: React.FC = () => {
  return (
    <div className="bg-scanlines bg-custom-purple"> {/* Base background */}
      <PageHeader>About HasTok</PageHeader>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-white">
          I&apos;m &quot;chase_saddy&quot; around <a href="https://twitter.com/chase_saddy" className="text-blue-500">Twitter</a>, <a href="https://twitch.tv/chase_saddy" className="text-blue-500">Twitch</a>. 
          My Hasan &quot;brand&quot;, Hasan&apos;s Producer, is at <a href="https://tiktok.com/HasansProducer" className="text-blue-500">Tiktok</a>, <a href="https://twitter.com/HasansProducer" className="text-blue-500">Twitter</a>.
        </p>
        <p className="text-white">The Twitter of the general umbrella of HasanAbiTV.com is 
          <a href="https://twitter.com/HasanAbisTV" className="text-blue-500"> HasanAbisTV</a>.
        </p>
        <br />
        <p className="text-white">
          It costs roughly $1 per 1000 requests for TikTok API usage. It costs a variable amount of money for the Twitter API upkeep. I pay these out of pocket right now. There&apos;s a Patreon coming to support with costs and future development.
        </p>
      </div>

    <Footer />
    </div>
  );
};

export default About;