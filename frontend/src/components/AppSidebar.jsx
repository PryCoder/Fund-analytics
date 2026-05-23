// AppSidebar.jsx
'use client';

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  TrendingUp,
  BarChart3,
  Sparkles,
  Menu,
  X,
  Bookmark,
} from 'lucide-react';

const AppSidebar = ({ children }) => {
  const location = useLocation();
  const [open, setOpen] = React.useState(false);

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/watchlist', label: 'Watchlist', icon: Bookmark },
  ];

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex min-h-screen bg-[#0a0c10] text-white">
      
      {/* MOBILE OVERLAY */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed left-0 top-0 z-50 flex h-screen w-[280px]
          flex-col border-r border-white/10
          bg-[#0a0c10]/95 backdrop-blur-xl
          transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${open ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* HEADER */}
        <div className="border-b border-white/10 px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/15">
              <TrendingUp className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <h2 className="text-sm font-semibold tracking-tight text-white">
                Aureva Fund
              </h2>
              <p className="text-[11px] text-gray-500">
                Mutual Fund Analytics
              </p>
            </div>
          </div>
        </div>

        {/* NAVIGATION */}
        <div className="flex-1 overflow-y-auto px-3 py-6">
          <div className="mb-4 px-3">
            <p className="text-[10px] font-medium uppercase tracking-wider text-gray-500">
              Menu
            </p>
          </div>

          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setOpen(false)}
                  className={`
                    flex items-center gap-3 rounded-lg px-3 py-2.5
                    text-sm font-medium transition-all duration-200
                    ${active 
                      ? 'bg-purple-500/15 text-purple-400' 
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    }
                  `}
                >
                  <Icon className={`h-4 w-4 ${active ? 'text-purple-400' : ''}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* ANALYTICS CARD */}
          <div className="mt-8 mx-3 rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/15">
              <BarChart3 className="h-5 w-5 text-purple-400" />
            </div>
            <h3 className="text-sm font-medium text-white">
              NAV Analytics
            </h3>
            <p className="mt-1.5 text-xs leading-relaxed text-gray-500">
              Track mutual fund performance with interactive analytics
            </p>
          </div>
        </div>

        {/* FOOTER */}
        <div className="border-t border-white/10 p-4">
          <div className="flex items-center gap-3 rounded-lg bg-white/5 px-3 py-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/15">
              <Sparkles className="h-3.5 w-3.5 text-purple-400" />
            </div>
            <div>
              <p className="text-[10px] text-gray-500">Powered by</p>
              <p className="text-xs font-medium text-white">MFAPI</p>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN SECTION */}
      <div className="flex min-h-screen flex-1 flex-col lg:ml-[280px]">
        
        {/* TOPBAR */}
        <header className="sticky top-0 z-30 flex h-14 items-center border-b border-white/10 bg-[#0a0c10]/80 px-4 backdrop-blur-md">
          
          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setOpen(!open)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 transition hover:bg-white/10 lg:hidden"
          >
            {open ? (
              <X className="h-4 w-4 text-gray-400" />
            ) : (
              <Menu className="h-4 w-4 text-gray-400" />
            )}
          </button>

          {/* PAGE TITLE - Dynamic based on route */}
          <div className="ml-3 lg:ml-0">
            <h1 className="text-sm font-medium text-gray-300">
              {location.pathname === '/' ? 'Dashboard' : 'Watchlist'}
            </h1>
            <p className="text-[10px] text-gray-500">
              {location.pathname === '/' 
                ? 'Discover and track mutual funds' 
                : 'Manage your tracked funds'}
            </p>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppSidebar;