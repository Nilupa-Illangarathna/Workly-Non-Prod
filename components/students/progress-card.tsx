import { Progress } from "@/components/ui/progress";

interface ProgressCardProps {
  title: string;
  progress: number;
  modulesCompleted: string;
}

export function ProgressCard({
  title,
  progress,
  modulesCompleted,
}: ProgressCardProps) {
  return (
    <div className="space-y-1 sm:space-y-2">
      <div className="flex justify-between text-xs sm:text-sm">
        <span>{title}</span>
        <span>{progress}%</span>
      </div>
      <Progress value={progress} className="h-1 sm:h-2" />
      <div className="text-xs sm:text-sm text-muted-foreground">
        {modulesCompleted}
      </div>
    </div>
  );
}
