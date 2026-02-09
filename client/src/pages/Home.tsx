import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { ArrowRight, BookOpen, Target, TrendingUp, CheckCircle2 } from "lucide-react";
import heroBg from "../assets/hero-bg.png"; // We'll assume this imports correctly after we generated it

export default function Home() {
  const features = [
    {
      icon: <Target className="h-6 w-6 text-primary" />,
      title: "Exam-Like Environment",
      description: "Practice in an interface that exactly mimics the real exam."
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-primary" />,
      title: "Detailed Analysis",
      description: "Get question-wise analysis to identify your weak areas."
    },
    {
      icon: <BookOpen className="h-6 w-6 text-primary" />,
      title: "Curated Questions",
      description: "Questions handpicked by experts to match current trends."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background pt-16 pb-32 md:pt-32 md:pb-48">
        <div className="absolute inset-0 -z-10 opacity-20">
          <img src={heroBg} alt="Background" className="w-full h-full object-cover" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge className="mb-6 bg-primary/10 text-primary hover:bg-primary/20 transition-colors border-none px-4 py-1.5 text-sm font-medium">
                New: JEE Mains 2026 Series Live
              </Badge>
              <h1 className="text-4xl md:text-7xl font-bold font-heading tracking-tight text-slate-900 mb-6 leading-[1.1]">
                Master Your Exams with <span className="text-primary">Untitled World</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-2xl leading-relaxed">
                The most authentic mock test platform designed to boost your score. 
                Practice with precision, analyze with depth, and succeed with confidence.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/tests">
                  <Button size="lg" className="h-12 px-8 text-base shadow-lg shadow-primary/20 transition-all hover:scale-105">
                    Start Practicing Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" size="lg" className="h-12 px-8 text-base bg-white/50 backdrop-blur-sm border-slate-300">
                    Talk to an Expert
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold font-heading mb-4">Why Choose Untitled World?</h2>
            <p className="text-muted-foreground">We focus on what matters most - providing you with the most relevant practice material.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="border-none shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300">
                  <CardContent className="pt-6">
                    <div className="mb-4 bg-primary/5 w-12 h-12 rounded-xl flex items-center justify-center">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold font-heading mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10">
          <Target className="w-64 h-64" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-3xl md:text-5xl font-bold font-heading mb-6">Ready to boost your score?</h2>
          <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of students who have already started their journey with Untitled World.
          </p>
          <Link href="/tests">
            <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 hover:scale-105 transition-all h-14 px-8 text-lg font-semibold">
              View All Mock Tests
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
