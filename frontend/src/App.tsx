import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ProjectDetail from './pages/ProjectDetail';
import BlogDetail from './pages/BlogDetail';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AddBlog from './pages/AddBlog';
import CollectionsHub from './pages/CollectionsHub';
import CollectionManager from './pages/CollectionManager';
import Playground from './pages/Playground';
import JobHunter from './pages/JobHunter';
import ResumeGenerator from './pages/ResumeGenerator';
import ProtectedRoute from './components/ProtectedRoute';

import SkillNexus from './pages/SkillNexus';
import ApplicationTracker from './pages/ApplicationTracker';
import ApplicationDetails from './pages/ApplicationDetails';

function App() {
  return (
    <div className="bg-[#121212] min-h-screen text-white selection:bg-purple-500 selection:text-white">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/work/:slug" element={<ProjectDetail />} />
          <Route path="/blogs/:slug" element={<BlogDetail />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/blogs/new" element={<AddBlog />} />
            <Route path="/collections" element={<CollectionsHub />} />
            <Route path="/collections/:collectionName" element={<CollectionManager />} />
            <Route path="/playground" element={<Playground />} />
            <Route path="/hunter" element={<JobHunter />} />
            <Route path="/tracker" element={<ApplicationTracker />} />
            <Route path="/tracker/:id" element={<ApplicationDetails />} />
            <Route path="/nexus" element={<SkillNexus />} />
            <Route path="/resume" element={<ResumeGenerator />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
