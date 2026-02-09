import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(password)) {
      toast({
        title: "Welcome back",
        description: "Successfully logged in as admin.",
      });
      setLocation("/admin");
    } else {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "Incorrect password. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
            <Lock className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-bold font-heading">Admin Access</CardTitle>
          <CardDescription>Enter your credentials to access the dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="text-center tracking-widest"
              />
              <p className="text-xs text-center text-muted-foreground">Hint: password is 'admin123'</p>
            </div>
            <Button type="submit" className="w-full" size="lg">
              Unlock Dashboard
            </Button>
            <Button 
              type="button" 
              variant="link" 
              className="w-full text-slate-500"
              onClick={() => setLocation("/")}
            >
              Return to Home
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
