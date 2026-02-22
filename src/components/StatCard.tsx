import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  variant?: "default" | "primary" | "danger" | "warning" | "success";
}

const variantStyles = {
  default: "bg-card shadow-card",
  primary: "bg-primary text-primary-foreground",
  danger: "border-risk-high/20 bg-risk-high/5",
  warning: "border-risk-medium/20 bg-risk-medium/5",
  success: "border-risk-low/20 bg-risk-low/5",
};

const iconVariantStyles = {
  default: "bg-muted text-muted-foreground",
  primary: "bg-primary-foreground/20 text-primary-foreground",
  danger: "bg-risk-high/10 text-risk-high",
  warning: "bg-risk-medium/10 text-risk-medium",
  success: "bg-risk-low/10 text-risk-low",
};

const StatCard = ({ title, value, icon: Icon, trend, variant = "default" }: StatCardProps) => {
  return (
    <div className={`rounded-xl border p-5 transition-all hover:shadow-elevated animate-fade-in ${variantStyles[variant]}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className={`text-xs font-medium uppercase tracking-wider ${variant === "primary" ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
            {title}
          </p>
          <p className="mt-2 text-3xl font-bold font-display">{value}</p>
          {trend && (
            <p className={`mt-1 text-xs ${variant === "primary" ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
              {trend}
            </p>
          )}
        </div>
        <div className={`rounded-lg p-2.5 ${iconVariantStyles[variant]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
