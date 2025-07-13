import { Card } from "../ui/card";
import { cn } from "@/lib/utils";

export default function StatsCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  color,
  className = "",
}: {
  title: string;
  value: number;
  icon: React.ReactElement;
  description: string;
  trend?: string;
  color: string;
  className?: string;
}) {
  const trendColor = trend?.startsWith("+")
    ? "text-success"
    : "text-destructive";

  return (
    <Card className="relative overflow-hidden">
      <div className="p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs sm:text-sm font-medium text-muted-foreground">
              {title}
            </p>
            <h3
              className={cn(
                "text-xl sm:text-2xl font-bold mt-1 sm:mt-2",
                className
              )}>
              {value}
            </h3>
          </div>
          <div
            className={cn(
              "h-10 w-10 sm:h-12 sm:w-12 rounded-full flex items-center justify-center",
              `bg-${color}/20`
            )}>
            {Icon}
          </div>
        </div>
        <div className="mt-2 sm:mt-4 flex items-center text-xs sm:text-sm">
          <span className="text-muted-foreground">{description}</span>
          {trend && <span className={cn("ml-2", trendColor)}>{trend}</span>}
        </div>
      </div>
    </Card>
  );
}
