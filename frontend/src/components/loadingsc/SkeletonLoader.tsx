export default function SkeletonLoader() {
  // --border in light mode = oklch(0.922 0 0) → a very soft gray, nearly white
  // --border in dark mode  = oklch(1 0 0 / 10%) → subtle white-alpha on dark bg
  // This gives us bones that feel "white-ish" in light and dark-subtle in dark.
  const boneBg = "var(--border)";

  const Bone = ({
    w = "100%",
    h = 14,
    r = 6,
    mb = 0,
  }: {
    w?: string | number;
    h?: number;
    r?: number;
    mb?: number;
  }) => (
    <div
      style={{
        width: w,
        height: h,
        borderRadius: r,
        marginBottom: mb,
        background: boneBg,
        overflow: "hidden",
        flexShrink: 0,
        position: "relative",
      }}
    >
      <div className="sk-shimmer" />
    </div>
  );

  const Card = ({ children }: { children: React.ReactNode }) => (
    <div
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: 12,
        padding: "1.25rem",
      }}
    >
      {children}
    </div>
  );

  return (
    <div style={{ background: "var(--background)", minHeight: "100vh" }}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "2rem",
          }}
        >
          {/* LEFT col (span 2) */}
          <div
            style={{
              gridColumn: "span 2",
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
            }}
          >
            <Card>
              <div
                style={{
                  display: "flex",
                  gap: 14,
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <Bone w={60} h={60} r={30} />
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                  }}
                >
                  <Bone w="55%" h={18} />
                  <Bone w="38%" h={12} />
                </div>
              </div>
              <Bone h={12} mb={10} />
              <Bone h={12} mb={10} />
              <Bone w="70%" h={12} />
            </Card>

            <Card>
              <Bone w="28%" h={18} mb={14} />
              <Bone h={12} mb={10} />
              <Bone h={12} mb={10} />
              <Bone h={12} mb={10} />
              <Bone w="60%" h={12} />
            </Card>

            <Card>
              <Bone w="32%" h={18} mb={14} />
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {[72, 88, 64, 96, 76, 84, 68, 92, 80, 70].map((w, i) => (
                  <Bone key={i} w={w} h={28} r={20} />
                ))}
              </div>
            </Card>
          </div>

          {/* RIGHT col */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
          >
            <Card>
              <Bone w="42%" h={18} mb={14} />
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: 10,
                    alignItems: "center",
                    marginBottom: 12,
                  }}
                >
                  <Bone w={32} h={32} r={8} />
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      gap: 6,
                    }}
                  >
                    <Bone h={12} w="68%" />
                    <Bone h={10} w="48%" />
                  </div>
                </div>
              ))}
            </Card>

            <Card>
              <Bone w="46%" h={18} mb={14} />
              {[0, 1, 2].map((i) => (
                <div key={i} style={{ marginBottom: 14 }}>
                  <Bone h={13} w="78%" mb={6} />
                  <Bone h={11} w="52%" mb={4} />
                  <Bone h={10} w="38%" />
                </div>
              ))}
            </Card>
          </div>

          {/* Projects (span 2) */}
          <div style={{ gridColumn: "span 2" }}>
            <Card>
              <Bone w="28%" h={18} mb={14} />
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    style={{
                      background: "var(--muted)",
                      borderRadius: 8,
                      padding: "0.75rem",
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                    }}
                  >
                    <Bone h={13} w="82%" />
                    <Bone h={11} />
                    <Bone h={11} w="68%" />
                    <Bone h={26} w={76} r={20} mb={4} />
                  </div>
                ))}
              </div>
            </Card>
          </div>
          {/* CERTIFICATIONS (RIGHT OF PROJECTS) */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
          >
            <Card>
              <Bone w="48%" h={18} mb={14} />

              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div key={i} style={{ marginBottom: 12 }}>
                  <Bone h={13} w="80%" mb={6} />
                  <Bone h={11} w="55%" />
                </div>
              ))}
            </Card>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes sk-sweep {
          0%   { transform: translateX(-150%); }
          100% { transform: translateX(250%); }
        }
        .sk-shimmer {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            transparent 0%,
            var(--background) 50%,
            transparent 100%
          );
          animation: sk-sweep 1.8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
