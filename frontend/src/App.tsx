import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home, Guides, GuideDetail, Builds, BuildDetail, Collections, Raids, RaidDetail, Roadmap, Codes, ContentCreators } from './pages';
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
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
