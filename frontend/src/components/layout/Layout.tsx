import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { ChatbotPanel } from '../chatbot/ChatbotPanel';

export function Layout() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-slate-800">
      <Sidebar />
      <main className="flex-1 ml-64 p-8 relative">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
        <ChatbotPanel />
      </main>
    </div>
  );
}
