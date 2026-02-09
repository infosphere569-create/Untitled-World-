import { useEffect } from "react";
import { useRoute, Link } from "wouter";
import { useTests } from "@/context/TestContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { Trophy, Clock, Target, AlertTriangle } from "lucide-react";
import confetti from "canvas-confetti";

export default function Analysis() {
  const [match, params] = useRoute("/test/:id/analysis");
  const { tests, results } = useTests();
  
  const testId = params?.id;
  const test = tests.find(t => t.id === testId);
  const result = results.find(r => r.testId === testId);

  useEffect(() => {
    if (result) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [result]);

  if (!test || !result) return (
    <div className="container mx-auto px-4 py-12 text-center">
      <h2 className="text-2xl font-bold mb-4">No Result Found</h2>
      <p className="text-muted-foreground mb-6">It seems you haven't taken this test yet.</p>
      <Link href="/tests"><Button>Go to Tests</Button></Link>
    </div>
  );

  const pieData = [
    { name: "Correct", value: result.correct, color: "#22c55e" },
    { name: "Wrong", value: result.wrong, color: "#ef4444" },
    { name: "Unattempted", value: result.unattempted, color: "#94a3b8" },
  ];

  const subjectData = Object.entries(result.subjectAnalysis).map(([subject, stats]) => ({
    name: subject,
    score: stats.correct * 4, // Assuming +4 per question
    total: stats.total * 4
  }));

  const accuracy = result.correct + result.wrong > 0 
    ? Math.round((result.correct / (result.correct + result.wrong)) * 100) 
    : 0;

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
         <div>
           <h1 className="text-3xl font-bold font-heading text-slate-900">Performance Analysis</h1>
           <p className="text-muted-foreground">Result for <span className="font-semibold text-foreground">{test.title}</span></p>
         </div>
         <Link href="/tests">
           <Button variant="outline">Back to Tests</Button>
         </Link>
       </div>

       {/* Score Overview Cards */}
       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
         <Card className="bg-gradient-to-br from-indigo-50 to-white border-indigo-100">
           <CardContent className="p-6">
             <div className="flex items-center gap-3 mb-2">
               <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                 <Trophy className="h-5 w-5" />
               </div>
               <span className="text-sm font-medium text-slate-500 uppercase tracking-wide">Score</span>
             </div>
             <div className="text-3xl font-bold text-slate-900">
               {result.score} <span className="text-sm font-normal text-slate-400">/ {test.questionsCount * 4}</span>
             </div>
           </CardContent>
         </Card>

         <Card className="bg-gradient-to-br from-emerald-50 to-white border-emerald-100">
           <CardContent className="p-6">
             <div className="flex items-center gap-3 mb-2">
               <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                 <Target className="h-5 w-5" />
               </div>
               <span className="text-sm font-medium text-slate-500 uppercase tracking-wide">Accuracy</span>
             </div>
             <div className="text-3xl font-bold text-slate-900">{accuracy}%</div>
           </CardContent>
         </Card>

         <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-100">
           <CardContent className="p-6">
             <div className="flex items-center gap-3 mb-2">
               <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                 <Clock className="h-5 w-5" />
               </div>
               <span className="text-sm font-medium text-slate-500 uppercase tracking-wide">Time Taken</span>
             </div>
             <div className="text-3xl font-bold text-slate-900">{Math.round(result.timeTaken / 60)} <span className="text-sm font-normal text-slate-400">min</span></div>
           </CardContent>
         </Card>

         <Card className="bg-gradient-to-br from-orange-50 to-white border-orange-100">
           <CardContent className="p-6">
             <div className="flex items-center gap-3 mb-2">
               <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                 <AlertTriangle className="h-5 w-5" />
               </div>
               <span className="text-sm font-medium text-slate-500 uppercase tracking-wide">Mistakes</span>
             </div>
             <div className="text-3xl font-bold text-slate-900">{result.wrong}</div>
           </CardContent>
         </Card>
       </div>

       <div className="grid md:grid-cols-2 gap-8 mb-8">
         {/* Question Distribution Chart */}
         <Card>
           <CardHeader>
             <CardTitle>Attempt Distribution</CardTitle>
           </CardHeader>
           <CardContent className="h-[300px]">
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie
                   data={pieData}
                   cx="50%"
                   cy="50%"
                   innerRadius={60}
                   outerRadius={80}
                   paddingAngle={5}
                   dataKey="value"
                 >
                   {pieData.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={entry.color} />
                   ))}
                 </Pie>
                 <Tooltip />
                 <Legend verticalAlign="bottom" height={36}/>
               </PieChart>
             </ResponsiveContainer>
           </CardContent>
         </Card>

         {/* Subject Wise Performance */}
         <Card>
           <CardHeader>
             <CardTitle>Subject-wise Score</CardTitle>
           </CardHeader>
           <CardContent className="h-[300px]">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={subjectData}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} />
                 <XAxis dataKey="name" axisLine={false} tickLine={false} />
                 <YAxis axisLine={false} tickLine={false} />
                 <Tooltip cursor={{fill: '#f1f5f9'}} />
                 <Bar dataKey="score" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
               </BarChart>
             </ResponsiveContainer>
           </CardContent>
         </Card>
       </div>

       {/* Detailed Question Analysis */}
       <Card>
         <CardHeader>
           <CardTitle>Question Analysis</CardTitle>
           <CardDescription>Detailed review of solutions and explanations.</CardDescription>
         </CardHeader>
         <CardContent>
           <div className="space-y-6">
             {test.questions.map((q, idx) => (
               <div key={q.id} className="border-b last:border-0 pb-6 last:pb-0">
                 <div className="flex items-start justify-between mb-2">
                   <div className="flex gap-3">
                     <span className="font-bold text-slate-500">Q{idx + 1}.</span>
                     <p className="font-medium text-slate-800">{q.text}</p>
                   </div>
                   <Badge variant={q.subject === "Physics" ? "default" : "secondary"}>{q.subject}</Badge>
                 </div>
                 
                 <div className="ml-8 mt-2 space-y-2">
                   {q.options.map((opt, optIdx) => (
                     <div key={optIdx} className={`p-2 rounded border text-sm flex justify-between ${
                       optIdx === q.correctOption 
                         ? "bg-green-50 border-green-200 text-green-800"
                         : "bg-slate-50 border-slate-100 text-slate-600"
                     }`}>
                       <span>{opt}</span>
                       {optIdx === q.correctOption && <span className="font-bold text-green-600 text-xs uppercase">Correct Answer</span>}
                     </div>
                   ))}
                   
                   {q.explanation && (
                     <div className="mt-4 bg-blue-50 p-4 rounded-lg text-sm text-blue-800">
                       <span className="font-bold block mb-1">Explanation:</span>
                       {q.explanation}
                     </div>
                   )}
                 </div>
               </div>
             ))}
           </div>
         </CardContent>
       </Card>
    </div>
  );
}
