import React from 'react';
import Link from 'next/link';

const TopLinks: React.FC = () => {
  const links = [
    { href: 'https://hasanabitv.com', title: 'HasanAbi TV Home' },
    { href: '/', title: 'HasTok Home' },
    { href: '/stats', title: 'HasTok Stats' },
    { href: '/users', title: 'TikTok Users' },
  ];

  return (
    <div className="text-center container mx-auto px-4 sm:px-6 lg:px-8 py-1">
      <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-4">
        {links.map((link, index) => (
          <Link key={index} href={link.href} className="inline-block bg-purple-700 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full sm:w-auto">
            {link.title}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TopLinks;