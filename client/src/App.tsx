import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TestProvider } from "@/context/TestContext";
import NotFound from "@/pages/not-found";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Home from "@/pages/Home";
import Tests from "@/pages/Tests";
import Admin from "@/pages/Admin";
import Contact from "@/pages/Contact";
import TestTaking from "@/pages/TestTaking";
import Analysis from "@/pages/Analysis";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/tests" component={Tests} />
      <Route path="/admin" component={Admin} />
      <Route path="/contact" component={Contact} />
      {/* New Routes */}
      <Route path="/test/:id/take" component={TestTaking} />
      <Route path="/test/:id/analysis" component={Analysis} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TestProvider>
        <TooltipProvider>
          <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900">
            <Navbar />
            <main className="flex-grow">
              <Router />
            </main>
            <Footer />
          </div>
          <Toaster />
        </TooltipProvider>
      </TestProvider>
    </QueryClientProvider>
  );
}

export default App;
