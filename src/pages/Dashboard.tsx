import { useState, useEffect } from "react";
import { Users, AlertTriangle, TrendingDown, Activity } from "lucide-react";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import StatCard from "@/components/StatCard";
import { getDashboardStats } from "@/lib/api";
import { dummyDashboardStats, type DashboardStats } from "@/lib/dummy-data";

const RISK_COLORS = ["hsl(152, 60%, 42%)", "hsl(38, 92%, 50%)", "hsl(0, 72%, 51%)"];

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>(dummyDashboardStats);

  useEffect(() => {
    getDashboardStats()
      .then((res) => setStats(res.data))
      .catch(() => setStats(dummyDashboardStats));
  }, []);

  const pieData = [
    { name: "Low Risk", value: stats.low_risk },
    { name: "Medium Risk", value: stats.medium_risk },
    { name: "High Risk", value: stats.high_risk },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold font-display">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Overview of student risk analytics</p>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Students" value={stats.total_students.toLocaleString()} icon={Users} variant="primary" />
        <StatCard title="High Risk" value={stats.high_risk} icon={AlertTriangle} variant="danger" trend={`${((stats.high_risk / stats.total_students) * 100).toFixed(1)}% of total`} />
        <StatCard title="Medium Risk" value={stats.medium_risk} icon={TrendingDown} variant="warning" trend={`${((stats.medium_risk / stats.total_students) * 100).toFixed(1)}% of total`} />
        <StatCard title="Avg Attendance" value={`${stats.average_attendance}%`} icon={Activity} variant="success" />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Risk Distribution Pie Chart */}
        <div className="rounded-xl border bg-card p-5 shadow-card">
          <h3 className="mb-4 text-sm font-semibold font-display">Risk Distribution</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={100}
                paddingAngle={4}
                dataKey="value"
                stroke="none"
              >
                {pieData.map((_, idx) => (
                  <Cell key={idx} fill={RISK_COLORS[idx]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid hsl(214, 20%, 88%)",
                  fontSize: "12px",
                }}
              />
              <Legend
                verticalAlign="bottom"
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: "12px" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Department Risk Bar Chart */}
        <div className="rounded-xl border bg-card p-5 shadow-card">
          <h3 className="mb-4 text-sm font-semibold font-display">Department-wise Risk</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={stats.department_risk} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 88%)" />
              <XAxis dataKey="department" tick={{ fontSize: 10 }} interval={0} angle={-20} textAnchor="end" height={60} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid hsl(214, 20%, 88%)", fontSize: "12px" }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "12px" }} />
              <Bar dataKey="high" name="High" fill={RISK_COLORS[2]} radius={[3, 3, 0, 0]} />
              <Bar dataKey="medium" name="Medium" fill={RISK_COLORS[1]} radius={[3, 3, 0, 0]} />
              <Bar dataKey="low" name="Low" fill={RISK_COLORS[0]} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
