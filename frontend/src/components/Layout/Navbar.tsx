import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/logo-minilegion.png";

const navItems = [
  { name: "Home", path: "/", icon: "🏠" },
  { name: "Guides", path: "/guides", icon: "📚" },
  { name: "Builds", path: "/builds", icon: "⚔️" },
  { name: "Collections", path: "/collections", icon: "🎒" },
  { name: "Raids", path: "/raids", icon: "🐉" },
  { name: "Roadmap", path: "/roadmap", icon: "🗺️" },
  { name: "Codes", path: "/codes", icon: "🎁" },
  { name: "Creators", path: "/creators", icon: "🎬" },
];

const creditLink = "https://x.com/Vegetarox";
const creditName = "Vegetarox";

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-md border-b border-amber-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-slate-800 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:shadow-amber-500/40 transition-all duration-300 group-hover:scale-105 overflow-hidden border border-amber-500/20">
                <img src={logo} alt="Mini Legion Logo" className="w-full h-full object-contain" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg lg:text-xl font-bold bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent">
                  Mini Legion
                </h1>
                <p className="text-xs text-slate-400 -mt-1">Game Guide</p>
              </div>
            </Link>

            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                    isActive(item.path)
                      ? "bg-amber-500/20 text-amber-400 shadow-lg shadow-amber-500/10"
                      : "text-slate-300 hover:text-amber-400 hover:bg-slate-700/50"
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </div>

            <div className="hidden md:flex items-center">
              <span className="text-slate-400 text-sm">
                Made by:{" "}
                <a href={creditLink} target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:text-amber-300 font-medium transition-colors hover:underline">
                  {creditName}
                </a>
              </span>
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-amber-400 hover:border-amber-500/50 transition-all"
              aria-label="Toggle navigation"
            >
              {isMobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? "max-h-[720px] opacity-100" : "max-h-0 opacity-0"}`}>
          <div className="px-4 py-4 bg-slate-900/95 border-t border-slate-700/50">
            <div className="mb-4 text-center">
              <span className="text-slate-400 text-sm">
                Made by:{" "}
                <a href={creditLink} target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:text-amber-300 font-medium transition-colors hover:underline">
                  {creditName}
                </a>
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-3 ${
                    isActive(item.path)
                      ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                      : "text-slate-300 bg-slate-800/50 border border-slate-700/50 hover:text-amber-400 hover:border-amber-500/30"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <div className="h-16 lg:h-20" />
    </>
  );
};
