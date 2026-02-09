import { useState } from "react";
import { useTests, Question, Test } from "@/context/TestContext";
import { useToast } from "@/hooks/use-toast";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Trash2, Plus, Sparkles, Wand2, FileText, Upload } from "lucide-react";
import { Label } from "@/components/ui/label";

// Schema for a single question
const questionSchema = z.object({
  text: z.string().min(5, "Question text is required"),
  options: z.array(z.string().min(1, "Option is required")).length(4, "Must have 4 options"),
  correctOption: z.coerce.number().min(0).max(3),
  subject: z.string().min(1, "Subject is required"),
  explanation: z.string().optional(),
});

// Schema for the test form
const testFormSchema = z.object({
  title: z.string().min(2, "Title is required"),
  subject: z.string().min(2),
  duration: z.coerce.number().min(1),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
  price: z.string(),
  tags: z.string(),
  questions: z.array(questionSchema).min(1, "At least one question is required"),
});

export default function Admin() {
  const { addTest, tests, deleteTest } = useTests();
  const { toast } = useToast();
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  const form = useForm<z.infer<typeof testFormSchema>>({
    resolver: zodResolver(testFormSchema),
    defaultValues: {
      title: "",
      subject: "",
      duration: 180,
      difficulty: "Medium",
      price: "Free",
      tags: "",
      questions: [
        { text: "", options: ["", "", "", ""], correctOption: 0, subject: "Physics", explanation: "" }
      ],
    },
  });

  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: "questions",
  });

  const simulateAiGeneration = async () => {
    setIsAiGenerating(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock AI response
    const mockQuestions = [
      {
        text: "For the reaction N2(g) + 3H2(g) ⇌ 2NH3(g), the value of Kp depends on:",
        options: ["Total Pressure", "Catalyst", "Temperature", "Initial Concentration"],
        correctOption: 2,
        subject: "Chemistry",
        explanation: "Equilibrium constant Kp depends only on temperature for a given reaction.",
      },
      {
        text: "If y = log(sin x), then dy/dx is:",
        options: ["tan x", "cot x", "sec x", "cosec x"],
        correctOption: 1,
        subject: "Maths",
        explanation: "d/dx(log(sin x)) = (1/sin x) * cos x = cot x",
      },
      {
        text: "A particle is projected with velocity u at an angle θ with horizontal. The maximum height is:",
        options: ["u²sin²θ/g", "u²sin²θ/2g", "u²sin2θ/g", "u²cos²θ/2g"],
        correctOption: 1,
        subject: "Physics",
        explanation: "Maximum height H = (u² sin²θ) / 2g",
      },
      {
        text: "Which of the following is NOT a fundamental unit?",
        options: ["Meter", "Second", "Newton", "Kelvin"],
        correctOption: 2,
        subject: "Physics",
        explanation: "Newton is a derived unit of force (kg·m/s²).",
      },
    ];

    // Append mock questions to existing form
    const currentQuestions = form.getValues("questions");
    replace([...currentQuestions, ...mockQuestions]);
    
    setIsAiGenerating(false);
    toast({
      title: "AI Generation Complete",
      description: "Generated 4 exam-relevant questions based on latest patterns.",
    });
  };

  function onSubmit(values: z.infer<typeof testFormSchema>) {
    const formattedPrice = values.price.toLowerCase() === "free" ? "Free" : Number(values.price);
    
    // Transform form questions to Context Question type
    const formattedQuestions: Question[] = values.questions.map((q, idx) => ({
      id: `q-${Date.now()}-${idx}`,
      text: q.text,
      options: q.options,
      correctOption: q.correctOption,
      subject: q.subject as any,
      type: "MCQ", // Default for now
      explanation: q.explanation
    }));

    addTest({
      title: values.title,
      subject: values.subject,
      questionsCount: formattedQuestions.length,
      duration: values.duration,
      difficulty: values.difficulty,
      price: formattedPrice as number | "Free",
      tags: values.tags.split(",").map(t => t.trim()).filter(Boolean),
      questions: formattedQuestions
    });

    toast({
      title: "Test Published Successfully",
      description: `${values.title} is now live with ${formattedQuestions.length} questions.`,
    });
    form.reset();
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <div>
           <h1 className="text-3xl font-bold font-heading text-slate-900">Admin Dashboard</h1>
           <p className="text-muted-foreground">Manage your tests and question bank.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => document.getElementById('file-upload')?.click()}>
            <Upload className="h-4 w-4 mr-2" /> Bulk Upload (CSV)
          </Button>
          <input id="file-upload" type="file" className="hidden" accept=".csv" />
          <Button>
            <Plus className="h-4 w-4 mr-2" /> New Test
          </Button>
        </div>
      </div>

      <Tabs defaultValue="create" className="space-y-6">
        <TabsList>
          <TabsTrigger value="create">Create Test</TabsTrigger>
          <TabsTrigger value="manage">Manage Tests</TabsTrigger>
          <TabsTrigger value="analytics">Platform Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="create">
          <div className="grid lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Test Details</CardTitle>
                <CardDescription>Configure the basic settings for the new mock test.</CardDescription>
              </CardHeader>
              <CardContent>
                <form id="test-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                   <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                       <Label>Title</Label>
                       <Input {...form.register("title")} placeholder="e.g. JEE Mains Mock 5" />
                       {form.formState.errors.title && <p className="text-red-500 text-sm">{form.formState.errors.title.message}</p>}
                     </div>
                     <div className="space-y-2">
                       <Label>Subject (Comma Sep)</Label>
                       <Input {...form.register("subject")} placeholder="Physics, Chemistry, Maths" />
                     </div>
                   </div>
                   
                   <div className="grid grid-cols-3 gap-4">
                     <div className="space-y-2">
                       <Label>Duration (mins)</Label>
                       <Input type="number" {...form.register("duration")} />
                     </div>
                     <div className="space-y-2">
                       <Label>Difficulty</Label>
                       <Select onValueChange={(val: any) => form.setValue("difficulty", val)} defaultValue="Medium">
                         <SelectTrigger><SelectValue /></SelectTrigger>
                         <SelectContent>
                           <SelectItem value="Easy">Easy</SelectItem>
                           <SelectItem value="Medium">Medium</SelectItem>
                           <SelectItem value="Hard">Hard</SelectItem>
                         </SelectContent>
                       </Select>
                     </div>
                     <div className="space-y-2">
                       <Label>Price</Label>
                       <Input {...form.register("price")} placeholder="Free" />
                     </div>
                   </div>
                   <div className="space-y-2">
                       <Label>Tags</Label>
                       <Input {...form.register("tags")} placeholder="JEE, 2026, Full Syllabus" />
                   </div>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-6">
               <Card className="bg-gradient-to-br from-indigo-50 to-white border-indigo-100">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-indigo-600" />
                      AI Assistant
                    </CardTitle>
                    <CardDescription>Generate high-quality questions automatically.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      onClick={simulateAiGeneration} 
                      className="w-full bg-indigo-600 hover:bg-indigo-700" 
                      disabled={isAiGenerating}
                    >
                      {isAiGenerating ? (
                        <>
                          <Wand2 className="h-4 w-4 mr-2 animate-spin" /> Generating...
                        </>
                      ) : (
                        <>
                          <Wand2 className="h-4 w-4 mr-2" /> Generate Questions
                        </>
                      )}
                    </Button>
                    <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
                      Our AI analyzes exam patterns to create relevant questions. You can review and edit them before publishing.
                    </p>
                  </CardContent>
               </Card>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-bold font-heading mb-4">Question Management</h2>
            <div className="space-y-6">
              {fields.map((field, index) => (
                <Card key={field.id} className="relative group">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <CardContent className="p-6 space-y-4">
                     <div className="flex gap-4 items-start">
                        <span className="font-bold text-slate-400 mt-2">Q{index + 1}</span>
                        <div className="flex-1 space-y-4">
                           <Textarea 
                              {...form.register(`questions.${index}.text` as const)} 
                              placeholder="Type your question here..." 
                              className="font-medium text-lg min-h-[80px]"
                           />
                           
                           <div className="grid grid-cols-2 gap-4">
                              {/* Options */}
                              {[0, 1, 2, 3].map((optIdx) => (
                                <div key={optIdx} className="flex items-center gap-2">
                                  <div className="w-6 text-center text-sm font-bold text-slate-400">{String.fromCharCode(65 + optIdx)}</div>
                                  <Input 
                                    {...form.register(`questions.${index}.options.${optIdx}` as const)} 
                                    placeholder={`Option ${optIdx + 1}`}
                                  />
                                  <input 
                                    type="radio" 
                                    name={`correct-${index}`}
                                    checked={form.watch(`questions.${index}.correctOption`) == optIdx}
                                    onChange={() => form.setValue(`questions.${index}.correctOption`, optIdx)}
                                    className="accent-green-600 w-4 h-4 cursor-pointer"
                                  />
                                </div>
                              ))}
                           </div>

                           <div className="grid grid-cols-2 gap-4">
                             <Input 
                                {...form.register(`questions.${index}.subject` as const)}
                                placeholder="Subject (e.g. Physics)" 
                             />
                             <Input 
                                {...form.register(`questions.${index}.explanation` as const)}
                                placeholder="Explanation for the correct answer (optional)" 
                             />
                           </div>
                        </div>
                     </div>
                  </CardContent>
                </Card>
              ))}
              
              <Button variant="outline" onClick={() => append({ text: "", options: ["", "", "", ""], correctOption: 0, subject: "Physics", explanation: "" })} className="w-full border-dashed border-2 py-8">
                <Plus className="h-4 w-4 mr-2" /> Add Manually
              </Button>
            </div>
          </div>
          
          <div className="mt-8 flex justify-end sticky bottom-4">
             <Button size="lg" className="shadow-xl" onClick={form.handleSubmit(onSubmit)}>
               Publish Test Series
             </Button>
          </div>
        </TabsContent>

        <TabsContent value="manage">
           <div className="grid gap-4">
             {tests.map(test => (
               <Card key={test.id} className="flex justify-between items-center p-6">
                 <div>
                   <h3 className="font-bold text-lg">{test.title}</h3>
                   <div className="flex gap-2 text-sm text-muted-foreground mt-1">
                     <span>{test.questionsCount} Questions</span>
                     <span>•</span>
                     <span>{test.difficulty}</span>
                   </div>
                 </div>
                 <div className="flex gap-2">
                   <Button variant="outline">Edit</Button>
                   <Button variant="destructive" onClick={() => deleteTest(test.id)}>Delete</Button>
                 </div>
               </Card>
             ))}
           </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
