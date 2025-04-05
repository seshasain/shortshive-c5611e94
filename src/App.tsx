import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/lib/theme";
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
import SavedStories from "./pages/SavedStories";
import MyAnimations from "./pages/MyAnimations";
import AnimationViewer from "./pages/AnimationViewer";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="ui-theme">
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
            <Route path="/saved-stories" element={<AuthGuard requireAuth={true}><SavedStories /></AuthGuard>} />
            <Route path="/my-animations" element={<AuthGuard requireAuth={true}><MyAnimations /></AuthGuard>} />
            <Route path="/build-story" element={<AuthGuard requireAuth={true}><StoryBuilder /></AuthGuard>} />
            <Route path="/review-story" element={<AuthGuard requireAuth={true}><StoryReview /></AuthGuard>} />
            <Route path="/review-story/:id" element={<AuthGuard requireAuth={true}><StoryReview /></AuthGuard>} />
            <Route path="/generating" element={<AuthGuard requireAuth={true}><AnimationProgress /></AuthGuard>} />
            <Route path="/settings" element={<AuthGuard requireAuth={true}><Settings /></AuthGuard>} />
            <Route path="/story/:id" element={<AuthGuard requireAuth={true}><AnimationViewer /></AuthGuard>} />
            
            {/* Catch-all Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;