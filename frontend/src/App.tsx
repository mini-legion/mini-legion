import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home, Guides, GuideDetail, Builds, BuildDetail, BuildSubmit, Ranking, Collections, Raids, RaidDetail, Roadmap, Codes, ContentCreators, DruidHub } from './pages';
import { AdminPanel } from './pages/AdminPanel';
import { AuthPage } from './pages/AuthPage';
import { AccountPage } from './pages/AccountPage';
import { AuthProvider } from './lib/auth';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="guides" element={<Guides />} />
            <Route path="guides/:subcategory" element={<Guides />} />
            <Route path="guides/detail/:guideId" element={<GuideDetail />} />
            <Route path="builds" element={<Builds />} />
            <Route path="builds/submit" element={<BuildSubmit />} />
            <Route path="builds/:subcategory" element={<Builds />} />
            <Route path="builds/detail/:buildId" element={<BuildDetail />} />
            <Route path="ranking" element={<Ranking />} />
            <Route path="admin" element={<AdminPanel />} />
            <Route path="login" element={<AuthPage />} />
            <Route path="account" element={<AccountPage />} />
            <Route path="collections" element={<Collections />} />
            <Route path="raids" element={<Raids />} />
            <Route path="raids/:subcategory" element={<Raids />} />
            <Route path="raids/detail/:raidId" element={<RaidDetail />} />
            <Route path="roadmap" element={<Roadmap />} />
            <Route path="codes" element={<Codes />} />
            <Route path="creators" element={<ContentCreators />} />
            <Route path="druid" element={<DruidHub />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
