import { useState, useEffect } from "react";
import { Calendar, Plus, Clock, User, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { getCounselingSessions, addCounselingSession } from "@/lib/api";
import { dummyCounselingSessions, type CounselingSession } from "@/lib/dummy-data";
import { toast } from "@/hooks/use-toast";

const statusStyles: Record<string, string> = {
  Completed: "risk-low-bg risk-low-text",
  Scheduled: "bg-primary/10 text-primary",
  Missed: "risk-high-bg risk-high-text",
};

const Counseling = () => {
  const [sessions, setSessions] = useState<CounselingSession[]>(dummyCounselingSessions);
  const [newSession, setNewSession] = useState({ student_id: "", notes: "", follow_up_date: "" });
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    getCounselingSessions()
      .then((res) => setSessions(res.data))
      .catch(() => setSessions(dummyCounselingSessions));
  }, []);

  const handleAdd = async () => {
    try {
      await addCounselingSession(newSession);
    } catch {
      // Fallback: add locally
      const newEntry: CounselingSession = {
        id: `CS${Date.now()}`,
        student_id: newSession.student_id,
        student_name: "New Student",
        date: new Date().toISOString().split("T")[0],
        notes: newSession.notes,
        counselor: "Current User",
        follow_up_date: newSession.follow_up_date,
        status: "Scheduled",
      };
      setSessions((prev) => [newEntry, ...prev]);
    }
    toast({ title: "Session added", description: "Counseling session has been recorded." });
    setNewSession({ student_id: "", notes: "", follow_up_date: "" });
    setDialogOpen(false);
  };

  // Next follow-up
  const nextFollowUp = sessions
    .filter((s) => s.status === "Scheduled")
    .sort((a, b) => a.follow_up_date.localeCompare(b.follow_up_date))[0];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display">Counseling</h1>
          <p className="text-sm text-muted-foreground">Manage counseling sessions and follow-ups</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="h-4 w-4" /> New Session</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Counseling Session</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Student ID</Label>
                <Input placeholder="e.g. STU002" value={newSession.student_id} onChange={(e) => setNewSession({ ...newSession, student_id: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Session Notes</Label>
                <Textarea rows={3} placeholder="Enter session notes..." value={newSession.notes} onChange={(e) => setNewSession({ ...newSession, notes: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Follow-up Date</Label>
                <Input type="date" value={newSession.follow_up_date} onChange={(e) => setNewSession({ ...newSession, follow_up_date: e.target.value })} />
              </div>
              <Button onClick={handleAdd} className="w-full">Save Session</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Next follow-up card */}
      {nextFollowUp && (
        <div className="flex items-center gap-4 rounded-xl border border-primary/20 bg-primary/5 p-4">
          <div className="rounded-lg bg-primary p-2.5">
            <Clock className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm font-semibold">Next Follow-up</p>
            <p className="text-xs text-muted-foreground">
              {nextFollowUp.student_name} — {new Date(nextFollowUp.follow_up_date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
            </p>
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="space-y-0">
        {sessions.map((session, idx) => (
          <div key={session.id} className="relative flex gap-4 pb-6">
            {/* Timeline line */}
            {idx < sessions.length - 1 && (
              <div className="absolute left-[19px] top-10 h-full w-px bg-border" />
            )}
            {/* Dot */}
            <div className="relative z-10 mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-border bg-card">
              {session.status === "Completed" ? (
                <CheckCircle className="h-4 w-4 text-risk-low" />
              ) : session.status === "Missed" ? (
                <AlertCircle className="h-4 w-4 text-risk-high" />
              ) : (
                <Calendar className="h-4 w-4 text-primary" />
              )}
            </div>
            {/* Content */}
            <div className="flex-1 rounded-xl border bg-card p-4 shadow-card">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="font-semibold text-sm">{session.student_name}</span>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusStyles[session.status]}`}>
                  {session.status}
                </span>
                <span className="ml-auto text-xs text-muted-foreground">{session.date}</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{session.notes}</p>
              <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><User className="h-3 w-3" />{session.counselor}</span>
                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />Follow-up: {session.follow_up_date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Counseling;
