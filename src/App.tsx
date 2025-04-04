
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Features from "./pages/Features";
import Pricing from "./pages/Pricing";
import Examples from "./pages/Examples";
import Login from "./pages/Login";
import SignUp from "./pages/auth/SignUp";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import MyAnimations from "./pages/MyAnimations";
import Stories from "./pages/Stories";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import StoryBuilder from "./pages/StoryBuilder";
import StoryReview from "./pages/StoryReview";
import AnimationProgress from "./pages/AnimationProgress";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/features" element={<Features />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/examples" element={<Examples />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/my-animations" element={<MyAnimations />} />
          <Route path="/stories" element={<Stories />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/build-story" element={<StoryBuilder />} />
          <Route path="/review-story" element={<StoryReview />} />
          <Route path="/generating" element={<AnimationProgress />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
