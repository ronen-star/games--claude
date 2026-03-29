import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Img,
  Series,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// ─────────────────────────────────────────────────────────────
// THEME
// ─────────────────────────────────────────────────────────────
const C = {
  bg: "#000000",
  bgCard: "#0f0f0f",
  border: "rgba(255,255,255,0.06)",
  gold: "#c8a200",
  goldLight: "#f0c420",
  goldDim: "rgba(200,162,0,0.15)",
  white: "#ffffff",
  gray: "#888888",
  grayLight: "#cccccc",
  green: "#22c55e",
  greenDim: "rgba(34,197,94,0.12)",
  yellow: "#f59e0b",
  red: "#ef4444",
  cyan: "#06b6d4",
};
const FONT = `-apple-system, BlinkMacSystemFont, "Segoe UI", "Inter", sans-serif`;

// ─────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────
const REVENUE_DATA = [
  { year: "2019", rev: 743, growth: null },
  { year: "2020", rev: 1092, growth: 47 },
  { year: "2021", rev: 1542, growth: 41 },
  { year: "2022", rev: 1906, growth: 24 },
  { year: "2023", rev: 2229, growth: 17 },
  { year: "2024", rev: 2870, growth: 29 },
  { year: "2025", rev: 4475, growth: 56 },
  { year: "2026E", rev: 7209, growth: 61 },
];

const KPIS = [
  {
    label: "צמיחה מסחרית בארה\"ב",
    value: "+137%",
    sub: "Q4 2025 YoY — שיא כל הזמנים",
    status: "green",
    icon: "▲",
  },
  {
    label: "כלל 40",
    value: "94",
    sub: "הטוב בתעשייה. ממוצע ענף: ~40",
    status: "green",
    icon: "★",
  },
  {
    label: "מספר לקוחות",
    value: "711",
    sub: "Q4 2025 — מונע ע\"י AIP Bootcamp",
    status: "green",
    icon: "◉",
  },
  {
    label: "ערך חוזים כולל (TCV)",
    value: "$2.76B",
    sub: "TTM TCV +151% YoY",
    status: "green",
    icon: "◈",
  },
];

const COMPETITORS: {
  name: string;
  growth: number;
  ps: number;
  highlight: boolean;
  label?: string;
}[] = [
  { name: "PLTR", growth: 56, ps: 78, highlight: true, label: "פלנטיר" },
  { name: "SNOW", growth: 29, ps: 17, highlight: false, label: "סנופלייק" },
  {
    name: "DBRK",
    growth: 50,
    ps: 27,
    highlight: false,
    label: "דאטה-בריקס",
  },
  { name: "C3.AI", growth: 25, ps: 9, highlight: false },
  { name: "IBM", growth: 2, ps: 2.7, highlight: false },
  { name: "MSFT", growth: 13, ps: 11, highlight: false, label: "Azure AI" },
  { name: "NOW", growth: 20, ps: 19, highlight: false, label: "סרוויס-נאו" },
];

const PILLARS = [
  {
    icon: "⬡",
    title: "פלטפורמת AIP",
    desc: "שכבת האינטגרציה הראשונה של LLM לבינה מלאכותית ארגונית מאובטחת. אף מתחרה לא השיג את היתרון האדריכלי הזה.",
    metric: "שוק יעד $1T+ עד 2030",
  },
  {
    icon: "⚡",
    title: "GTM בוטקמפ",
    desc: "סגירת עסקאות בימים, לא חודשים — מודל GTM מהפכני שממיר לידים ארגוניים בקנה מידה.",
    metric: "+342% TCV מסחרי ארה\"ב",
  },
  {
    icon: "⚔",
    title: "DOD / NATO",
    desc: "Maven Smart System + Gotham הבטיחו $1.32B ממשל ארה\"ב ב-FY2025. מתרחבים לביטחון מדינות בריתות.",
    metric: "$1.32B ממשל ארה\"ב FY2025",
  },
];

// ─────────────────────────────────────────────────────────────
// SHARED COMPONENTS
// ─────────────────────────────────────────────────────────────

const GridBackground: React.FC = () => (
  <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none" }}>
    <svg
      width="100%"
      height="100%"
      style={{ position: "absolute", inset: 0 }}
    >
      <defs>
        <pattern
          id="pg"
          width="80"
          height="80"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 80 0 L 0 0 0 80"
            fill="none"
            stroke="rgba(255,255,255,0.025)"
            strokeWidth="1"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#pg)" />
    </svg>
  </AbsoluteFill>
);

const GoldBar: React.FC<{ opacity?: number }> = ({ opacity = 1 }) => (
  <div
    style={{
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      height: 3,
      background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`,
      opacity,
    }}
  />
);

const SlideLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      fontSize: 12,
      letterSpacing: 4,
      color: C.gold,
      textTransform: "uppercase",
      marginBottom: 10,
    }}
  >
    {children}
  </div>
);

// ─────────────────────────────────────────────────────────────
// SLIDE 1 — TITLE
// ─────────────────────────────────────────────────────────────
const PalantirRingLogo: React.FC<{ size: number; progress: number }> = ({
  size,
  progress,
}) => {
  const r = size * 0.42;
  const circumference = 2 * Math.PI * r;
  const dashOffset = circumference * (1 - progress);
  const innerOpacity = interpolate(progress, [0.6, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Outer glow ring */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r + 8}
        fill="none"
        stroke={C.gold}
        strokeWidth={1}
        opacity={0.15 * progress}
      />
      {/* Animated ring */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={C.gold}
        strokeWidth={size * 0.022}
        strokeDasharray={circumference}
        strokeDashoffset={dashOffset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      {/* Center dot */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={size * 0.17}
        fill={C.gold}
        opacity={innerOpacity}
      />
    </svg>
  );
};

const Slide1Title: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoSpring = spring({ frame, fps, config: { damping: 200 } });

  const titleOpacity = interpolate(frame, [25, 55], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
  const titleY = interpolate(frame, [25, 55], [32, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  const lineW = interpolate(frame, [55, 110], [0, 480], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  const subOpacity = interpolate(frame, [70, 100], [0, 1], {
    extrapolateRight: "clamp",
  });
  const tagOpacity = interpolate(frame, [100, 130], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{ background: C.bg, fontFamily: FONT }}
    >
      <GridBackground />

      {/* Ambient gold glow */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "50%",
          transform: "translate(-50%, 0)",
          width: 700,
          height: 700,
          background: `radial-gradient(circle, rgba(200,162,0,0.07) 0%, transparent 65%)`,
          pointerEvents: "none",
        }}
      />

      {/* Center column */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Logo */}
        <div style={{ marginBottom: 36 }}>
          <PalantirRingLogo size={148} progress={logoSpring} />
        </div>

        {/* PALANTIR */}
        <div
          style={{
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            fontSize: 104,
            fontWeight: 800,
            letterSpacing: 28,
            color: C.white,
            textTransform: "uppercase",
            lineHeight: 1,
          }}
        >
          PALANTIR
        </div>

        {/* Gold separator */}
        <div
          style={{
            width: lineW,
            height: 2,
            background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`,
            margin: "28px 0",
          }}
        />

        {/* Sub-headline */}
        <div
          style={{
            opacity: subOpacity,
            fontSize: 20,
            fontWeight: 300,
            letterSpacing: 10,
            color: C.gold,
            textTransform: "uppercase",
          }}
        >
          ניתוח ביצועים FY2025
        </div>

        {/* Tagline */}
        <div
          style={{
            opacity: tagOpacity,
            fontSize: 16,
            fontWeight: 300,
            letterSpacing: 2,
            color: C.gray,
            marginTop: 18,
            textAlign: "center",
            maxWidth: 560,
            lineHeight: 1.6,
          }}
        >
          מערכת ההפעלה של AI לארגון המודרני ולמגזר הביטחון
        </div>
      </AbsoluteFill>

      {/* Stock ticker strip */}
      <div
        style={{
          position: "absolute",
          bottom: 28,
          right: 60,
          opacity: tagOpacity,
          textAlign: "right",
        }}
      >
        <div
          style={{
            fontSize: 13,
            letterSpacing: 3,
            color: C.gray,
            textTransform: "uppercase",
          }}
        >
          NYSE: PLTR &nbsp;·&nbsp; שווי שוק $350B &nbsp;·&nbsp; כלל 40 = 94
        </div>
      </div>

      <GoldBar opacity={tagOpacity} />
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────
// SLIDE 2 — REVENUE GROWTH
// ─────────────────────────────────────────────────────────────
const Slide2Revenue: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerSpring = spring({ frame, fps, config: { damping: 200 } });
  const headerOpacity = interpolate(headerSpring, [0, 0.5], [0, 1]);
  const headerY = interpolate(headerSpring, [0, 1], [-28, 0]);

  const statOpacity = interpolate(frame, [15, 45], [0, 1], {
    extrapolateRight: "clamp",
  });

  const CHART_H = 420;
  const CHART_W = 1620;
  const BAR_W = 150;
  const BAR_GAP = 52;
  const MAX_REV = 8000;
  const chartLeft = (1920 - CHART_W) / 2 + 40;

  return (
    <AbsoluteFill style={{ background: C.bg, fontFamily: FONT }}>
      <GridBackground />

      {/* Header */}
      <div
        style={{
          position: "absolute",
          top: 56,
          left: 100,
          opacity: headerOpacity,
          transform: `translateY(${headerY}px)`,
        }}
      >
        <SlideLabel>ביצועים פיננסיים</SlideLabel>
        <div
          style={{
            fontSize: 60,
            fontWeight: 800,
            color: C.white,
            lineHeight: 1.05,
          }}
        >
          מסלול ההכנסות
        </div>
        <div style={{ fontSize: 17, color: C.gray, marginTop: 8 }}>
          2019 – 2026E &nbsp;(מיליוני דולר)
        </div>
      </div>

      {/* Right-side stats */}
      <div
        style={{
          position: "absolute",
          top: 64,
          right: 100,
          textAlign: "right",
          opacity: statOpacity,
        }}
      >
        <div style={{ fontSize: 52, fontWeight: 800, color: C.gold }}>
          $4.475B
        </div>
        <div
          style={{
            fontSize: 13,
            letterSpacing: 3,
            color: C.gray,
            textTransform: "uppercase",
          }}
        >
          הכנסות FY2025
        </div>
        <div
          style={{
            fontSize: 34,
            fontWeight: 700,
            color: C.green,
            marginTop: 10,
          }}
        >
          +56% YoY
        </div>
        <div
          style={{
            fontSize: 16,
            color: C.gray,
            marginTop: 6,
          }}
        >
          תחזית FY2026: $7.2B (+61%)
        </div>
      </div>

      {/* Bar chart */}
      <div
        style={{
          position: "absolute",
          bottom: 72,
          left: chartLeft,
          width: CHART_W,
          height: CHART_H + 60,
        }}
      >
        {/* Y-axis grid lines */}
        {[0, 25, 50, 75, 100].map((pct) => {
          const y = CHART_H * (1 - pct / 100);
          const val = Math.round((MAX_REV * pct) / 100 / 1000);
          return (
            <div
              key={pct}
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: y,
                borderTop: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  left: -52,
                  top: -10,
                  fontSize: 12,
                  color: C.gray,
                }}
              >
                ${val}B
              </span>
            </div>
          );
        })}

        {/* Bars */}
        {REVENUE_DATA.map((d, i) => {
          const barSpring = spring({
            frame: frame - i * 7,
            fps,
            config: { damping: 200 },
          });
          const barH = interpolate(
            barSpring,
            [0, 1],
            [0, CHART_H * (d.rev / MAX_REV)]
          );
          const barOpacity = interpolate(barSpring, [0, 0.3], [0, 1], {
            extrapolateRight: "clamp",
          });

          const isHighlight = d.year === "2025";
          const isProjected = d.year.includes("E");
          const x = i * (BAR_W + BAR_GAP);

          const barColor = isHighlight
            ? `linear-gradient(180deg, ${C.goldLight} 0%, ${C.gold} 60%, rgba(200,162,0,0.5) 100%)`
            : isProjected
            ? `linear-gradient(180deg, rgba(200,162,0,0.5) 0%, rgba(200,162,0,0.15) 100%)`
            : `linear-gradient(180deg, #3b4a6b 0%, #1e2a40 100%)`;

          const borderStyle = isHighlight
            ? `1px solid ${C.gold}`
            : isProjected
            ? `1px dashed rgba(200,162,0,0.4)`
            : "1px solid #2a3a55";

          return (
            <div
              key={d.year}
              style={{
                position: "absolute",
                left: x,
                bottom: 44,
                width: BAR_W,
              }}
            >
              {/* Bar body */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: barH,
                  background: barColor,
                  border: borderStyle,
                  borderRadius: "4px 4px 0 0",
                  opacity: barOpacity,
                }}
              />

              {/* Revenue label */}
              <div
                style={{
                  position: "absolute",
                  bottom: barH + 10,
                  left: 0,
                  right: 0,
                  textAlign: "center",
                  fontSize: 14,
                  fontWeight: 700,
                  color: isHighlight
                    ? C.gold
                    : isProjected
                    ? "rgba(200,162,0,0.75)"
                    : C.grayLight,
                  opacity: barOpacity,
                }}
              >
                ${(d.rev / 1000).toFixed(1)}B
              </div>

              {/* Growth % label */}
              {d.growth !== null && (
                <div
                  style={{
                    position: "absolute",
                    bottom: barH + 32,
                    left: 0,
                    right: 0,
                    textAlign: "center",
                    fontSize: 12,
                    color: d.growth >= 50 ? C.green : C.gray,
                    opacity: barOpacity,
                  }}
                >
                  +{d.growth}%
                </div>
              )}

              {/* Year label */}
              <div
                style={{
                  position: "absolute",
                  bottom: -32,
                  left: 0,
                  right: 0,
                  textAlign: "center",
                  fontSize: 13,
                  color: isHighlight
                    ? C.gold
                    : isProjected
                    ? "rgba(200,162,0,0.7)"
                    : C.gray,
                  fontWeight: isHighlight ? 700 : 400,
                  opacity: barOpacity,
                }}
              >
                {d.year}
              </div>
            </div>
          );
        })}
      </div>

      <GoldBar />
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────
// SLIDE 3 — KPI DASHBOARD
// ─────────────────────────────────────────────────────────────
const Slide3KPIs: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerSpring = spring({ frame, fps, config: { damping: 200 } });

  const STATUS = {
    green: C.green,
    yellow: C.yellow,
    red: C.red,
  };

  return (
    <AbsoluteFill style={{ background: C.bg, fontFamily: FONT }}>
      <GridBackground />

      {/* Header */}
      <div
        style={{
          position: "absolute",
          top: 56,
          left: 100,
          opacity: interpolate(headerSpring, [0, 0.5], [0, 1]),
          transform: `translateY(${interpolate(headerSpring, [0, 1], [-24, 0])}px)`,
        }}
      >
        <SlideLabel>מצוינות תפעולית</SlideLabel>
        <div
          style={{
            fontSize: 60,
            fontWeight: 800,
            color: C.white,
            lineHeight: 1.05,
          }}
        >
          לוח מחוונים KPI
        </div>
        <div style={{ fontSize: 17, color: C.gray, marginTop: 8 }}>
          FY2025 / Q4 2025
        </div>
      </div>

      {/* Health score badge */}
      <div
        style={{
          position: "absolute",
          top: 68,
          right: 100,
          background: C.greenDim,
          border: "1px solid rgba(34,197,94,0.25)",
          borderRadius: 14,
          padding: "14px 28px",
          textAlign: "right",
          opacity: interpolate(frame, [15, 45], [0, 1], {
            extrapolateRight: "clamp",
          }),
        }}
      >
        <div
          style={{
            fontSize: 12,
            letterSpacing: 3,
            color: C.gray,
            textTransform: "uppercase",
          }}
        >
          בריאות הפורטפוליו
        </div>
        <div
          style={{
            fontSize: 52,
            fontWeight: 800,
            color: C.green,
            lineHeight: 1,
          }}
        >
          62.5%
        </div>
        <div style={{ fontSize: 13, color: C.gray, marginTop: 4 }}>
          5 ירוק · 2 צהוב · 1 אדום
        </div>
      </div>

      {/* KPI cards 2×2 grid */}
      <div
        style={{
          position: "absolute",
          top: 230,
          left: 100,
          right: 100,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 28,
        }}
      >
        {KPIS.map((kpi, i) => {
          const cardSpring = spring({
            frame: frame - i * 16,
            fps,
            config: { damping: 200 },
          });
          const opacity = interpolate(cardSpring, [0, 0.4], [0, 1], {
            extrapolateRight: "clamp",
          });
          const translateY = interpolate(cardSpring, [0, 1], [44, 0]);
          const color = STATUS[kpi.status as keyof typeof STATUS];

          return (
            <div
              key={i}
              style={{
                opacity,
                transform: `translateY(${translateY}px)`,
                background: C.bgCard,
                border: C.border,
                borderLeft: `3px solid ${color}`,
                borderRadius: 14,
                padding: "34px 40px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Glow */}
              <div
                style={{
                  position: "absolute",
                  top: -50,
                  right: -50,
                  width: 180,
                  height: 180,
                  background: `radial-gradient(circle, ${color}0a 0%, transparent 70%)`,
                  pointerEvents: "none",
                }}
              />

              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 12,
                      letterSpacing: 3,
                      color: C.gray,
                      textTransform: "uppercase",
                      marginBottom: 14,
                    }}
                  >
                    {kpi.label}
                  </div>
                  <div
                    style={{
                      fontSize: 68,
                      fontWeight: 800,
                      color,
                      lineHeight: 1,
                    }}
                  >
                    {kpi.value}
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      color: C.gray,
                      marginTop: 10,
                    }}
                  >
                    {kpi.sub}
                  </div>
                </div>
                <div
                  style={{
                    fontSize: 44,
                    color: `${color}33`,
                    marginTop: 4,
                    lineHeight: 1,
                  }}
                >
                  {kpi.icon}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <GoldBar />
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────
// SLIDE 4 — COMPETITIVE MAP
// ─────────────────────────────────────────────────────────────
const Slide4Competitive: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerSpring = spring({ frame, fps, config: { damping: 200 } });

  // Chart coordinate space
  const CX = 220;   // chart left x
  const CY = 200;   // chart top y
  const CW = 1440;  // chart width
  const CH = 680;   // chart height
  const MAX_G = 70; // max growth %
  const MAX_P = 90; // max P/S

  const scaleX = (g: number) => CX + (g / MAX_G) * CW;
  const scaleY = (p: number) => CY + CH - (p / MAX_P) * CH;

  return (
    <AbsoluteFill style={{ background: C.bg, fontFamily: FONT }}>
      <GridBackground />

      {/* Header */}
      <div
        style={{
          position: "absolute",
          top: 48,
          left: 100,
          opacity: interpolate(headerSpring, [0, 0.5], [0, 1]),
          transform: `translateY(${interpolate(headerSpring, [0, 1], [-24, 0])}px)`,
        }}
      >
        <SlideLabel>ניתוח שוק</SlideLabel>
        <div
          style={{
            fontSize: 52,
            fontWeight: 800,
            color: C.white,
            lineHeight: 1.05,
          }}
        >
          מיצוב תחרותי
        </div>
        <div style={{ fontSize: 16, color: C.gray, marginTop: 8 }}>
          צמיחת הכנסות YoY (%) מול יחס מחיר/מכירות — FY2025
        </div>
      </div>

      {/* SVG scatter plot */}
      <svg
        style={{ position: "absolute", top: 0, left: 0, overflow: "visible" }}
        width={1920}
        height={1080}
      >
        {/* Axis lines */}
        <line
          x1={CX}
          y1={CY}
          x2={CX}
          y2={CY + CH}
          stroke="rgba(255,255,255,0.15)"
          strokeWidth={1}
        />
        <line
          x1={CX}
          y1={CY + CH}
          x2={CX + CW}
          y2={CY + CH}
          stroke="rgba(255,255,255,0.15)"
          strokeWidth={1}
        />

        {/* X-axis ticks */}
        {[0, 20, 40, 60].map((g) => (
          <g key={g}>
            <line
              x1={scaleX(g)}
              y1={CY}
              x2={scaleX(g)}
              y2={CY + CH}
              stroke="rgba(255,255,255,0.04)"
              strokeWidth={1}
            />
            <text
              x={scaleX(g)}
              y={CY + CH + 32}
              textAnchor="middle"
              fill="rgba(255,255,255,0.4)"
              fontSize={14}
              fontFamily={FONT}
            >
              {g}%
            </text>
          </g>
        ))}

        {/* Y-axis ticks */}
        {[0, 20, 40, 60, 80].map((p) => (
          <g key={p}>
            <line
              x1={CX}
              y1={scaleY(p)}
              x2={CX + CW}
              y2={scaleY(p)}
              stroke="rgba(255,255,255,0.04)"
              strokeWidth={1}
            />
            <text
              x={CX - 18}
              y={scaleY(p) + 5}
              textAnchor="end"
              fill="rgba(255,255,255,0.4)"
              fontSize={14}
              fontFamily={FONT}
            >
              {p}x
            </text>
          </g>
        ))}

        {/* Axis labels */}
        <text
          x={CX + CW / 2}
          y={CY + CH + 64}
          textAnchor="middle"
          fill="rgba(255,255,255,0.45)"
          fontSize={15}
          fontFamily={FONT}
        >
          צמיחת הכנסות YoY (%)
        </text>
        <text
          x={CX - 72}
          y={CY + CH / 2}
          textAnchor="middle"
          fill="rgba(255,255,255,0.45)"
          fontSize={15}
          fontFamily={FONT}
          transform={`rotate(-90, ${CX - 72}, ${CY + CH / 2})`}
        >
          יחס מחיר / מכירות (x)
        </text>

        {/* Company dots */}
        {COMPETITORS.map((co, i) => {
          const dotSpring = spring({
            frame: frame - 20 - i * 10,
            fps,
            config: { damping: 200 },
          });
          const scale = interpolate(dotSpring, [0, 1], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const opacity = interpolate(dotSpring, [0, 0.35], [0, 1], {
            extrapolateRight: "clamp",
          });

          const cx = scaleX(co.growth);
          const cy = scaleY(co.ps);
          const r = co.highlight ? 22 : 13;

          return (
            <g
              key={co.name}
              opacity={opacity}
              transform={`translate(${cx} ${cy}) scale(${scale}) translate(${-cx} ${-cy})`}
            >
              {co.highlight && (
                <circle
                  cx={cx}
                  cy={cy}
                  r={r + 14}
                  fill="none"
                  stroke={C.gold}
                  strokeWidth={1}
                  strokeDasharray="5 4"
                  opacity={0.5}
                />
              )}
              <circle
                cx={cx}
                cy={cy}
                r={r}
                fill={co.highlight ? C.gold : "rgba(255,255,255,0.12)"}
                stroke={co.highlight ? C.goldLight : "rgba(255,255,255,0.4)"}
                strokeWidth={co.highlight ? 0 : 1.5}
              />
              {/* Ticker label */}
              <text
                x={cx}
                y={cy - r - 10}
                textAnchor="middle"
                fill={co.highlight ? C.gold : "rgba(255,255,255,0.65)"}
                fontSize={co.highlight ? 15 : 13}
                fontWeight={co.highlight ? 800 : 400}
                fontFamily={FONT}
              >
                {co.name}
              </text>
              {/* Sub-label for non-highlighted */}
              {co.label && !co.highlight && (
                <text
                  x={cx}
                  y={cy - r - 26}
                  textAnchor="middle"
                  fill="rgba(255,255,255,0.35)"
                  fontSize={11}
                  fontFamily={FONT}
                >
                  {co.label}
                </text>
              )}
              {/* PLTR annotation */}
              {co.highlight && (
                <text
                  x={cx}
                  y={cy + r + 26}
                  textAnchor="middle"
                  fill={C.gold}
                  fontSize={13}
                  opacity={0.85}
                  fontFamily={FONT}
                >
                  P/S: {co.ps}x · Growth: +{co.growth}%
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Insight callout */}
      <div
        style={{
          position: "absolute",
          bottom: 36,
          right: 100,
          background: C.goldDim,
          border: `1px solid rgba(200,162,0,0.3)`,
          borderRadius: 14,
          padding: "18px 28px",
          maxWidth: 400,
          opacity: interpolate(frame, [70, 100], [0, 1], {
            extrapolateRight: "clamp",
          }),
        }}
      >
        <div
          style={{
            fontSize: 12,
            letterSpacing: 3,
            color: C.gold,
            textTransform: "uppercase",
            marginBottom: 8,
          }}
        >
          היתרון של פלנטיר
        </div>
        <div
          style={{
            fontSize: 14,
            color: C.grayLight,
            lineHeight: 1.6,
          }}
        >
          החברה היחידה המשלבת צמיחה +50% עם מרווח גולמי 80%+{" "}
          <em>ורווחיות GAAP</em> בקנה מידה.
        </div>
      </div>

      <GoldBar />
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────
// SLIDE 5 — GROWTH ENGINE / OUTLOOK
// ─────────────────────────────────────────────────────────────
const Slide5Outlook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerSpring = spring({ frame, fps, config: { damping: 200 } });

  const bottomOpacity = interpolate(frame, [90, 120], [0, 1], {
    extrapolateRight: "clamp",
  });

  const BOTTOM_STATS = [
    { label: "כלל 40", value: "94", color: C.green },
    { label: "מרווח גולמי", value: "80%", color: C.green },
    { label: "מזומנים", value: "$4.5B", color: C.gold },
    { label: "מרווח נקי (GAAP)", value: "13.6%", color: C.yellow },
  ];

  return (
    <AbsoluteFill style={{ background: C.bg, fontFamily: FONT }}>
      <GridBackground />

      {/* Ambient glow from below */}
      <div
        style={{
          position: "absolute",
          bottom: -180,
          left: "50%",
          transform: "translateX(-50%)",
          width: 1400,
          height: 700,
          background: `radial-gradient(ellipse, rgba(200,162,0,0.05) 0%, transparent 65%)`,
          pointerEvents: "none",
        }}
      />

      {/* Header — centred */}
      <div
        style={{
          position: "absolute",
          top: 52,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          opacity: interpolate(headerSpring, [0, 0.5], [0, 1]),
          transform: `translateY(${interpolate(headerSpring, [0, 1], [-24, 0])}px)`,
        }}
      >
        <SlideLabel>תחזית אסטרטגית</SlideLabel>
        <div
          style={{
            fontSize: 68,
            fontWeight: 800,
            color: C.white,
            lineHeight: 1.05,
            textAlign: "center",
          }}
        >
          מנוע הצמיחה של AIP
        </div>

        {/* FY2026 guidance pill */}
        <div
          style={{
            marginTop: 20,
            background: C.greenDim,
            border: "1px solid rgba(34,197,94,0.3)",
            borderRadius: 10,
            padding: "10px 28px",
            fontSize: 18,
            fontWeight: 700,
            color: C.green,
          }}
        >
          תחזית FY2026: הכנסות $7.2B &nbsp;(+61% YoY)
        </div>
      </div>

      {/* Three pillar cards */}
      <div
        style={{
          position: "absolute",
          top: 268,
          left: 80,
          right: 80,
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 28,
        }}
      >
        {PILLARS.map((pillar, i) => {
          const cardSpring = spring({
            frame: frame - 20 - i * 20,
            fps,
            config: { damping: 200 },
          });
          const opacity = interpolate(cardSpring, [0, 0.4], [0, 1], {
            extrapolateRight: "clamp",
          });
          const translateY = interpolate(cardSpring, [0, 1], [50, 0]);

          return (
            <div
              key={i}
              style={{
                opacity,
                transform: `translateY(${translateY}px)`,
                background: C.bgCard,
                border: "1px solid rgba(255,255,255,0.06)",
                borderTop: `2px solid ${C.gold}`,
                borderRadius: 14,
                padding: "36px 32px",
                textAlign: "center",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Top glow */}
              <div
                style={{
                  position: "absolute",
                  top: -30,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 220,
                  height: 160,
                  background: `radial-gradient(circle, rgba(200,162,0,0.06) 0%, transparent 70%)`,
                  pointerEvents: "none",
                }}
              />

              <div
                style={{
                  fontSize: 52,
                  marginBottom: 20,
                  color: C.gold,
                  lineHeight: 1,
                }}
              >
                {pillar.icon}
              </div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 800,
                  letterSpacing: 4,
                  color: C.gold,
                  textTransform: "uppercase",
                  marginBottom: 18,
                }}
              >
                {pillar.title}
              </div>
              <div
                style={{
                  fontSize: 15,
                  color: C.gray,
                  lineHeight: 1.65,
                  marginBottom: 24,
                }}
              >
                {pillar.desc}
              </div>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: C.white,
                  background: C.goldDim,
                  border: `1px solid rgba(200,162,0,0.2)`,
                  borderRadius: 8,
                  padding: "10px 18px",
                }}
              >
                {pillar.metric}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom stats strip */}
      <div
        style={{
          position: "absolute",
          bottom: 32,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          gap: 60,
          opacity: bottomOpacity,
        }}
      >
        {BOTTOM_STATS.map((s) => (
          <div key={s.label} style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: 30,
                fontWeight: 800,
                color: s.color,
                lineHeight: 1,
              }}
            >
              {s.value}
            </div>
            <div
              style={{
                fontSize: 11,
                letterSpacing: 2,
                color: C.gray,
                textTransform: "uppercase",
                marginTop: 6,
              }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>

      <GoldBar opacity={bottomOpacity} />
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────
// MAIN COMPOSITION
// ─────────────────────────────────────────────────────────────
const SLIDE_DURATION = 180; // 6s @ 30fps

// ─────────────────────────────────────────────────────────────
// IMAGE SLIDE — reusable component for document previews
// ─────────────────────────────────────────────────────────────
const SlideImage: React.FC<{
  file: string;
  title: string;
  label: string;
}> = ({ file, title, label }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerSpring = spring({ frame, fps, config: { damping: 200 } });
  const headerOpacity = interpolate(headerSpring, [0, 0.5], [0, 1]);
  const headerY = interpolate(headerSpring, [0, 1], [-24, 0]);

  const imgSpring = spring({ frame: frame - 10, fps, config: { damping: 200 } });
  const imgOpacity = interpolate(imgSpring, [0, 0.4], [0, 1], {
    extrapolateRight: "clamp",
  });
  // Subtle zoom-in reveal: starts slightly zoomed, settles to full
  const imgScale = interpolate(imgSpring, [0, 1], [1.04, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: C.bg, fontFamily: FONT }}>
      <GridBackground />

      {/* Header */}
      <div
        style={{
          position: "absolute",
          top: 40,
          left: 100,
          opacity: headerOpacity,
          transform: `translateY(${headerY}px)`,
        }}
      >
        <SlideLabel>{label}</SlideLabel>
        <div
          style={{
            fontSize: 44,
            fontWeight: 800,
            color: C.white,
            lineHeight: 1.1,
          }}
        >
          {title}
        </div>
      </div>

      {/* Image frame */}
      <div
        style={{
          position: "absolute",
          top: 148,
          left: 80,
          right: 80,
          bottom: 36,
          opacity: imgOpacity,
          transform: `scale(${imgScale})`,
          transformOrigin: "center center",
          borderRadius: 16,
          border: `1px solid rgba(200,162,0,0.25)`,
          overflow: "hidden",
          boxShadow: `0 0 60px rgba(200,162,0,0.08), 0 0 120px rgba(0,0,0,0.8)`,
        }}
      >
        <Img
          src={staticFile(file)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            background: "#fff",
          }}
        />
      </div>

      <GoldBar />
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────
// DOCUMENT SLIDES
// ─────────────────────────────────────────────────────────────
const SlideKPIDashboard: React.FC = () => (
  <SlideImage
    file="kpi-dashboard.png"
    title="לוח מחוונים — מדדי ביצוע"
    label="דשבורד פיננסי"
  />
);

const SlideCompetitiveMap: React.FC = () => (
  <SlideImage
    file="competitive-map.png"
    title="מפת המתחרים"
    label="מיפוי תחרותי"
  />
);

const SlideGrowthEngine: React.FC = () => (
  <SlideImage
    file="growth-engine.png"
    title="מנוע הצמיחה"
    label="תרשים אסטרטגי"
  />
);

// ─────────────────────────────────────────────────────────────
// BACKGROUND MUSIC
// ─────────────────────────────────────────────────────────────
const BackgroundMusic: React.FC = () => {
  const { durationInFrames, fps } = useVideoConfig();
  const FADE = fps * 1.5; // 1.5s fade in / out

  return (
    <Audio
      src={staticFile("music.mp3")}
      loop
      volume={(f) => {
        // Fade in
        if (f < FADE) return interpolate(f, [0, FADE], [0, 0.35]);
        // Fade out
        if (f > durationInFrames - FADE)
          return interpolate(f, [durationInFrames - FADE, durationInFrames], [0.35, 0]);
        return 0.35;
      }}
    />
  );
};

// ─────────────────────────────────────────────────────────────
// MAIN COMPOSITION  (8 slides, 48 sec total)
// ─────────────────────────────────────────────────────────────
export const PalantirPresentation: React.FC = () => {
  return (
    <AbsoluteFill>
      <BackgroundMusic />
      <Series>
        {/* 1 — כותרת */}
        <Series.Sequence durationInFrames={SLIDE_DURATION} premountFor={30}>
          <Slide1Title />
        </Series.Sequence>
        {/* 2 — הכנסות */}
        <Series.Sequence durationInFrames={SLIDE_DURATION} premountFor={30}>
          <Slide2Revenue />
        </Series.Sequence>
        {/* 3 — KPI אנימציה */}
        <Series.Sequence durationInFrames={SLIDE_DURATION} premountFor={30}>
          <Slide3KPIs />
        </Series.Sequence>
        {/* 4 — לוח מחוונים (קובץ) */}
        <Series.Sequence durationInFrames={SLIDE_DURATION} premountFor={30}>
          <SlideKPIDashboard />
        </Series.Sequence>
        {/* 5 — מיצוב תחרותי אנימציה */}
        <Series.Sequence durationInFrames={SLIDE_DURATION} premountFor={30}>
          <Slide4Competitive />
        </Series.Sequence>
        {/* 6 — מפת המתחרים (קובץ) */}
        <Series.Sequence durationInFrames={SLIDE_DURATION} premountFor={30}>
          <SlideCompetitiveMap />
        </Series.Sequence>
        {/* 7 — מנוע צמיחה אנימציה */}
        <Series.Sequence durationInFrames={SLIDE_DURATION} premountFor={30}>
          <Slide5Outlook />
        </Series.Sequence>
        {/* 8 — תרשים מנוע צמיחה (קובץ) */}
        <Series.Sequence durationInFrames={SLIDE_DURATION} premountFor={30}>
          <SlideGrowthEngine />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
