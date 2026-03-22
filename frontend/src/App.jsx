import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatPage from './pages/ChatPage';
import CheckinPage from './pages/CheckinPage';
import DashboardPage from './pages/DashboardPage';
import PomodoroPage from './pages/PomodoroPage';

const PAGES = {
  chat: ChatPage,
  checkin: CheckinPage,
  dashboard: DashboardPage,
  pomodoro: PomodoroPage,
};

export default function App() {
  const [activePage, setActivePage] = useState('chat');
  const Page = PAGES[activePage] || ChatPage;

  return (
    <div className="flex min-h-screen bg-slate-950 font-body">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      <main className="ml-64 flex-1 min-h-screen overflow-auto">
        <Page />
      </main>
    </div>
  );
}
