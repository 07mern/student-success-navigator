interface RiskBadgeProps {
  level: "Low" | "Medium" | "High";
  size?: "sm" | "md";
}

const RiskBadge = ({ level, size = "sm" }: RiskBadgeProps) => {
  const base = "inline-flex items-center gap-1 rounded-full font-semibold";
  const sizeClass = size === "sm" ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-sm";

  const colors = {
    Low: "risk-low-bg risk-low-text",
    Medium: "risk-medium-bg risk-medium-text",
    High: "risk-high-bg risk-high-text",
  };

  const dots = {
    Low: "bg-risk-low",
    Medium: "bg-risk-medium",
    High: "bg-risk-high",
  };

  return (
    <span className={`${base} ${sizeClass} ${colors[level]}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dots[level]}`} />
      {level} Risk
    </span>
  );
};

export default RiskBadge;
