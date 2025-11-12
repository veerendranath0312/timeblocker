import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Calendar, MoveRight } from 'lucide-react';
import Carousel from '../components/Carousel';

function Navbar() {
  return (
    <nav className="p-3 sm:p-4 border-b">
      <div className="max-w-[1100px] mx-auto flex justify-between items-center px-4 sm:px-0">
        <Link to="/" className="text-xl sm:text-2xl font-bold">
          Time Blocker
        </Link>
        <Link
          to="/auth"
          className="bg-(--text-color) text-white text-xs sm:text-sm px-3 sm:px-[20px] py-[6px] rounded-full cursor-pointer"
        >
          Get Started
        </Link>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="p-3 sm:p-4 border-t text-center">
      <p className="text-xs sm:text-sm px-4">
        Copyright &copy; 2025 Time Blocker | All rights reserved
      </p>
    </footer>
  );
}

function LandingPage() {
  const [carouselWidth, setCarouselWidth] = useState(450);

  useEffect(() => {
    const updateCarouselWidth = () => {
      if (window.innerWidth < 640) {
        setCarouselWidth(Math.min(window.innerWidth - 32, 350));
      } else if (window.innerWidth < 768) {
        setCarouselWidth(400);
      } else {
        setCarouselWidth(450);
      }
    };

    updateCarouselWidth();
    window.addEventListener('resize', updateCarouselWidth);
    return () => window.removeEventListener('resize', updateCarouselWidth);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="max-w-[1100px] mx-auto flex-1 flex flex-col items-center justify-center gap-4 sm:gap-5 px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex gap-2 items-center justify-center bg-(--color-1) px-3 sm:px-4 py-1 rounded-4xl text-xs sm:text-sm">
          <Calendar size={14} className="sm:w-4 sm:h-4" />
          <p className="whitespace-nowrap sm:whitespace-normal">
            Based on Cal Newport's Time-Blocking Methodology
          </p>
        </div>
        <h1 className="max-w-[700px] text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-balance text-center leading-tight">
          Give every minute of your day a job
        </h1>
        <p className="max-w-[700px] text-center text-sm sm:text-base text-[#666] font-light text-balance px-2">
          Move from reactive, distraction-prone workflows to proactive,
          intention-driven productivity. Time Block Planner is a digital
          implementation of the proven time-blocking method.
        </p>

        <div className="mt-6 w-full flex justify-center items-center">
          <div className="h-[280px] sm:h-[300px] relative flex items-center justify-center">
            <Carousel
              baseWidth={carouselWidth}
              autoplay={true}
              autoplayDelay={3000}
              pauseOnHover={true}
              loop={true}
              round={false}
            />
          </div>
        </div>

        <Link
          to="/auth"
          className="bg-(--text-color) text-white text-xs sm:text-sm px-4 sm:px-[20px] py-[6px] rounded-full cursor-pointer flex items-center gap-2 mt-2 sm:mt-0"
        >
          Start Planning Today <MoveRight size={16} className="sm:w-4 sm:h-4" />
        </Link>
      </main>
      <Footer />
    </div>
  );
}

export default LandingPage;
