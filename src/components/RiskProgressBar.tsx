interface RiskProgressBarProps {
  score: number;
  showLabel?: boolean;
}

const RiskProgressBar = ({ score, showLabel = true }: RiskProgressBarProps) => {
  const color =
    score <= 40 ? "bg-risk-low" : score <= 70 ? "bg-risk-medium" : "bg-risk-high";

  return (
    <div className="flex items-center gap-2">
      <div className="h-2 flex-1 rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${Math.min(score, 100)}%` }}
        />
      </div>
      {showLabel && (
        <span className="min-w-[2rem] text-xs font-semibold text-muted-foreground">{score}</span>
      )}
    </div>
  );
};

export default RiskProgressBar;
