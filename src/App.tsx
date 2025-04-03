
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Dashboard from './pages/Dashboard';
import Features from './pages/Features';
import Pricing from './pages/Pricing';
import Examples from './pages/Examples';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import StoryBuilder from './pages/StoryBuilder'; 
import StoryReview from './pages/StoryReview';
import AnimationProgress from './pages/AnimationProgress';
import { Toaster } from './components/ui/sonner';
import './App.css';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/features" element={<Features />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/examples" element={<Examples />} />
          <Route path="/login" element={<Login />} />
          <Route path="/build-story" element={<StoryBuilder />} />
          <Route path="/review-story" element={<StoryReview />} />
          <Route path="/generating" element={<AnimationProgress />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <Toaster position="top-right" />
    </>
  );
}

export default App;
