import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <p className="text-center text-purple-400">
        <Link href="/">
          Home
        </Link>
        {' | '}
        <Link href="/about">
          About
        </Link>
        {' | '}
        <a href="https://twitter.com/hasansproducer" target="_blank" rel="noopener noreferrer">
          HasanAbi Community Twitter
        </a>
        {' | '}
        <a href="https://tiktok.com/hasansproducer" target="_blank" rel="noopener noreferrer">
          HasanAbi Community TikTok
        </a>
      </p>
    </div>
  );
};

export default Footer;
