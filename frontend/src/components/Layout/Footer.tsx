import { Link } from 'react-router-dom';
import logo from '../../assets/logo-minilegion.png';
import discordIcon from '../../assets/discord.png';
import googlePlayIcon from '../../assets/Google-play.png';
import appStoreIcon from '../../assets/app-store.png';

export const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-slate-900 to-slate-950 border-t border-amber-500/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center shadow-lg shadow-amber-500/20 overflow-hidden border border-amber-500/20">
                <img src={logo} alt="Mini Legion Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <h3 className="text-lg font-bold bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
                  Mini Legion Guide
                </h3>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Your ultimate companion for mastering Mini Legion. Guides, builds, and strategies to help you conquer every challenge.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-amber-400 font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2">
              {['Home', 'Guides', 'Builds', 'Raids'].map((item) => (
                <li key={item}>
                  <Link
                    to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                    className="text-slate-400 hover:text-amber-400 text-sm transition-colors duration-200"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-amber-400 font-semibold mb-4 text-sm uppercase tracking-wider">Resources</h4>
            <ul className="space-y-2">
              {['Roadmap', 'Codes', 'Creators'].map((item) => (
                <li key={item}>
                  <Link
                    to={`/${item.toLowerCase().replace(' ', '-')}`}
                    className="text-slate-400 hover:text-amber-400 text-sm transition-colors duration-200"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="text-amber-400 font-semibold mb-4 text-sm uppercase tracking-wider">Community</h4>
            <div className="flex gap-3">
              {[
                { name: 'Discord', image: discordIcon, url: 'https://discord.com/invite/GQQwETguX5', color: 'hover:bg-indigo-500/20 hover:border-indigo-500/50', scale: 'scale-125' },
                { name: 'Website', icon: '🌐', url: 'https://mini-legion.stardustgamehk.com/', color: 'hover:bg-emerald-500/20 hover:border-emerald-500/50' },
                { name: 'Google Play', image: googlePlayIcon, url: 'https://play.google.com/store/apps/details?id=com.minilegionrise.gp', color: 'hover:bg-green-500/20 hover:border-green-500/50' },
                { name: 'App Store', image: appStoreIcon, url: 'https://apps.apple.com/us/app/mini-legion-warband/id6752990032', color: 'hover:bg-slate-500/20 hover:border-slate-500/50' },
              ].map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-lg transition-all duration-200 overflow-hidden p-2 ${social.color}`}
                  title={social.name}
                >
                  {social.image ? (
                    <img 
                      src={social.image} 
                      alt={social.name} 
                      className={`w-full h-full object-contain ${social.scale || ''}`} 
                    />
                  ) : (
                    social.icon
                  )}
                </a>
              ))}
            </div>
            <p className="text-slate-500 text-xs mt-4">
              Join our community for updates, discussions, and exclusive content.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm">
              © 2026 Mini Legion Guide. Community-powered and not affiliated with the official game.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-slate-500 hover:text-amber-400 text-sm transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-slate-500 hover:text-amber-400 text-sm transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};