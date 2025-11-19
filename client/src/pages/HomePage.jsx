import { Link } from 'react-router';
import { User, ChevronRight, ChevronLeft, Plus, Minus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/Tabs';
import Tasks from '../components/Tasks';
import Notes from '../components/Notes';
import { ResourceSchedular } from '../components/ResourceSchedular';
import { useDateStore } from '../store/useDateStore';

const RESOURCES = [
  { id: 'plan-a', name: 'Plan A' },
  { id: 'plan-b', name: 'Plan B' },
  { id: 'plan-c', name: 'Plan C' },
  { id: 'plan-d', name: 'Plan D' },
];

function Navbar() {
  return (
    <nav className="p-3 sm:p-4 border-b">
      <div className="max-w-[1500px] mx-auto flex justify-between items-center px-4 sm:px-0">
        <Link to="/home" className="text-xl sm:text-2xl font-bold">
          timeblocker
        </Link>
        <div className="flex items-center justify-center gap-3">
          {/* <div className="flex items-center justify-center border border-(--text-color) bg-(--text-color) text-white rounded-full p-2 cursor-pointer">
            <ChevronLeft size={20} />
          </div>
          <div className="flex items-center justify-center border border-(--text-color) bg-(--text-color) text-white rounded-full p-2 cursor-pointer">
            <ChevronRight size={20} />
          </div> */}

          <div className="flex items-center justify-center border border-(--text-color) bg-(--color-2) rounded-full p-2 cursor-pointer">
            <User size={20} />
          </div>
        </div>
      </div>
    </nav>
  );
}

function CollectionPage() {
  const currentDate = useDateStore((state) => state.currentDate);
  const dailyMetricsByDate = useDateStore((state) => state.dailyMetricsByDate);
  const updateDailyMetrics = useDateStore(
    (state) => state.updateDailyMetricsForDate
  );

  // Get date string for current date
  const dateString = currentDate.toISOString().split('T')[0];
  const dailyMetrics = dailyMetricsByDate[dateString] || {
    shutdownComplete: false,
    deepHours: 0,
  };

  const incrementDeepHours = () => {
    const current = dailyMetrics.deepHours;
    if (current < 24) {
      updateDailyMetrics(currentDate, { deepHours: current + 1 });
    }
  };

  const decrementDeepHours = () => {
    const current = dailyMetrics.deepHours;
    if (current > 0) {
      updateDailyMetrics(currentDate, { deepHours: current - 1 });
    }
  };

  const handleShutdownCompleteChange = (checked) => {
    updateDailyMetrics(currentDate, { shutdownComplete: checked });
  };

  return (
    <div
      id="collection-page"
      className="w-1/3 h-full flex flex-col overflow-hidden border-r border-black"
    >
      {/* Collection Page Header */}
      {/* <div className="m-2 bg-(--color-2) flex flex-wrap justify-between items-center border border-black rounded-lg p-2">
        <h2 className="text-lg font-bold">Capture tasks and notes</h2>
        <p className="text-lg font-bold text-black">
          Tuesday, November 4, 2025
        </p>
      </div> */}

      {/* Daily Metrics */}
      <div className="m-2 flex flex-col gap-3 bg-(--color-2) border border-black rounded-lg p-2 shrink-0">
        <div className="flex justify-between items-center gap-4">
          <p className="text-sm text-gray-600">Daily Metrics</p>
          <div className="flex items-center justify-center gap-2">
            <div
              className="cursor-pointer flex items-center justify-center border-2 border-black rounded-full p-[2px]"
              onClick={decrementDeepHours}
            >
              <Minus size={14} />
            </div>
            <p className="flex-1 w-[15px] text-center">
              {dailyMetrics.deepHours}
            </p>
            <div
              className="cursor-pointer flex items-center justify-center border-2 border-black rounded-full p-[2px]"
              onClick={incrementDeepHours}
            >
              <Plus size={14} />
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center gap-2">
          <p className="text-sm text-gray-600">Shutdown Complete</p>
          <input
            type="checkbox"
            checked={dailyMetrics.shutdownComplete}
            onChange={(e) => handleShutdownCompleteChange(e.target.checked)}
            className="custom-checkbox w-5 h-5 cursor-pointer appearance-none border-2 border-black rounded checked:bg-(--color-purple) checked:border-(--color-purple) focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Tasks and Notes */}
      <div className="flex flex-col gap-6 mx-2 min-w-0 flex-1 min-h-0">
        <Tabs defaultValue="account" className="w-full min-w-0 flex-1 min-h-0">
          <TabsList>
            <TabsTrigger value="account">Tasks</TabsTrigger>
            <TabsTrigger value="password">Notes</TabsTrigger>
          </TabsList>
          <TabsContent value="account" className="flex-1 min-h-0">
            <Tasks />
          </TabsContent>
          <TabsContent value="password" className="flex-1 min-h-0">
            <Notes />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function TimeBlockGrid() {
  const currentDate = useDateStore((state) => state.currentDate);
  const setCurrentDate = useDateStore((state) => state.setCurrentDate);
  const eventsByDate = useDateStore((state) => state.eventsByDate);
  const addEvent = useDateStore((state) => state.addEvent);
  const updateEvent = useDateStore((state) => state.updateEvent);
  const deleteEvent = useDateStore((state) => state.deleteEvent);

  // Get date string for current date
  const dateString = currentDate.toISOString().split('T')[0];
  const events = eventsByDate[dateString] || [];

  const handleAddEvent = (event) => {
    addEvent(currentDate, event);
  };

  const handleUpdateEvent = (id, updates) => {
    updateEvent(currentDate, id, updates);
  };

  const handleDeleteEvent = (id) => {
    deleteEvent(currentDate, id);
  };

  return (
    <div id="time-block-grid" className="w-2/3 h-full overflow-auto">
      <ResourceSchedular
        events={events}
        resources={RESOURCES}
        currentDate={currentDate}
        onDateChange={setCurrentDate}
        onAddEvent={handleAddEvent}
        onUpdateEvent={handleUpdateEvent}
        onDeleteEvent={handleDeleteEvent}
      />
    </div>
  );
}

function MainContent() {
  return (
    <main className="flex-1 flex w-full max-w-[1500px] mx-auto min-h-0 overflow-hidden">
      <CollectionPage />
      <TimeBlockGrid />
    </main>
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
      <MainContent />
      <Footer />
    </div>
  );
}

export default HomePage;
