import React, { createContext, useContext, useState, useEffect } from "react";

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctOption: number; // 0-3
  subject: "Physics" | "Chemistry" | "Maths" | "Biology" | "General";
  type: "MCQ" | "Integer";
  explanation?: string;
}

export interface TestResult {
  testId: string;
  score: number;
  totalQuestions: number;
  correct: number;
  wrong: number;
  unattempted: number;
  timeTaken: number; // seconds
  date: string;
  subjectAnalysis: Record<string, { total: number; correct: number }>;
}

export interface Test {
  id: string;
  title: string;
  subject: string;
  questionsCount: number;
  duration: number; // minutes
  difficulty: "Easy" | "Medium" | "Hard";
  price: number | "Free";
  tags: string[];
  questions: Question[];
}

interface TestContextType {
  tests: Test[];
  results: TestResult[];
  addTest: (test: Omit<Test, "id">) => void;
  deleteTest: (id: string) => void;
  submitTest: (testId: string, answers: Record<string, number>, timeTaken: number) => void;
}

const TestContext = createContext<TestContextType | undefined>(undefined);

const SAMPLE_QUESTIONS: Question[] = [
  {
    id: "q1",
    text: "What is the dimensional formula of Universal Gravitational Constant (G)?",
    options: ["M-1 L3 T-2", "M1 L2 T-1", "M-1 L2 T-2", "M1 L3 T-2"],
    correctOption: 0,
    subject: "Physics",
    type: "MCQ",
    explanation: "F = G(m1m2)/r^2 => G = Fr^2/(m1m2). Dimensions: [MLT^-2][L^2]/[M^2] = [M^-1 L^3 T^-2]"
  },
  {
    id: "q2",
    text: "Which of the following compounds is most acidic?",
    options: ["Phenol", "Ethanol", "Acetic Acid", "Picric Acid"],
    correctOption: 3,
    subject: "Chemistry",
    type: "MCQ",
    explanation: "Picric acid (2,4,6-trinitrophenol) has three strong electron withdrawing -NO2 groups, making it highly acidic."
  },
  {
    id: "q3",
    text: "The value of lim(x->0) (sin x / x) is:",
    options: ["0", "1", "Infinity", "Undefined"],
    correctOption: 1,
    subject: "Maths",
    type: "MCQ"
  },
  {
    id: "q4",
    text: "In a triangle ABC, if a=3, b=4, c=5, then the triangle is:",
    options: ["Acute angled", "Obtuse angled", "Right angled", "Equilateral"],
    correctOption: 2,
    subject: "Maths",
    type: "MCQ"
  },
  {
    id: "q5",
    text: "Mitochondria is known as the:",
    options: ["Kitchen of the cell", "Powerhouse of the cell", "Brain of the cell", "Suicide bag"],
    correctOption: 1,
    subject: "Biology",
    type: "MCQ"
  }
];

const INITIAL_TESTS: Test[] = [
  {
    id: "1",
    title: "JEE Mains Full Mock 1",
    subject: "Physics, Chemistry, Maths",
    questionsCount: 5,
    duration: 180,
    difficulty: "Hard",
    price: "Free",
    tags: ["JEE", "Full Syllabus"],
    questions: SAMPLE_QUESTIONS
  },
  {
    id: "2",
    title: "NEET Biology Chapterwise: Genetics",
    subject: "Biology",
    questionsCount: 5,
    duration: 60,
    difficulty: "Medium",
    price: "Free",
    tags: ["NEET", "Chapterwise"],
    questions: SAMPLE_QUESTIONS.filter(q => q.subject === "Biology")
  },
];

export function TestProvider({ children }: { children: React.ReactNode }) {
  const [tests, setTests] = useState<Test[]>(INITIAL_TESTS);
  const [results, setResults] = useState<TestResult[]>([]);

  // Hydrate tests
  useEffect(() => {
    const savedTests = localStorage.getItem("untitled-world-tests-v2");
    if (savedTests) {
      try {
        setTests(JSON.parse(savedTests));
      } catch (e) { console.error(e); }
    }
    
    const savedResults = localStorage.getItem("untitled-world-results");
    if (savedResults) {
      try {
        setResults(JSON.parse(savedResults));
      } catch (e) { console.error(e); }
    }
  }, []);

  // Save tests
  useEffect(() => {
    localStorage.setItem("untitled-world-tests-v2", JSON.stringify(tests));
  }, [tests]);

  // Save results
  useEffect(() => {
    localStorage.setItem("untitled-world-results", JSON.stringify(results));
  }, [results]);

  const addTest = (newTest: Omit<Test, "id">) => {
    const testWithId = { ...newTest, id: Math.random().toString(36).substr(2, 9) };
    setTests((prev) => [testWithId, ...prev]);
  };

  const deleteTest = (id: string) => {
    setTests((prev) => prev.filter(t => t.id !== id));
  };

  const submitTest = (testId: string, answers: Record<string, number>, timeTaken: number) => {
    const test = tests.find(t => t.id === testId);
    if (!test) return;

    let correct = 0;
    let wrong = 0;
    let unattempted = 0;
    const subjectAnalysis: Record<string, { total: number; correct: number }> = {};

    test.questions.forEach(q => {
      // Init subject stats if needed
      if (!subjectAnalysis[q.subject]) {
        subjectAnalysis[q.subject] = { total: 0, correct: 0 };
      }
      subjectAnalysis[q.subject].total++;

      if (answers[q.id] === undefined) {
        unattempted++;
      } else if (answers[q.id] === q.correctOption) {
        correct++;
        subjectAnalysis[q.subject].correct++;
      } else {
        wrong++;
      }
    });

    const score = (correct * 4) - (wrong * 1); // Standard JEE marking

    const result: TestResult = {
      testId,
      score,
      totalQuestions: test.questions.length,
      correct,
      wrong,
      unattempted,
      timeTaken,
      date: new Date().toISOString(),
      subjectAnalysis
    };

    setResults(prev => [result, ...prev]);
  };

  return (
    <TestContext.Provider value={{ tests, results, addTest, deleteTest, submitTest }}>
      {children}
    </TestContext.Provider>
  );
}

export function useTests() {
  const context = useContext(TestContext);
  if (context === undefined) {
    throw new Error("useTests must be used within a TestProvider");
  }
  return context;
}
