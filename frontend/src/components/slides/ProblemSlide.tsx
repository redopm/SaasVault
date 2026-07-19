import { AlertCircle } from 'lucide-react';

export default function ProblemSlide({ 
  problems,
  onUpdate
}: { 
  problems?: string[],
  onUpdate?: (index: number, value: string) => void
}) {
  const handleBlur = (index: number) => (e: React.FocusEvent<HTMLElement>) => {
    if (onUpdate) {
      onUpdate(index, e.currentTarget.innerText);
    }
  };

  const currentProblems = problems && problems.length > 0 ? problems : [
    "Example problem statement one.",
    "Example problem statement two."
  ];

  return (
    <div className="w-full h-full flex flex-col justify-center bg-background text-text p-16 absolute inset-0">
      <h2 className="text-4xl font-bold mb-12 flex items-center gap-4 text-primary">
        <AlertCircle size={40} />
        The Problem
      </h2>
      <ul className="space-y-6">
        {currentProblems.map((prob, idx) => (
          <li key={idx} className="text-2xl text-text-muted flex items-start gap-4">
            <span className="text-primary font-bold mr-2 mt-2">{idx + 1}.</span>
            <div 
              contentEditable={!!onUpdate}
              suppressContentEditableWarning
              onBlur={handleBlur(idx)}
              className="flex-1 outline-none focus:ring-2 focus:ring-primary/30 rounded-lg p-2 -ml-2"
            >
              {prob}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
