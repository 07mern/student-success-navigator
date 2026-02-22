import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Mail, Bell, Download, Plus,
  AlertTriangle, TrendingDown, BookOpen,
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import RiskBadge from "@/components/RiskBadge";
import { getStudent } from "@/lib/api";
import { dummyStudents, type Student } from "@/lib/dummy-data";
import { toast } from "@/hooks/use-toast";

const riskFactorIcons = [AlertTriangle, TrendingDown, BookOpen];

const StudentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [student, setStudent] = useState<Student | null>(null);
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!id) return;
    getStudent(id)
      .then((res) => setStudent(res.data))
      .catch(() => {
        const found = dummyStudents.find((s) => s.id === id);
        setStudent(found || null);
      });
  }, [id]);

  if (!student) {
    return (
      <div className="flex h-64 items-center justify-center text-muted-foreground">
        Student not found.
      </div>
    );
  }

  const semesters = student.attendance_history.map((_, i) => `Sem ${i + 1}`);
  const attendanceData = semesters.map((sem, i) => ({ semester: sem, attendance: student.attendance_history[i] }));
  const gpaData = semesters.map((sem, i) => ({ semester: sem, gpa: student.gpa_history[i] }));

  const riskMeterRotation = (student.risk_score / 100) * 180 - 90;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back button */}
      <Button variant="ghost" size="sm" onClick={() => navigate("/students")} className="gap-2">
        <ArrowLeft className="h-4 w-4" /> Back to Students
      </Button>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold font-display">{student.name}</h1>
            <RiskBadge level={student.risk_level} size="md" />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {student.department} • {student.email} • Enrolled {student.enrollment_year} • Semester {student.semester}
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2"><Plus className="h-4 w-4" /> Add Note</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Counseling Note</DialogTitle>
              </DialogHeader>
              <Textarea
                placeholder="Enter counseling notes..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={4}
              />
              <Button onClick={() => { toast({ title: "Note saved", description: "Counseling note has been recorded." }); setNote(""); }}>
                Save Note
              </Button>
            </DialogContent>
          </Dialog>
          <Button size="sm" variant="outline" className="gap-2" onClick={() => toast({ title: "Notification sent", description: `Alert sent to ${student.name}` })}>
            <Bell className="h-4 w-4" /> Notify
          </Button>
          <Button size="sm" variant="outline" className="gap-2" onClick={() => toast({ title: "Report downloading", description: "Risk report PDF is being generated." })}>
            <Download className="h-4 w-4" /> Report
          </Button>
        </div>
      </div>

      {/* Main info grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Risk Meter */}
        <div className="rounded-xl border bg-card p-6 shadow-card flex flex-col items-center">
          <h3 className="text-sm font-semibold text-muted-foreground mb-4">Dropout Probability</h3>
          {/* Gauge */}
          <div className="relative w-48 h-24 overflow-hidden mb-2">
            <div className="absolute inset-0 rounded-t-full border-[12px] border-muted" />
            <div
              className="absolute bottom-0 left-1/2 w-1 h-20 origin-bottom rounded-full bg-foreground transition-transform duration-700"
              style={{ transform: `translateX(-50%) rotate(${riskMeterRotation}deg)` }}
            />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-3 w-3 rounded-full bg-foreground" />
          </div>
          <p className="text-4xl font-bold font-display">{student.dropout_probability}%</p>
          <p className="text-xs text-muted-foreground mt-1">Risk Score: {student.risk_score}/100</p>
        </div>

        {/* Student Info */}
        <div className="rounded-xl border bg-card p-6 shadow-card">
          <h3 className="text-sm font-semibold text-muted-foreground mb-4">Student Information</h3>
          <dl className="space-y-3 text-sm">
            {[
              ["ID", student.id],
              ["Department", student.department],
              ["Attendance", `${student.attendance}%`],
              ["GPA", student.gpa.toFixed(2)],
              ["Semester", student.semester],
              ["Email", student.email],
            ].map(([label, val]) => (
              <div key={label} className="flex justify-between">
                <dt className="text-muted-foreground">{label}</dt>
                <dd className="font-medium">{val}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Top Risk Factors */}
        <div className="rounded-xl border bg-card p-6 shadow-card">
          <h3 className="text-sm font-semibold text-muted-foreground mb-4">Top Risk Factors (XAI)</h3>
          <div className="space-y-3">
            {student.risk_factors.slice(0, 3).map((factor, i) => {
              const Icon = riskFactorIcons[i] || AlertTriangle;
              return (
                <div key={i} className="flex items-start gap-3 rounded-lg bg-muted/50 p-3">
                  <div className={`mt-0.5 rounded p-1.5 ${i === 0 ? "bg-risk-high/10 text-risk-high" : i === 1 ? "bg-risk-medium/10 text-risk-medium" : "bg-risk-low/10 text-risk-low"}`}>
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{factor}</p>
                    <p className="text-xs text-muted-foreground">Importance: {["High", "Medium", "Low"][i]}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-card p-5 shadow-card">
          <h3 className="mb-4 text-sm font-semibold font-display">Attendance Trend</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 88%)" />
              <XAxis dataKey="semester" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid hsl(214, 20%, 88%)", fontSize: "12px" }} />
              <Line type="monotone" dataKey="attendance" stroke="hsl(215, 70%, 28%)" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border bg-card p-5 shadow-card">
          <h3 className="mb-4 text-sm font-semibold font-display">GPA Trend</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={gpaData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 88%)" />
              <XAxis dataKey="semester" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 4]} tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid hsl(214, 20%, 88%)", fontSize: "12px" }} />
              <Line type="monotone" dataKey="gpa" stroke="hsl(168, 50%, 42%)" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default StudentDetail;
