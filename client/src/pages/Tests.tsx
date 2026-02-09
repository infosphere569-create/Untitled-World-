import { useTests } from "@/context/TestContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, HelpCircle, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";

export default function Tests() {
  const { tests } = useTests();

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-slate-900 mb-2">Available Mock Tests</h1>
          <p className="text-muted-foreground">Select a test to start practicing immediately.</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline">Filter by Exam</Button>
           <Button variant="outline">Sort by Newest</Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tests.map((test, i) => (
          <motion.div
            key={test.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="h-full flex flex-col hover:border-primary/50 transition-colors group cursor-pointer">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant={test.price === "Free" ? "secondary" : "default"} className={test.price === "Free" ? "bg-green-100 text-green-700 hover:bg-green-200" : ""}>
                    {test.price === "Free" ? "Free" : `₹${test.price}`}
                  </Badge>
                  <Badge variant="outline" className="text-xs uppercase tracking-wider">{test.subject}</Badge>
                </div>
                <CardTitle className="font-heading text-xl group-hover:text-primary transition-colors">{test.title}</CardTitle>
                <div className="flex flex-wrap gap-2 mt-2">
                  {test.tags.map(tag => (
                    <span key={tag} className="text-xs text-muted-foreground bg-slate-100 px-2 py-0.5 rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="flex items-center gap-6 text-sm text-slate-600 mt-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary/70" />
                    <span>{test.duration} mins</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <HelpCircle className="h-4 w-4 text-primary/70" />
                    <span>{test.questions.length} Qs</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Link href={`/test/${test.id}/take`} className="w-full">
                  <Button className="w-full group-hover:translate-y-[-2px] transition-transform">
                    Start Test <FileText className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>

      {tests.length === 0 && (
        <div className="text-center py-20 bg-slate-50 rounded-xl border border-dashed border-slate-300">
          <p className="text-muted-foreground">No tests available at the moment. Check back later!</p>
        </div>
      )}
    </div>
  );
}
