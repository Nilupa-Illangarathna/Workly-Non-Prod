import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Course {
  name: string;
  status: string;
  progress: number;
}

interface RecentCoursesProps {
  courses: Course[];
}

export function RecentCourses({ courses }: RecentCoursesProps) {
  return (
    <div className="overflow-x-auto">
      <Table className="min-w-[300px]">
        <TableBody>
          {courses.map((course) => (
            <TableRow key={course.name}>
              <TableCell className="font-medium text-xs sm:text-sm">
                {course.name}
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    course.status === "completed"
                      ? "default"
                      : course.status === "active"
                      ? "secondary"
                      : "outline"
                  }
                  className="capitalize">
                  {course.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right text-xs sm:text-sm">
                {course.progress}%
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
