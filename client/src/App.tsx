import { lazy, Suspense } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";

const Home = lazy(() => import("@/pages/home"));
const Analysis = lazy(() => import("@/pages/analysis"));
const GrowthStrategies = lazy(() => import("@/pages/growth-strategies"));
const VideoAnalyzer = lazy(() => import("@/pages/video-analyzer"));
const VideoComparison = lazy(() => import("@/pages/video-comparison"));
const LiveStreamAnalyzer = lazy(() => import("@/pages/livestream-analyzer"));
const CompetitorDashboard = lazy(() => import("@/pages/competitor-dashboard"));
const TrendRadar = lazy(() => import("@/pages/trend-radar"));
const AnalyticsHistory = lazy(() => import("@/pages/analytics-history"));
const ContentCalendar = lazy(() => import("@/pages/content-calendar"));
const CollabFinder = lazy(() => import("@/pages/collab-finder"));
const ExportReports = lazy(() => import("@/pages/export-reports"));
const AIDiscussion = lazy(() => import("@/pages/ai-discussion"));
const Glossary = lazy(() => import("@/pages/glossary"));
const Terms = lazy(() => import("@/pages/terms"));
const Privacy = lazy(() => import("@/pages/privacy"));
const NotFound = lazy(() => import("@/pages/not-found"));

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

const LazyRoute = ({ component: Component, ...props }: any) => (
  <Suspense fallback={<LoadingFallback />}>
    <Component {...props} />
  </Suspense>
);

function Router() {
  return (
    <Switch>
      <Route path="/">{() => <LazyRoute component={Home} />}</Route>
      <Route path="/analysis">{() => <LazyRoute component={Analysis} />}</Route>
      <Route path="/growth-strategies">{() => <LazyRoute component={GrowthStrategies} />}</Route>
      <Route path="/video-analyzer">{() => <LazyRoute component={VideoAnalyzer} />}</Route>
      <Route path="/video-comparison">{() => <LazyRoute component={VideoComparison} />}</Route>
      <Route path="/livestream-analyzer">{() => <LazyRoute component={LiveStreamAnalyzer} />}</Route>
      <Route path="/competitor-dashboard">{() => <LazyRoute component={CompetitorDashboard} />}</Route>
      <Route path="/trend-radar">{() => <LazyRoute component={TrendRadar} />}</Route>
      <Route path="/analytics-history">{() => <LazyRoute component={AnalyticsHistory} />}</Route>
      <Route path="/content-calendar">{() => <LazyRoute component={ContentCalendar} />}</Route>
      <Route path="/collab-finder">{() => <LazyRoute component={CollabFinder} />}</Route>
      <Route path="/export-reports">{() => <LazyRoute component={ExportReports} />}</Route>
      <Route path="/ai-discussion">{() => <LazyRoute component={AIDiscussion} />}</Route>
      <Route path="/glossary">{() => <LazyRoute component={Glossary} />}</Route>
      <Route path="/terms">{() => <LazyRoute component={Terms} />}</Route>
      <Route path="/privacy">{() => <LazyRoute component={Privacy} />}</Route>
      <Route>{() => <LazyRoute component={NotFound} />}</Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <div className="fixed top-4 right-4 z-50">
            <ThemeToggle />
          </div>
          <Router />
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
