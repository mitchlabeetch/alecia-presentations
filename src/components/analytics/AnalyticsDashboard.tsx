"use client";
import { useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useAnalyticsStore } from "../../store/analytics";
import { Card, CardHeader, CardContent } from "../Card";
import { Button } from "../Button";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon?: React.ReactNode;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, changeType = "neutral", icon }) => (
  <Card className="relative overflow-hidden">
    <CardContent>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-400 mb-1">{title}</p>
          <p className="text-3xl font-bold text-white">{typeof value === "number" ? value.toLocaleString() : value}</p>
          {change && (
            <p className={`text-sm mt-1 ${changeType === "positive" ? "text-green-400" : changeType === "negative" ? "text-red-400" : "text-gray-400"}`}>
              {change}
            </p>
          )}
        </div>
        {icon && <div className="p-3 bg-[#e91e63]/10 rounded-xl">{icon}</div>}
      </div>
    </CardContent>
  </Card>
);

interface FunnelStep { name: string; count: number; dropoff: number; }
interface FunnelChartProps { steps: FunnelStep[]; }

const FunnelChart: React.FC<FunnelChartProps> = ({ steps }) => {
  const maxCount = Math.max(...steps.map((s) => s.count), 1);
  return (
    <div className="space-y-4">
      {steps.map((step, index) => {
        const width = (step.count / maxCount) * 100;
        const dropoffPercent = index > 0 ? ((steps[index - 1].count - step.count) / steps[index - 1].count) * 100 : 0;
        return (
          <div key={step.name}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-white">{step.name}</span>
              <span className="text-sm text-gray-400">
                {step.count.toLocaleString()}
                {index > 0 && <span className="text-red-400 ml-2">-{dropoffPercent.toFixed(1)}%</span>}
              </span>
            </div>
            <div className="h-8 bg-[#1e3a5f]/30 rounded-lg overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#e91e63] to-[#c2185b] transition-all duration-500" style={{ width: `${width}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export function AnalyticsDashboard() {
  const { trackEvent } = useAnalyticsStore();
  const [timeRange, setTimeRange] = useState<"24h" | "7d" | "30d">("7d");
  const usageMetrics = useQuery(api.analytics.getUsageMetrics, { days: timeRange === "24h" ? 1 : timeRange === "7d" ? 7 : 30 });
  const funnelData = useQuery(api.analytics.getFunnelAnalysis, { days: timeRange === "24h" ? 1 : timeRange === "7d" ? 7 : 30 });
  useEffect(() => { trackEvent("analytics_dashboard_viewed", { timeRange }); }, [timeRange]);
  const localMetrics = useAnalyticsStore((state) => state.metrics);
  const displayMetrics = usageMetrics || {
    dau: localMetrics.dau || 0, wau: localMetrics.wau || 0, mau: localMetrics.mau || 0,
    projectsCreated: localMetrics.projectsCreated || 0, projectsExported: localMetrics.projectsExported || 0,
    projectsShared: localMetrics.projectsShared || 0, aiGenerations: localMetrics.aiGenerations || 0,
    aiTokensUsed: localMetrics.aiTokensUsed || 0, signupsToFirstProject: localMetrics.signupsToFirstProject || 0,
    projectsToFirstExport: localMetrics.projectsToFirstExport || 0,
  };
  const displayFunnel = funnelData || [
    { name: "Inscriptions", count: 0, dropoff: 0 },
    { name: "Premier projet créé", count: 0, dropoff: 0 },
    { name: "Projet exporté", count: 0, dropoff: 0 },
  ];
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Tableau de bord Analytics</h1>
        <div className="flex gap-2">
          {(["24h", "7d", "30d"] as const).map((range) => (
            <Button key={range} variant={timeRange === range ? "primary" : "ghost"} size="sm" onClick={() => setTimeRange(range)}>
              {range === "24h" ? "24 heures" : range === "7d" ? "7 jours" : "30 jours"}
            </Button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Utilisateurs actifs (J)" value={displayMetrics.dau} change="+12% vs hier" changeType="positive" icon={<span className="text-[#e91e63]">👥</span>} />
        <MetricCard title="Projets créés" value={displayMetrics.projectsCreated} change="+8 cette semaine" changeType="positive" icon={<span className="text-[#e91e63]">📊</span>} />
        <MetricCard title="Exports complétés" value={displayMetrics.projectsExported} change="+15% vs semaine dernière" changeType="positive" icon={<span className="text-[#e91e63]">📤</span>} />
        <MetricCard title="Générations IA" value={displayMetrics.aiGenerations} change={displayMetrics.aiTokensUsed.toLocaleString() + " tokens"} changeType="neutral" icon={<span className="text-[#e91e63]">🤖</span>} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card><CardHeader title="Entonnoir de conversion" subtitle="Parcours utilisateur" /><CardContent><FunnelChart steps={displayFunnel} /></CardContent></Card>
        <Card>
          <CardHeader title="Activité récente" subtitle="7 derniers jours" />
          <CardContent>
            <div className="space-y-4">
              {[
                { label: "Nouveaux utilisateurs", value: displayMetrics.signupsToFirstProject || 0, icon: "👤" },
                { label: "Projets actifs", value: displayMetrics.projectsCreated || 0, icon: "📁" },
                { label: "Sessions de chat IA", value: displayMetrics.aiGenerations || 0, icon: "💬" },
                { label: "Exports effectués", value: displayMetrics.projectsExported || 0, icon: "📄" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-3"><span>{item.icon}</span><span className="text-gray-300">{item.label}</span></div>
                  <span className="text-white font-semibold">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
export default AnalyticsDashboard;
