interface Theme {
  primaryColor: string;
  accentColor: string;
  fontFamily: string;
}

interface SlideData {
  type: string;
  title: string;
  content: string;
}

interface Props {
  slide: SlideData;
  theme: Theme;
  compact?: boolean;
}

export function SlidePreview({ slide, theme, compact = false }: Props) {
  const lines = slide.content.split("\n").filter(l => l.trim());
  const isCover = slide.type === "cover";
  const isFinancials = slide.type === "financials";
  const isTeam = slide.type === "team";
  const isTimeline = slide.type === "timeline";
  const isMarket = slide.type === "market";
  const isCompetition = slide.type === "competition";
  const isAppendix = slide.type === "appendix";
  const isExecutiveSummary = slide.type === "executive_summary";
  const isThesis = slide.type === "thesis";
  const isSwot = slide.type === "swot";
  const isValuation = slide.type === "valuation";
  const isRisk = slide.type === "risk";
  const isEsg = slide.type === "esg";
  const isSynergies = slide.type === "synergies";
  const isProcess = slide.type === "process";

  const fs = (base: number) => compact ? `${Math.round(base * 0.45)}px` : `${base}px`;
  const p = theme.primaryColor;
  const a = theme.accentColor;
  const ff = theme.fontFamily ?? "Inter";

  const HeaderBar = ({ title }: { title: string }) => (
    <div className="flex-shrink-0 flex items-center gap-3 px-6 py-3" style={{ background: p, minHeight: compact ? "36px" : "64px" }}>
      <div className="w-0.5 self-stretch rounded-full" style={{ background: a }} />
      <h2 className="font-bold text-white leading-tight" style={{ fontSize: fs(20), fontFamily: ff }}>{title}</h2>
    </div>
  );

  const Footer = () => (
    <div className="flex-shrink-0 flex items-center justify-between px-6 py-1" style={{ background: `${p}08`, borderTop: `2px solid ${a}` }}>
      <div className="w-4 h-0.5 rounded" style={{ background: a }} />
      <div className="w-4 h-0.5 rounded" style={{ background: `${p}30` }} />
    </div>
  );

  return (
    <div
      className="rounded-xl shadow-lg overflow-hidden"
      style={{
        width: compact ? "100%" : "min(800px, 100%)",
        aspectRatio: "16/9",
        fontFamily: ff,
        position: "relative",
        background: isCover ? p : "#ffffff",
        border: `1px solid ${p}20`,
      }}
    >
      {isCover ? (
        <div className="absolute inset-0 flex flex-col" style={{ background: `linear-gradient(135deg, ${p} 0%, ${p}dd 60%, ${p}bb 100%)` }}>
          <div className="absolute top-0 right-0 w-1/3 h-full opacity-10" style={{ background: `linear-gradient(to left, ${a}, transparent)` }} />
          <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: a }} />
          <div className="absolute top-0 left-0 w-1" style={{ background: a, height: "40%" }} />
          <div className="flex-1 flex flex-col items-center justify-center px-10 text-white text-center relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-px flex-1 opacity-40" style={{ background: a, width: compact ? "20px" : "40px" }} />
              <div className="w-2 h-2 rounded-full" style={{ background: a }} />
              <div className="h-px flex-1 opacity-40" style={{ background: a, width: compact ? "20px" : "40px" }} />
            </div>
            <h1 className="font-bold leading-tight mb-3" style={{ fontSize: fs(28), color: "#ffffff", fontFamily: ff }}>{slide.title}</h1>
            {lines.map((line, i) => (
              <p key={i} style={{ fontSize: fs(12), opacity: i === 0 ? 0.9 : 0.65, marginTop: compact ? "2px" : "4px", fontFamily: ff }}>{line}</p>
            ))}
            <div className="mt-4 flex items-center gap-2">
              <div className="h-px opacity-40" style={{ background: a, width: compact ? "20px" : "40px" }} />
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: a }} />
              <div className="h-px opacity-40" style={{ background: a, width: compact ? "20px" : "40px" }} />
            </div>
          </div>
        </div>
      ) : isExecutiveSummary ? (
        <div className="absolute inset-0 flex flex-col">
          <HeaderBar title={slide.title} />
          <div className="flex-1 px-6 py-3 overflow-hidden grid grid-cols-2 gap-2">
            {lines.slice(0, 6).map((line, i) => (
              <div key={i} className="flex items-start gap-2 p-2 rounded-lg" style={{ background: i % 2 === 0 ? `${p}07` : `${a}08`, border: `1px solid ${i % 2 === 0 ? p : a}15` }}>
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1" style={{ background: i % 2 === 0 ? p : a }} />
                <p style={{ fontSize: fs(11), color: "#374151", lineHeight: 1.4, fontFamily: ff }}>{line}</p>
              </div>
            ))}
          </div>
          <Footer />
        </div>
      ) : isThesis ? (
        <div className="absolute inset-0 flex flex-col">
          <HeaderBar title={slide.title} />
          <div className="flex-1 px-6 py-3 overflow-hidden">
            <div className="space-y-1.5">
              {lines.slice(0, 6).map((line, i) => (
                <div key={i} className="flex items-start gap-2.5 p-2 rounded-lg" style={{ background: `${p}05` }}>
                  <div className="flex-shrink-0 w-4 h-4 rounded flex items-center justify-center" style={{ background: p }}>
                    <span style={{ color: a, fontSize: fs(8), fontWeight: 700 }}>{i + 1}</span>
                  </div>
                  <p style={{ fontSize: fs(11), color: "#374151", lineHeight: 1.4, fontFamily: ff }}>{line}</p>
                </div>
              ))}
            </div>
          </div>
          <Footer />
        </div>
      ) : isFinancials ? (
        <div className="absolute inset-0 flex flex-col">
          <HeaderBar title={slide.title} />
          <div className="flex-1 px-5 py-3 overflow-hidden">
            <div className="grid grid-cols-3 gap-2 h-full">
              {lines.slice(0, 6).map((line, i) => {
                const [label, value] = line.includes(":") ? [line.split(":")[0], line.split(":").slice(1).join(":")] : [line, ""];
                return (
                  <div key={i} className="rounded-xl flex flex-col items-center justify-center p-2 text-center"
                    style={{ background: i < 3 ? `${p}08` : `${a}08`, border: `1px solid ${i < 3 ? p : a}20` }}>
                    <div className="w-5 h-0.5 rounded mb-1.5" style={{ background: i < 3 ? p : a }} />
                    {value ? (
                      <>
                        <p style={{ fontSize: fs(13), color: i < 3 ? p : a, fontWeight: 700, fontFamily: ff }}>{value.trim()}</p>
                        <p style={{ fontSize: fs(8), color: "#6b7280", marginTop: "2px", fontFamily: ff }}>{label}</p>
                      </>
                    ) : (
                      <p style={{ fontSize: fs(9), color: p, fontWeight: 600, fontFamily: ff }}>{line}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <Footer />
        </div>
      ) : isTeam ? (
        <div className="absolute inset-0 flex flex-col">
          <HeaderBar title={slide.title} />
          <div className="flex-1 px-5 py-3 overflow-hidden">
            <div className="grid grid-cols-3 gap-2 h-full">
              {lines.slice(0, 3).map((line, i) => {
                const parts = line.split(" — ");
                const name = parts[0] ?? line;
                const role = parts[1] ?? "";
                return (
                  <div key={i} className="rounded-xl flex flex-col items-center justify-center p-3 text-center"
                    style={{ background: `${p}06`, border: `1px solid ${p}15` }}>
                    <div className="rounded-full flex items-center justify-center mb-2 flex-shrink-0"
                      style={{ width: compact ? "22px" : "44px", height: compact ? "22px" : "44px", background: `linear-gradient(135deg, ${p}, ${p}cc)` }}>
                      <span style={{ color: a, fontSize: fs(14), fontWeight: 700 }}>{name.charAt(0)}</span>
                    </div>
                    <p style={{ fontSize: fs(10), color: p, fontWeight: 700, fontFamily: ff }}>{name.split(" ").slice(0, 2).join(" ")}</p>
                    {role && <p style={{ fontSize: fs(8), color: "#6b7280", marginTop: "2px", lineHeight: 1.3, fontFamily: ff }}>{role}</p>}
                  </div>
                );
              })}
            </div>
          </div>
          <Footer />
        </div>
      ) : isTimeline ? (
        <div className="absolute inset-0 flex flex-col">
          <HeaderBar title={slide.title} />
          <div className="flex-1 px-6 py-4 overflow-hidden flex flex-col justify-center">
            <div className="relative">
              <div className="absolute top-3 left-3 right-3 h-0.5" style={{ background: `${p}20` }} />
              <div className="flex justify-between relative gap-1">
                {lines.slice(0, 5).map((line, i) => {
                  const parts = line.split(" — ");
                  const phase = parts[0] ?? `Étape ${i+1}`;
                  const desc = parts[1] ?? line;
                  return (
                    <div key={i} className="flex flex-col items-center flex-1" style={{ maxWidth: compact ? "55px" : "130px" }}>
                      <div className="rounded-full z-10 flex items-center justify-center mb-2"
                        style={{ width: compact ? "14px" : "26px", height: compact ? "14px" : "26px", background: i === 0 ? a : p, flexShrink: 0 }}>
                        <span style={{ color: "white", fontSize: fs(8), fontWeight: 700 }}>{i + 1}</span>
                      </div>
                      <p style={{ fontSize: fs(8), color: p, fontWeight: 700, textAlign: "center", lineHeight: 1.2, fontFamily: ff }}>{phase}</p>
                      <p style={{ fontSize: fs(7), color: "#6b7280", textAlign: "center", marginTop: "2px", lineHeight: 1.2, fontFamily: ff }}>{desc.substring(0, 30)}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <Footer />
        </div>
      ) : isMarket ? (
        <div className="absolute inset-0 flex flex-col">
          <HeaderBar title={slide.title} />
          <div className="flex-1 px-5 py-3 overflow-hidden flex gap-4">
            <div className="flex-1 space-y-1.5">
              {lines.slice(0, 4).map((line, i) => (
                <div key={i} className="flex items-start gap-2 p-2 rounded-lg" style={{ background: `${p}06` }}>
                  <div className="w-1 rounded-full flex-shrink-0 mt-1" style={{ height: compact ? "8px" : "14px", background: a }} />
                  <p style={{ fontSize: fs(10), color: "#374151", lineHeight: 1.4, fontFamily: ff }}>{line}</p>
                </div>
              ))}
            </div>
            <div className="flex-shrink-0 flex flex-col items-center justify-center gap-2" style={{ width: compact ? "60px" : "130px" }}>
              {["TAM", "SAM", "SOM"].map((label, i) => (
                <div key={label} className="rounded-full flex items-center justify-center"
                  style={{ width: compact ? `${44 - i*10}px` : `${100 - i*22}px`, height: compact ? `${44 - i*10}px` : `${100 - i*22}px`, background: i === 0 ? `${p}15` : i === 1 ? `${p}25` : p, border: `2px solid ${p}${i === 2 ? "" : "40"}` }}>
                  <span style={{ color: i === 2 ? "white" : p, fontSize: fs(7), fontWeight: 700 }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
          <Footer />
        </div>
      ) : isCompetition ? (
        <div className="absolute inset-0 flex flex-col">
          <HeaderBar title={slide.title} />
          <div className="flex-1 px-5 py-3 overflow-hidden">
            <div className="grid grid-cols-2 gap-2 h-full">
              {lines.slice(0, 4).map((line, i) => (
                <div key={i} className="rounded-xl p-3 flex items-start gap-2"
                  style={{ background: i === 0 ? `${a}12` : `${p}06`, border: `1px solid ${i === 0 ? a : p}20` }}>
                  <span style={{ fontSize: fs(12), flexShrink: 0 }}>{i === 0 ? "⭐" : i === 1 ? "🏢" : i === 2 ? "🔵" : "🟡"}</span>
                  <p style={{ fontSize: fs(10), color: "#374151", lineHeight: 1.4, fontFamily: ff }}>{line}</p>
                </div>
              ))}
            </div>
          </div>
          <Footer />
        </div>
      ) : isSwot ? (
        <div className="absolute inset-0 flex flex-col">
          <HeaderBar title={slide.title} />
          <div className="flex-1 px-4 py-3 overflow-hidden">
            <div className="grid grid-cols-2 gap-2 h-full">
              {[
                { label: "Forces", color: "#16a34a", bg: "#f0fdf4", icon: "💪" },
                { label: "Faiblesses", color: "#dc2626", bg: "#fef2f2", icon: "⚠️" },
                { label: "Opportunités", color: "#2563eb", bg: "#eff6ff", icon: "🚀" },
                { label: "Menaces", color: "#d97706", bg: "#fffbeb", icon: "🛡" },
              ].map((q, i) => (
                <div key={q.label} className="rounded-xl p-2 flex flex-col" style={{ background: q.bg, border: `1px solid ${q.color}20` }}>
                  <div className="flex items-center gap-1 mb-1">
                    <span style={{ fontSize: fs(10) }}>{q.icon}</span>
                    <p style={{ fontSize: fs(9), color: q.color, fontWeight: 700, fontFamily: ff }}>{q.label}</p>
                  </div>
                  <p style={{ fontSize: fs(8), color: "#374151", lineHeight: 1.4, fontFamily: ff }}>{lines[i] ?? ""}</p>
                </div>
              ))}
            </div>
          </div>
          <Footer />
        </div>
      ) : isValuation ? (
        <div className="absolute inset-0 flex flex-col">
          <HeaderBar title={slide.title} />
          <div className="flex-1 px-5 py-3 overflow-hidden flex flex-col justify-center gap-2">
            {lines.slice(0, 4).map((line, i) => {
              const [label, value] = line.includes(":") ? [line.split(":")[0], line.split(":").slice(1).join(":")] : [line, ""];
              const widths = [85, 70, 55, 40];
              return (
                <div key={i} className="flex items-center gap-3">
                  <p style={{ fontSize: fs(9), color: "#6b7280", width: compact ? "50px" : "120px", flexShrink: 0, fontFamily: ff }}>{label}</p>
                  <div className="flex-1 h-4 rounded-full overflow-hidden" style={{ background: `${p}10` }}>
                    <div className="h-full rounded-full flex items-center justify-end pr-2 transition-all"
                      style={{ width: `${widths[i] ?? 50}%`, background: i === 0 ? p : i === 1 ? a : `${p}80` }}>
                      <span style={{ fontSize: fs(7), color: "white", fontWeight: 700, fontFamily: ff }}>{value.trim()}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <Footer />
        </div>
      ) : isRisk ? (
        <div className="absolute inset-0 flex flex-col">
          <HeaderBar title={slide.title} />
          <div className="flex-1 px-5 py-3 overflow-hidden">
            <div className="space-y-1.5">
              {lines.slice(0, 5).map((line, i) => {
                const [risk, mitigation] = line.includes(" → ") ? line.split(" → ") : [line, ""];
                const levels = ["Élevé", "Moyen", "Faible", "Moyen", "Élevé"];
                const colors = ["#dc2626", "#d97706", "#16a34a", "#d97706", "#dc2626"];
                return (
                  <div key={i} className="flex items-start gap-2 p-2 rounded-lg" style={{ background: `${p}04`, border: `1px solid ${p}10` }}>
                    <span className="px-1.5 py-0.5 rounded text-white flex-shrink-0" style={{ fontSize: fs(7), background: colors[i], fontFamily: ff }}>{levels[i]}</span>
                    <div className="flex-1 min-w-0">
                      <p style={{ fontSize: fs(9), color: "#374151", fontWeight: 600, fontFamily: ff }}>{risk}</p>
                      {mitigation && <p style={{ fontSize: fs(8), color: "#6b7280", fontFamily: ff }}>→ {mitigation}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <Footer />
        </div>
      ) : isEsg ? (
        <div className="absolute inset-0 flex flex-col">
          <HeaderBar title={slide.title} />
          <div className="flex-1 px-5 py-3 overflow-hidden">
            <div className="grid grid-cols-3 gap-2 h-full">
              {[
                { label: "E", full: "Environnemental", color: "#16a34a", bg: "#f0fdf4" },
                { label: "S", full: "Social", color: "#2563eb", bg: "#eff6ff" },
                { label: "G", full: "Gouvernance", color: "#7c3aed", bg: "#f5f3ff" },
              ].map((pillar, i) => (
                <div key={pillar.label} className="rounded-xl p-3 flex flex-col" style={{ background: pillar.bg, border: `1px solid ${pillar.color}20` }}>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center mb-2" style={{ background: pillar.color }}>
                    <span style={{ color: "white", fontSize: fs(10), fontWeight: 800 }}>{pillar.label}</span>
                  </div>
                  <p style={{ fontSize: fs(8), color: pillar.color, fontWeight: 700, marginBottom: "4px", fontFamily: ff }}>{pillar.full}</p>
                  <p style={{ fontSize: fs(8), color: "#374151", lineHeight: 1.4, fontFamily: ff }}>{lines[i] ?? ""}</p>
                </div>
              ))}
            </div>
          </div>
          <Footer />
        </div>
      ) : isSynergies ? (
        <div className="absolute inset-0 flex flex-col">
          <HeaderBar title={slide.title} />
          <div className="flex-1 px-5 py-3 overflow-hidden">
            <div className="grid grid-cols-2 gap-2">
              {lines.slice(0, 4).map((line, i) => {
                const [label, value] = line.includes(":") ? [line.split(":")[0], line.split(":").slice(1).join(":")] : [line, ""];
                const icons = ["💰", "⚙️", "📈", "🔗"];
                return (
                  <div key={i} className="rounded-xl p-3 flex items-start gap-2" style={{ background: i < 2 ? `${p}07` : `${a}08`, border: `1px solid ${i < 2 ? p : a}15` }}>
                    <span style={{ fontSize: fs(14), flexShrink: 0 }}>{icons[i]}</span>
                    <div>
                      <p style={{ fontSize: fs(9), color: "#6b7280", fontFamily: ff }}>{label}</p>
                      {value && <p style={{ fontSize: fs(11), color: i < 2 ? p : a, fontWeight: 700, fontFamily: ff }}>{value.trim()}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <Footer />
        </div>
      ) : isProcess ? (
        <div className="absolute inset-0 flex flex-col">
          <HeaderBar title={slide.title} />
          <div className="flex-1 px-5 py-4 overflow-hidden flex flex-col justify-center">
            <div className="flex items-stretch gap-1">
              {lines.slice(0, 6).map((line, i) => {
                const parts = line.split(" : ");
                const phase = parts[0] ?? `Phase ${i+1}`;
                const desc = parts[1] ?? "";
                return (
                  <div key={i} className="flex-1 flex flex-col items-center">
                    <div className="w-full rounded-t-lg flex items-center justify-center py-2" style={{ background: i === 0 ? a : p }}>
                      <span style={{ color: "white", fontSize: fs(8), fontWeight: 700, textAlign: "center", fontFamily: ff }}>{phase}</span>
                    </div>
                    <div className="w-full flex-1 rounded-b-lg p-1.5" style={{ background: `${p}06`, border: `1px solid ${p}10`, borderTop: "none" }}>
                      <p style={{ fontSize: fs(7), color: "#6b7280", textAlign: "center", lineHeight: 1.3, fontFamily: ff }}>{desc.substring(0, 25)}</p>
                    </div>
                    {i < lines.slice(0, 6).length - 1 && (
                      <div className="absolute" style={{ display: "none" }} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <Footer />
        </div>
      ) : isAppendix ? (
        <div className="absolute inset-0 flex flex-col">
          <HeaderBar title={slide.title} />
          <div className="flex-1 px-6 py-3 overflow-hidden">
            <div className="space-y-1.5">
              {lines.map((line, i) => {
                const [label, value] = line.includes(":") ? [line.split(":")[0], line.split(":").slice(1).join(":")] : [line, ""];
                return (
                  <div key={i} className="flex items-center gap-3 py-1.5 border-b" style={{ borderColor: `${p}10` }}>
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: i % 2 === 0 ? p : a }} />
                    <p style={{ fontSize: fs(10), color: "#374151", flex: 1, fontFamily: ff }}>{label}</p>
                    {value && <p style={{ fontSize: fs(10), color: p, fontWeight: 600, fontFamily: ff }}>{value.trim()}</p>}
                  </div>
                );
              })}
            </div>
          </div>
          <Footer />
        </div>
      ) : (
        <div className="absolute inset-0 flex flex-col">
          <HeaderBar title={slide.title} />
          <div className="flex-1 px-7 py-4 overflow-hidden">
            <ul className="space-y-2">
              {lines.map((line, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span style={{ color: a, fontSize: fs(14), marginTop: "1px", flexShrink: 0 }}>▸</span>
                  <span style={{ fontSize: fs(13), color: "#374151", lineHeight: 1.5, fontFamily: ff }}>{line}</span>
                </li>
              ))}
            </ul>
          </div>
          <Footer />
        </div>
      )}
    </div>
  );
}
