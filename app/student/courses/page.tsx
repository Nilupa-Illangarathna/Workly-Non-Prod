import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Construction } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function ComingSoonPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="border-2 border-muted max-w-2xl w-full mx-auto">
        <div className="flex flex-col items-center justify-center p-8 space-y-6">
          <div className="bg-primary/10 p-4 rounded-full">
            <Construction className="h-16 w-16 text-primary" />
          </div>

          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-primary">
              Work in Progress
            </h1>
            <p className="text-muted-foreground text-lg">
              Our team is working hard to bring you this feature soon!
            </p>
          </div>

          <Progress value={45} className="w-full max-w-xs h-2" />

          <div className="text-center space-y-1">
            <p className="text-sm font-medium">Estimated Completion</p>
            <p className="text-sm text-muted-foreground">December 2024</p>
          </div>

          <Button variant="outline" className="mt-4" disabled>
            Notify Me When Ready
          </Button>
        </div>
      </Card>
    </div>
  );
}
