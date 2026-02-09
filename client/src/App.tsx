import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TestProvider } from "@/context/TestContext";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import NotFound from "@/pages/not-found";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Home from "@/pages/Home";
import Tests from "@/pages/Tests";
import Admin from "@/pages/Admin";
import Contact from "@/pages/Contact";
import TestTaking from "@/pages/TestTaking";
import Analysis from "@/pages/Analysis";
import Login from "@/pages/Login";

// Protected Route Component
function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { isAdmin } = useAuth();
  
  if (!isAdmin) {
    return <Redirect to="/login" />;
  }
  
  return <Component />;
}

function Router() {
  const { isAdmin } = useAuth();

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/tests" component={Tests} />
      <Route path="/contact" component={Contact} />
      <Route path="/login">
        {isAdmin ? <Redirect to="/admin" /> : <Login />}
      </Route>
      
      {/* Protected Routes */}
      <Route path="/admin">
        <ProtectedRoute component={Admin} />
      </Route>

      <Route path="/test/:id/take" component={TestTaking} />
      <Route path="/test/:id/analysis" component={Analysis} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TestProvider>
          <TooltipProvider>
            <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900">
              {/* Only show Navbar/Footer on non-login pages or handle logic inside components */}
              {/* We want Navbar everywhere except maybe simple login page, but let's keep it for now or conditionally render. 
                  Actually, Login page has its own layout, so we might want to check route inside App or just let Navbar exist. 
                  Let's check the Router structure. Navbar is outside Router.
                  Ideally, Login page shouldn't have the main navbar/footer for a cleaner look.
              */}
              <LayoutWrapper />
            </div>
            <Toaster />
          </TooltipProvider>
        </TestProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

// Wrapper to conditionally render layout based on route
// Since wouter useLocation works anywhere inside, we can use it here.
import { useLocation } from "wouter";

function LayoutWrapper() {
  const [location] = useLocation();
  const isLoginPage = location === "/login";
  const isTestTakingPage = location.includes("/take"); 

  return (
    <>
      {!isLoginPage && !isTestTakingPage && <Navbar />}
      <main className="flex-grow">
        <Router />
      </main>
      {!isLoginPage && !isTestTakingPage && <Footer />}
    </>
  );
}

export default App;
