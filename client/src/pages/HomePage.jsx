import { Link } from 'react-router';
import {
  User,
  ChevronRight,
  ChevronLeft,
  Plus,
  Minus,
  SquarePen,
  Save,
} from 'lucide-react';

function Navbar() {
  return (
    <nav className="p-3 sm:p-4 border-b">
      <div className="max-w-[1500px] mx-auto flex justify-between items-center px-4 sm:px-0">
        <Link to="/home" className="text-xl sm:text-2xl font-bold">
          timeblocker
        </Link>
        <div className="flex items-center justify-center gap-3">
          <div className="flex items-center justify-center border border-(--text-color) bg-(--text-color) text-white rounded-full p-2 cursor-pointer">
            <ChevronLeft size={20} />
          </div>
          <div className="flex items-center justify-center border border-(--text-color) bg-(--text-color) text-white rounded-full p-2 cursor-pointer">
            <ChevronRight size={20} />
          </div>

          <div className="flex items-center justify-center border border-(--text-color) bg-(--color-2) rounded-full p-2 cursor-pointer">
            <User size={20} />
          </div>
        </div>
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

function HomePage() {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Navbar />
      <main className="flex-1 flex w-full max-w-[1500px] mx-auto min-h-0 overflow-hidden">
        {/* Collection Page */}
        <div
          id="collection-page"
          className="w-1/2 h-full flex flex-col overflow-hidden border-r border-black"
        >
          {/* Collection Page Header */}
          <div className="m-2 bg-(--color-2) flex justify-between items-center border border-black rounded-lg p-2">
            <h2 className="text-xl font-bold">Capture tasks and notes</h2>
            <p className="text-sm text-black">Tuesday, November 4, 2025</p>
          </div>

          {/* Daily Metrics */}
          <div className="m-2 flex justify-between items-center border border-black rounded-lg p-2 shrink-0">
            <div className="flex items-center justify-center gap-4">
              <p>Daily Metrics</p>
              <div className="flex items-center justify-center gap-2">
                <div className="cursor-pointer flex items-center justify-center border-2 border-black rounded-full p-[2px]">
                  <Minus size={16} />
                </div>
                <p>0</p>
                <div className="cursor-pointer flex items-center justify-center border-2 border-black rounded-full p-[2px]">
                  <Plus size={16} />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2">
              <p>Shutdown Complete</p>
              <input
                type="checkbox"
                className="custom-checkbox w-5 h-5 cursor-pointer appearance-none border-2 border-black rounded checked:bg-(--color-purple) checked:border-(--color-purple) focus:outline-none focus:ring-2 focus:ring-(--color-purple) transition-colors"
              />
            </div>
          </div>

          {/* Tasks and Notes Container */}
          <div className="flex gap-2 m-2 flex-1 min-h-0">
            <div className="flex-1 flex flex-col border border-black rounded-lg overflow-hidden">
              <div className="flex justify-between items-center p-2 shrink-0">
                <h3 className="text-lg font-bold">Tasks</h3>
              </div>
              <div className="flex-1 overflow-auto">
                {/* Tasks content will go here */}
              </div>
            </div>
            <div className="flex-1 flex flex-col border border-black rounded-lg overflow-hidden">
              <div className="flex items-center justify-between p-2 shrink-0">
                <h3 className="text-lg font-bold">Notes</h3>
                <SquarePen size={20} className="cursor-pointer" />
              </div>
              <div className="flex-1 overflow-auto">
                {/* Notes content will go here */}
              </div>
            </div>
          </div>
        </div>

        {/* Time Block Grid */}
        <div id="time-block-grid" className="w-1/2 h-full overflow-auto">
          This is the time block grid
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default HomePage;
