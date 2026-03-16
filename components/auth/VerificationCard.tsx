import type { Student } from "@/services/students";
import { Icon } from "@/components/common/Icon";

interface VerificationCardProps {
  student: Student;
}

export function VerificationCard({ student }: VerificationCardProps) {
  return (
    <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-5 relative overflow-hidden">
      <div className="absolute -right-4 -top-4 opacity-10">
        <Icon name="school" size={48} className="text-primary" />
      </div>
      <div className="space-y-4 relative z-10">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-primary/20 flex items-center justify-center">
            <Icon name="person" size={32} className="text-primary" />
          </div>
          <div>
            <h4 className="font-bold text-slate-50 text-lg">
              {student.fullname}
            </h4>
            <p className="text-xs text-slate-300 font-medium tracking-wide">
              {student.reg_no}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-bold">
              Department
            </p>
            <p className="text-sm font-semibold text-slate-200">
              {student.department}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-bold">
              Level
            </p>
            <p className="text-sm font-semibold text-slate-200">
              {student.level}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

