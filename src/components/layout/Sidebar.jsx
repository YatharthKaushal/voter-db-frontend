import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  LogOut, 
  Menu, 
  X,
  ChevronRight,
  Vote,
  Shield,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    description: 'Overview & Analytics'
  },
  {
    name: 'Voters',
    href: '/voters',
    icon: Users,
    description: 'Manage Voter Database'
  },
];

const Sidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const SidebarContent = ({ isMobile = false }) => (
    <div className="flex h-full flex-col relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-green-50 to-transparent rounded-full opacity-30 -translate-y-8 translate-x-8"></div>
      <div className="absolute bottom-20 left-0 w-24 h-24 bg-gradient-to-tr from-emerald-50 to-transparent rounded-full opacity-40 -translate-x-6"></div>
      
      {/* Logo/Brand */}
      <div className="relative flex h-16 items-center justify-between border-b border-gray-100 px-4 bg-gradient-to-r from-white to-gray-50/50">
        <div className="flex items-center group">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-600 to-emerald-600 shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:scale-105">
            <Vote className="h-5 w-5 text-white transition-transform duration-300 group-hover:rotate-12" />
            <div className="absolute -top-1 -right-1 h-3 w-3 bg-emerald-400 rounded-full border-2 border-white animate-pulse"></div>
          </div>
          {(isExpanded || isMobile) && (
            <div className="ml-3 transition-all duration-300">
              <div className="flex items-center space-x-1">
                <span className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  VoterDB
                </span>
                <Sparkles className="h-4 w-4 text-green-500 animate-pulse" />
              </div>
              <p className="text-xs text-gray-500 font-medium">Management System</p>
            </div>
          )}
        </div>
        {isMobile && (
          <button
            onClick={() => setIsMobileOpen(false)}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200 hover:scale-110"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 px-3 py-6 relative">
        {navigation.map((item, index) => {
          const isActive = location.pathname === item.href;
          const Icon = item.icon;
          
          return (
            <div key={item.name} className="relative group">
              <Link
                to={item.href}
                onClick={() => isMobile && setIsMobileOpen(false)}
                className={`relative flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-sm ${
                  isActive 
                    ? (isExpanded || isMobile) 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg hover:shadow-xl' 
                      : 'bg-green-50 text-green-700 border-2 border-green-200 shadow-sm'
                    : 'text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-green-50 hover:text-green-700'
                }`}
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                {/* Active indicator for expanded state */}
                {isActive && (isExpanded || isMobile) && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full shadow-sm"></div>
                )}
                
                {/* Active indicator for collapsed state */}
                {isActive && !isExpanded && !isMobile && (
                  <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-6 bg-green-500 rounded-r-full shadow-sm"></div>
                )}
                
                <div className={`relative flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-300 ${
                  isActive 
                    ? (isExpanded || isMobile) 
                      ? 'bg-white/20' 
                      : 'bg-green-100' 
                    : 'group-hover:bg-green-100'
                }`}>
                  <Icon className={`h-5 w-5 transition-all duration-300 ${
                    isActive 
                      ? (isExpanded || isMobile) 
                        ? 'text-white' 
                        : 'text-green-600' 
                      : 'text-gray-600 group-hover:text-green-600'
                  }`} />
                </div>
                
                {(isExpanded || isMobile) && (
                  <div className="ml-3 flex-1 min-w-0 transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div className="text-left">
                        <p className="font-semibold truncate">{item.name}</p>
                        <p className={`text-xs opacity-75 truncate ${
                          isActive ? 'text-white/80' : 'text-gray-500'
                        }`}>
                          {item.description}
                        </p>
                      </div>
                      {isActive && (
                        <ChevronRight className="h-4 w-4 text-white/80 animate-pulse" />
                      )}
                    </div>
                  </div>
                )}
                
                {/* Hover tooltip for collapsed state */}
                {!isExpanded && !isMobile && (
                  <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-200 whitespace-nowrap z-50 shadow-xl">
                    <div className="flex flex-col">
                      <span className="font-medium">{item.name}</span>
                      <span className="text-xs text-gray-300">{item.description}</span>
                    </div>
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
                  </div>
                )}
                
                {/* Ripple effect */}
                <div className="absolute inset-0 overflow-hidden rounded-xl">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                </div>
              </Link>
            </div>
          );
        })}
      </nav>

      {/* Admin info section */}
      {(isExpanded || isMobile) && (
        <div className="px-3 py-4 border-t border-gray-100 bg-gradient-to-r from-gray-50/50 to-green-50/30">
          <div className="flex items-center space-x-3 p-3 rounded-xl bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300">
            <div className="relative">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-sm">
                <Shield className="h-4 w-4 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-400 rounded-full border-2 border-white"></div>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900">Admin User</p>
              <p className="text-xs text-gray-500">System Administrator</p>
            </div>
          </div>
        </div>
      )}

      {/* Logout */}
      <div className="border-t border-gray-100 p-3 bg-gray-50/30">
        <button
          onClick={handleLogout}
          className="group relative flex w-full items-center px-3 py-3 text-sm font-medium text-gray-700 rounded-xl transition-all duration-300 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-700 hover:scale-[1.02] hover:shadow-sm"
        >
          <div className="relative flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-300 group-hover:bg-red-100">
            <LogOut className="h-5 w-5 transition-all duration-300 group-hover:text-red-600 group-hover:-translate-x-0.5" />
          </div>
          {(isExpanded || isMobile) && (
            <span className="ml-3 transition-all duration-300">Logout</span>
          )}
          
          {/* Hover tooltip for collapsed state */}
          {!isExpanded && !isMobile && (
            <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-200 whitespace-nowrap z-50 shadow-xl">
              Logout
              <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
            </div>
          )}
          
          {/* Ripple effect */}
          <div className="absolute inset-0 overflow-hidden rounded-xl">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-100/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          </div>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile menu button - Fixed position */}
      {!isMobileOpen && (
        <div className="lg:hidden">
          <button
            onClick={() => setIsMobileOpen(true)}
            className="fixed top-4 left-4 z-[60] rounded-xl bg-white/90 backdrop-blur-sm p-3 shadow-lg border border-gray-200/50 transition-all duration-300 hover:shadow-xl hover:scale-105 hover:bg-white"
          >
            <Menu className="h-5 w-5 text-gray-700" />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>
      )}


      {/* Mobile sidebar overlay */}
        <div className="fixed inset-0 z-[50] lg:hidden pointer-events-none">
          {/* Background overlay */}
          <div
            className={`absolute inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity duration-300 ${
              isMobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0'
            }`}
            onClick={() => setIsMobileOpen(false)}
          />

          {/* Sidebar panel with slide animation */}
          <div
           className={`absolute inset-y-0 left-0 w-72 bg-white/95 backdrop-blur-xl shadow-2xl border-r border-gray-200/50 
              transform transition-transform duration-300 ease-in-out
              ${isMobileOpen ? 'translate-x-0 pointer-events-auto' : '-translate-x-full pointer-events-none'}
            `}
          >
            <SidebarContent isMobile />
          </div>
        </div>


      {/* Desktop sidebar */}
      <div 
        className={`hidden lg:fixed lg:inset-y-0 lg:z-[40] lg:flex lg:flex-col bg-white/95 backdrop-blur-xl border-r border-gray-200/50 shadow-lg transition-all duration-300 ease-out ${
          isExpanded ? 'lg:w-72' : 'lg:w-20'
        }`}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        <SidebarContent />
      </div>

      {/* Spacer for main content */}
      <div className={`hidden lg:block transition-all duration-300 ${
        isExpanded ? 'lg:w-72' : 'lg:w-20'
      }`} />
    </>
  );
};

export default Sidebar;