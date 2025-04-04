import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthGuard from "@/components/AuthGuard";
import Index from "./pages/Index";
import Features from "./pages/Features";
import Pricing from "./pages/Pricing";
import Examples from "./pages/Examples";
import Login from "./pages/Login";
import SignUp from "./pages/auth/SignUp";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import StoryBuilder from "./pages/StoryBuilder";
import StoryReview from "./pages/StoryReview";
import AnimationProgress from "./pages/AnimationProgress";
import Settings from "./pages/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<AuthGuard requireAuth={false}><Index /></AuthGuard>} />
          <Route path="/features" element={<AuthGuard requireAuth={false}><Features /></AuthGuard>} />
          <Route path="/pricing" element={<AuthGuard requireAuth={false}><Pricing /></AuthGuard>} />
          <Route path="/examples" element={<AuthGuard requireAuth={false}><Examples /></AuthGuard>} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<AuthGuard requireAuth={false}><Login /></AuthGuard>} />
          <Route path="/signup" element={<AuthGuard requireAuth={false}><SignUp /></AuthGuard>} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={<AuthGuard requireAuth={true}><Dashboard /></AuthGuard>} />
          <Route path="/build-story" element={<AuthGuard requireAuth={true}><StoryBuilder /></AuthGuard>} />
          <Route path="/review-story" element={<AuthGuard requireAuth={true}><StoryReview /></AuthGuard>} />
          <Route path="/generating" element={<AuthGuard requireAuth={true}><AnimationProgress /></AuthGuard>} />
          <Route path="/settings" element={<AuthGuard requireAuth={true}><Settings /></AuthGuard>} />
          
          {/* Catch-all Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;