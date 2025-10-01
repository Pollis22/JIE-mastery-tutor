import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, ChevronDown, Plus, Settings } from "lucide-react";

interface Student {
  id: string;
  name: string;
  grade?: string;
}

interface StudentSwitcherProps {
  selectedStudentId?: string;
  onSelectStudent: (studentId: string | null) => void;
  onOpenProfile: (studentId?: string) => void;
}

export function StudentSwitcher({ 
  selectedStudentId, 
  onSelectStudent, 
  onOpenProfile 
}: StudentSwitcherProps) {
  const { data: students = [], isLoading } = useQuery<Student[]>({
    queryKey: ['/api/students'],
  });

  const currentStudent = students.find(s => s.id === selectedStudentId);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="gap-2"
          data-testid="button-student-switcher"
        >
          <User className="h-4 w-4" />
          <span className="max-w-[150px] truncate">
            {currentStudent?.name || "No Student"}
          </span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[220px]">
        <DropdownMenuLabel>Student Profiles</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {isLoading && (
          <DropdownMenuItem disabled>Loading...</DropdownMenuItem>
        )}
        
        {!isLoading && students.length === 0 && (
          <DropdownMenuItem disabled>No students yet</DropdownMenuItem>
        )}
        
        {students.map(student => (
          <DropdownMenuItem
            key={student.id}
            onClick={() => onSelectStudent(student.id)}
            className="gap-2"
            data-testid={`student-option-${student.id}`}
          >
            <User className="h-4 w-4" />
            <div className="flex flex-col">
              <span>{student.name}</span>
              {student.grade && (
                <span className="text-xs text-muted-foreground">{student.grade}</span>
              )}
            </div>
          </DropdownMenuItem>
        ))}
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem
          onClick={() => onOpenProfile()}
          className="gap-2"
          data-testid="button-create-student"
        >
          <Plus className="h-4 w-4" />
          <span>Create New Student</span>
        </DropdownMenuItem>
        
        {currentStudent && (
          <DropdownMenuItem
            onClick={() => onOpenProfile(currentStudent.id)}
            className="gap-2"
            data-testid="button-edit-student"
          >
            <Settings className="h-4 w-4" />
            <span>Edit Profile</span>
          </DropdownMenuItem>
        )}
        
        {currentStudent && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onSelectStudent(null)}
              className="gap-2 text-muted-foreground"
              data-testid="button-clear-student"
            >
              <span>Clear Selection</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
