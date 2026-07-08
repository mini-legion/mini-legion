import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Guides } from './pages/Guides';
import { GuideDetail } from './pages/GuideDetail';
import { Builds } from './pages/Builds';
import { BuildDetail } from './pages/BuildDetail';
import { Collections } from './pages/Collections';
import { Raids } from './pages/Raids';
import { RaidDetail } from './pages/RaidDetail';
import { Roadmap } from './pages/Roadmap';
import { Codes } from './pages/Codes';
import { ContentCreators } from './pages/ContentCreators';
import { PublicUnavailable } from './components/Layout/PublicUnavailable';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="guides" element={<Guides />} />
          <Route path="guides/:subcategory" element={<Guides />} />
          <Route path="guides/detail/:guideId" element={<GuideDetail />} />
          <Route path="builds" element={<Builds />} />
          <Route path="builds/:subcategory" element={<Builds />} />
          <Route path="builds/detail/:buildId" element={<BuildDetail />} />
          <Route path="collections" element={<Collections />} />
          <Route path="raids" element={<Raids />} />
          <Route path="raids/:subcategory" element={<Raids />} />
          <Route path="raids/detail/:raidId" element={<RaidDetail />} />
          <Route path="roadmap" element={<Roadmap />} />
          <Route path="codes" element={<Codes />} />
          <Route path="creators" element={<ContentCreators />} />
          <Route path="login" element={<PublicUnavailable />} />
          <Route path="account" element={<PublicUnavailable />} />
          <Route path="admin" element={<PublicUnavailable />} />
          <Route path="builds/submit" element={<PublicUnavailable />} />
          <Route path="ranking" element={<PublicUnavailable />} />
          <Route path="druid" element={<PublicUnavailable />} />
          <Route path="*" element={<PublicUnavailable />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
