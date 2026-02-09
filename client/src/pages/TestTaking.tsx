import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { useTests, Question } from "@/context/TestContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Clock, ChevronLeft, ChevronRight, Save, Flag, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";

export default function TestTaking() {
  const [match, params] = useRoute("/test/:id/take");
  const [, setLocation] = useLocation();
  const { tests, submitTest } = useTests();
  
  const testId = params?.id;
  const test = tests.find(t => t.id === testId);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<string, boolean>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);

  useEffect(() => {
    if (test) {
      setTimeLeft(test.duration * 60);
    }
  }, [test]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!test) return <div className="p-8">Test not found</div>;

  const currentQuestion = test.questions[currentQuestionIndex];

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (optionIndex: number) => {
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: optionIndex }));
  };

  const toggleReview = () => {
    setMarkedForReview(prev => ({
      ...prev,
      [currentQuestion.id]: !prev[currentQuestion.id]
    }));
  };

  const clearResponse = () => {
    const newAnswers = { ...answers };
    delete newAnswers[currentQuestion.id];
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    const timeTaken = (test.duration * 60) - timeLeft;
    submitTest(test.id, answers, timeTaken);
    setLocation(`/test/${test.id}/analysis`);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b px-6 py-3 flex justify-between items-center h-16 shadow-sm z-10">
        <div className="flex items-center gap-4">
          <h1 className="font-heading font-bold text-lg truncate max-w-md">{test.title}</h1>
          <Badge variant="outline" className="hidden sm:inline-flex">{test.subject}</Badge>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-slate-100 px-3 py-1.5 rounded-md flex items-center gap-2 font-mono font-medium text-slate-700">
            <Clock className="h-4 w-4 text-primary" />
            {formatTime(timeLeft)}
          </div>
          <Button onClick={() => setIsSubmitDialogOpen(true)} variant="default" className="bg-green-600 hover:bg-green-700">
            Submit Test
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Question Area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-2">
                 <span className="font-bold text-lg text-slate-500">Q.{currentQuestionIndex + 1}</span>
                 <Badge variant="secondary">{currentQuestion.type}</Badge>
                 <Badge variant="outline" className="text-slate-500">{currentQuestion.subject}</Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <span className="text-green-600 font-medium">+4</span>
                <span className="text-red-500 font-medium">-1</span>
              </div>
            </div>

            <Card className="mb-8 border-none shadow-md">
              <CardContent className="p-6 md:p-8">
                <p className="text-lg font-medium leading-relaxed mb-8">{currentQuestion.text}</p>
                
                <RadioGroup 
                  value={answers[currentQuestion.id]?.toString()} 
                  onValueChange={(val) => handleAnswer(parseInt(val))}
                  className="space-y-4"
                >
                  {currentQuestion.options.map((option, idx) => (
                    <div key={idx} className={cn(
                      "flex items-center space-x-3 border rounded-lg p-4 transition-colors cursor-pointer hover:bg-slate-50",
                      answers[currentQuestion.id] === idx ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-slate-200"
                    )}>
                      <RadioGroupItem value={idx.toString()} id={`opt-${idx}`} />
                      <Label htmlFor={`opt-${idx}`} className="flex-1 cursor-pointer font-normal text-base">{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>

            <div className="flex flex-wrap gap-4 justify-between items-center">
              <div className="flex gap-2">
                <Button variant="outline" onClick={toggleReview} className={cn(markedForReview[currentQuestion.id] && "bg-yellow-50 border-yellow-200 text-yellow-700")}>
                   <Flag className="h-4 w-4 mr-2" />
                   {markedForReview[currentQuestion.id] ? "Marked for Review" : "Mark for Review"}
                </Button>
                <Button variant="ghost" onClick={clearResponse} className="text-slate-500">
                  Clear Response
                </Button>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                  disabled={currentQuestionIndex === 0}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                </Button>
                <Button 
                  onClick={() => setCurrentQuestionIndex(prev => Math.min(test.questions.length - 1, prev + 1))}
                  disabled={currentQuestionIndex === test.questions.length - 1}
                >
                  Save & Next <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        </main>

        {/* Sidebar Question Palette */}
        <aside className="w-80 bg-white border-l flex flex-col hidden lg:flex">
          <div className="p-4 border-b">
            <h3 className="font-heading font-semibold mb-4">Question Palette</h3>
            <div className="grid grid-cols-2 gap-2 text-xs mb-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-green-500 text-white flex items-center justify-center">1</div>
                <span>Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-red-500 text-white flex items-center justify-center">1</div>
                <span>Not Answered</span>
              </div>
               <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-slate-200 flex items-center justify-center">1</div>
                <span>Not Visited</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-yellow-500 text-white flex items-center justify-center">1</div>
                <span>Review</span>
              </div>
            </div>
          </div>

          <ScrollArea className="flex-1 p-4">
             <div className="grid grid-cols-5 gap-2">
               {test.questions.map((q, idx) => {
                 let statusClass = "bg-slate-200 hover:bg-slate-300"; // Not visited
                 if (markedForReview[q.id]) statusClass = "bg-yellow-500 text-white hover:bg-yellow-600";
                 else if (answers[q.id] !== undefined) statusClass = "bg-green-500 text-white hover:bg-green-600";
                 else if (currentQuestionIndex === idx) statusClass = "ring-2 ring-primary ring-offset-2 bg-slate-200"; // Current but not answered yet logic usually handled by "Not Answered" if visited. 
                 
                 // Simple visited logic simulation: If we are past it or have answered it or marked it.
                 // Ideally we track 'visited' state separately. For now, let's keep it simple.
                 
                 return (
                   <button
                    key={q.id}
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={cn(
                      "w-10 h-10 rounded-md flex items-center justify-center text-sm font-medium transition-all",
                      statusClass,
                      currentQuestionIndex === idx && "ring-2 ring-offset-2 ring-primary z-10"
                    )}
                   >
                     {idx + 1}
                   </button>
                 )
               })}
             </div>
          </ScrollArea>
          
          <div className="p-4 border-t bg-slate-50">
             <div className="text-xs text-center text-muted-foreground mb-2">
               Button Legend
             </div>
          </div>
        </aside>
      </div>

      <AlertDialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to submit?</AlertDialogTitle>
            <AlertDialogDescription>
              You have attempted {Object.keys(answers).length} out of {test.questions.length} questions. 
              {timeLeft > 0 && ` You still have ${Math.floor(timeLeft/60)} minutes remaining.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">Submit Test</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
