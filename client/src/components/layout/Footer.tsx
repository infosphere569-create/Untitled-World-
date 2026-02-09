import { Globe, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 font-heading font-bold text-xl text-primary">
              <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
                <Globe className="h-5 w-5" />
              </div>
              <span>Untitled World</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Empowering students with precise, exam-oriented mock tests. 
              Join thousands of aspirants achieving their dream scores.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-heading font-semibold mb-4 text-foreground">Platform</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/tests"><a className="hover:text-primary transition-colors">Mock Tests</a></Link></li>
              <li><Link href="/"><a className="hover:text-primary transition-colors">Previous Papers</a></Link></li>
              <li><Link href="/"><a className="hover:text-primary transition-colors">Analysis Tool</a></Link></li>
              <li><Link href="/"><a className="hover:text-primary transition-colors">Pricing</a></Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-semibold mb-4 text-foreground">Support</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/contact"><a className="hover:text-primary transition-colors">Contact Us</a></Link></li>
              <li><Link href="/"><a className="hover:text-primary transition-colors">FAQ</a></Link></li>
              <li><Link href="/"><a className="hover:text-primary transition-colors">Terms of Service</a></Link></li>
              <li><Link href="/"><a className="hover:text-primary transition-colors">Privacy Policy</a></Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-heading font-semibold mb-4 text-foreground">Contact</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <Mail className="h-4 w-4 mt-0.5 text-primary" />
                <span>untitledworld9@gmail.com</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 mt-0.5 text-primary" />
                <span>Education Hub, Tech Park<br/>Bangalore, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Untitled World. All rights reserved.</p>
          <div className="flex gap-4">
            <span>Made with ❤️ for students</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
