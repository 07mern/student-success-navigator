import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import RiskBadge from "@/components/RiskBadge";
import RiskProgressBar from "@/components/RiskProgressBar";
import { getStudents } from "@/lib/api";
import { dummyStudents, type Student } from "@/lib/dummy-data";

const Students = () => {
  const [students, setStudents] = useState<Student[]>(dummyStudents);
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState<string>("all");
  const [sortAsc, setSortAsc] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getStudents()
      .then((res) => setStudents(res.data))
      .catch(() => setStudents(dummyStudents));
  }, []);

  const filtered = useMemo(() => {
    let list = [...students];
    if (search) list = list.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()));
    if (riskFilter !== "all") list = list.filter((s) => s.risk_level === riskFilter);
    list.sort((a, b) => (sortAsc ? a.risk_score - b.risk_score : b.risk_score - a.risk_score));
    return list;
  }, [students, search, riskFilter, sortAsc]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold font-display">Student Management</h1>
        <p className="text-sm text-muted-foreground">Monitor and manage student risk profiles</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search students..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={riskFilter} onValueChange={setRiskFilter}>
          <SelectTrigger className="w-[160px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter by risk" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="High">High Risk</SelectItem>
            <SelectItem value="Medium">Medium Risk</SelectItem>
            <SelectItem value="Low">Low Risk</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" onClick={() => setSortAsc(!sortAsc)}>
          Sort: {sortAsc ? "Low → High" : "High → Low"}
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-xl border bg-card shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Name</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Department</th>
                <th className="px-4 py-3 text-center font-semibold text-muted-foreground">Attendance</th>
                <th className="px-4 py-3 text-center font-semibold text-muted-foreground">GPA</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground min-w-[140px]">Risk Score</th>
                <th className="px-4 py-3 text-center font-semibold text-muted-foreground">Risk Level</th>
                <th className="px-4 py-3 text-center font-semibold text-muted-foreground">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((student) => (
                <tr key={student.id} className="border-b last:border-b-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium">{student.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{student.department}</td>
                  <td className="px-4 py-3 text-center">{student.attendance}%</td>
                  <td className="px-4 py-3 text-center">{student.gpa.toFixed(1)}</td>
                  <td className="px-4 py-3">
                    <RiskProgressBar score={student.risk_score} />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <RiskBadge level={student.risk_level} />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Button size="sm" variant="outline" onClick={() => navigate(`/students/${student.id}`)}>
                      View
                    </Button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                    No students found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Students;
