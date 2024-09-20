import React from 'react';
import { Analytics } from '@vercel/analytics/react';

interface PageHeaderProps {
  children: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ children }) => {
  return (
    <div className="relative w-full">
      <div className="w-full aspect-[680/130] relative">
        <div 
          className="absolute inset-0 bg-cover bg-center z-10" 
          style={{ backgroundImage: "url('/images/top-thin-rect.jpg')" }}
        ></div>
      </div>
      <div className="absolute inset-x-0 bottom-0 bg-black bg-opacity-70 z-30">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-purple-500 tracking-wide py-2">
          {children}
        </h1>
      </div>
      <Analytics />
    </div>
  );
};

export default PageHeader;
