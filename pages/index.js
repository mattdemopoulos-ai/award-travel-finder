import { useMemo, useRef, useState, useEffect } from "react";
import { cities } from "../data/cities";

const rewardsPrograms = [
  { name: "American AAdvantage", alliance: "oneworld", url: "https://www.aa.com/" },
  { name: "Alaska Mileage Plan", alliance: "oneworld", url: "https://www.alaskaair.com/" },
  { name: "United MileagePlus", alliance: "Star Alliance", url: "https://www.united.com/" },
  { name: "Delta SkyMiles", alliance: "SkyTeam", url: "https://www.delta.com/" },
  { name: "Air Canada Aeroplan", alliance: "Star Alliance", url: "https://www.aircanada.com/" },
  { name: "Flying Blue", alliance: "SkyTeam", url: "https://www.flyingblue.com/" },
  { name: "British Airways Executive Club", alliance: "oneworld", url: "https://www.britishairways.com/" },
  { name: "Iberia Plus", alliance: "oneworld", url: "https://www.iberia.com/" },
  { name: "Qatar Airways Privilege Club", alliance: "oneworld", url: "https://www.qatarairways.com/" },
  { name: "Avianca LifeMiles", alliance: "Star Alliance", url: "https://www.lifemiles.com/" }
];

function formatCityLabel(cityObj) {
  return `${cityObj.city} (${cityObj.airport})`;
}

function parseAirport(input) {
  const match = input.match(/\(([A-Z]{3})\)/);
  return match ? match[1] : "";
}

function generateMockResults(fromAirport, toAirport, date) {
  if (!fromAirport || !toAirport || !date || fromAirport === toAirport) return [];

  const seed = (fromAirport + toAirport + date)
    .split("")
    .reduce((sum, ch) => sum + ch.charCodeAt(0), 0);

  return rewardsPrograms.map((program, i) => {
    const cash = 220 + ((seed + i * 41) % 950);
    const miles = 12000 + ((seed + i * 5300) % 90000);
    const cpp = ((cash * 100) / miles).toFixed(1);
    const duration = 6 + ((seed + i * 3) % 10);
    const stops = (seed + i) % 3;

    return {
      program: program.name,
      alliance: program.alliance,
      cash,
      miles,
      cpp: Number(cpp),
      duration: `${duration}h ${((seed + i * 17) % 60).toString().padStart(2, "0")}m`,
      stops,
      url: program.url
    };
  });
}

function Pill({ children, active }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "6px 10px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 700,
        background: active ? "#dbeafe" : "#f1f5f9",
        color: active ? "#1d4ed8" : "#475569"
      }}
    >
      {children}
    </span>
  );
}

function StatCard({ label, value, subvalue }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.88)",
        border: "1px solid #e2e8f0",
        borderRadius: 18,
        padding: 18,
        boxShadow: "0 8px 24px rgba(15,23,42,0.04)"
      }}
    >
      <div style={{ fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5 }}>
        {label}
      </div>
      <div style={{ fontSize: 26, fontWeight: 800, color: "#0f172a", marginTop: 8 }}>
        {value}
      </div>
      {subvalue ? (
        <div style={{ fontSize: 13, color: "#64748b", marginTop: 6 }}>
          {subvalue}
        </div>
      ) : null}
    </div>
  );
}

function AirportAutocomplete({ label, value, onChange, excludeAirport }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCities = useMemo(() => {
    const q = value.toLowerCase().trim();
    return cities
      .filter((c) => c.airport !== excludeAirport)
      .filter((c) => {
        if (!q) return true;
        return (
          c.city.toLowerCase().includes(q) ||
          c.airport.toLowerCase().includes(q) ||
          c.region.toLowerCase().includes(q)
        );
      })
      .slice(0, 8);
  }, [value, excludeAirport]);

  return (
    <div ref={wrapRef} style={{ position: "relative" }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: "#475569", marginBottom: 8 }}>
        {label}
      </div>
      <input
        value={value}
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        placeholder="Search city or airport"
        style={{
          width: "100%",
          padding: "15px 16px",
          borderRadius: 14,
          border: "1px solid #dbe3ee",
          fontSize: 16,
          background: "#fff",
          outline: "none",
          boxSizing: "border-box"
        }}
      />
      {open && filteredCities.length > 0 && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            left: 0,
            right: 0,
            background: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: 16,
            boxShadow: "0 16px 40px rgba(15,23,42,0.12)",
            overflow: "hidden",
            zIndex: 50
          }}
        >
          {filteredCities.map((c) => (
            <button
              key={`${label}-${c.airport}`}
              type="button"
              onClick={() => {
                onChange(formatCityLabel(c));
                setOpen(false);
              }}
              style={{
                width: "100%",
                textAlign: "left",
                border: "none",
                background: "#fff",
                padding: "12px 14px",
                cursor: "pointer",
                borderBottom: "1px solid #f1f5f9"
              }}
            >
              <div style={{ fontWeight: 700, color: "#0f172a" }}>
                {c.city} <span style={{ color: "#64748b" }}>({c.airport})</span>
              </div>
              <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{c.region}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const [fromInput, setFromInput] = useState("Medellin (MDE)");
  const [toInput, setToInput] = useState("Madrid (MAD)");
  const [date, setDate] = useState("");
  const [searched, setSearched] = useState(false);

  const [allianceFilter, setAllianceFilter] = useState("All");
  const [programFilter, setProgramFilter] = useState("All");
  const [sortBy, setSortBy] = useState("best");

  const fromAirport = parseAirport(fromInput);
  const toAirport = parseAirport(toInput);

  const results = useMemo(() => {
    if (!searched) return [];

    let output = generateMockResults(fromAirport, toAirport, date);

    if (allianceFilter !== "All") {
      output = output.filter((r) => r.alliance === allianceFilter);
    }

    if (programFilter !== "All") {
      output = output.filter((r) => r.program === programFilter);
    }

    output = [...output].sort((a, b) => {
      if (sortBy === "lowestMiles") return a.miles - b.miles;
      if (sortBy === "lowestCash") return a.cash - b.cash;
      return b.cpp - a.cpp;
    });

    return output;
  }, [fromAirport, toAirport, date, searched, allianceFilter, programFilter, sortBy]);

  const bestResult = results.length > 0 ? results[0] : null;

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left, #dbeafe 0%, #eff6ff 28%, #f8fafc 58%, #ffffff 100%)",
        fontFamily: "Inter, system-ui, sans-serif",
        padding: "32px 20px 60px"
      }}
    >
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "1.3fr 0.9fr",
            gap: 20,
            alignItems: "stretch",
            marginBottom: 24
          }}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 55%, #2563eb 100%)",
              color: "#fff",
              borderRadius: 28,
              padding: 32,
              boxShadow: "0 24px 60px rgba(30,64,175,0.20)"
            }}
          >
            <div
              style={{
                display: "inline-block",
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: 0.7,
                textTransform: "uppercase",
                background: "rgba(255,255,255,0.14)",
                border: "1px solid rgba(255,255,255,0.18)",
                padding: "8px 12px",
                borderRadius: 999
              }}
            >
              Award Travel Search
            </div>

            <h1 style={{ fontSize: 48, lineHeight: 1.04, margin: "18px 0 14px", fontWeight: 900 }}>
              Find the best points deal in seconds
            </h1>

            <p style={{ fontSize: 18, lineHeight: 1.6, color: "rgba(255,255,255,0.86)", maxWidth: 680, margin: 0 }}>
              Compare miles, cash, value per point, and booking options across major loyalty programs in one clean view.
            </p>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 22 }}>
              <Pill active>Live-style UI</Pill>
              <Pill active>Value ranking</Pill>
              <Pill active>Program filters</Pill>
            </div>
          </div>

          <div
            style={{
              background: "rgba(255,255,255,0.92)",
              border: "1px solid #dbe7ff",
              borderRadius: 28,
              padding: 24,
              boxShadow: "0 16px 40px rgba(15,23,42,0.06)"
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 800, color: "#2563eb", textTransform: "uppercase", letterSpacing: 0.5 }}>
              Search Snapshot
            </div>
            <div style={{ marginTop: 16, display: "grid", gap: 16 }}>
              <StatCard label="From" value={fromAirport || "—"} subvalue={fromInput} />
              <StatCard label="To" value={toAirport || "—"} subvalue={toInput} />
              <StatCard label="Date" value={date || "Select"} subvalue="Choose a travel date to rank options" />
            </div>
          </div>
        </section>

        <section
          style={{
            background: "rgba(255,255,255,0.92)",
            border: "1px solid #dbe7ff",
            borderRadius: 28,
            padding: 22,
            boxShadow: "0 18px 50px rgba(37,99,235,0.08)",
            marginBottom: 24
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.15fr 1.15fr 0.9fr auto",
              gap: 14,
              marginBottom: 16
            }}
          >
            <AirportAutocomplete
              label="From"
              value={fromInput}
              onChange={setFromInput}
              excludeAirport={toAirport}
            />
            <AirportAutocomplete
              label="To"
              value={toInput}
              onChange={setToInput}
              excludeAirport={fromAirport}
            />
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#475569", marginBottom: 8 }}>Date</div>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={{
                  width: "100%",
                  padding: "15px 16px",
                  borderRadius: 14,
                  border: "1px solid #dbe3ee",
                  fontSize: 16,
                  background: "#fff",
                  boxSizing: "border-box"
                }}
              />
            </div>
            <div style={{ display: "flex", alignItems: "end" }}>
              <button
                onClick={() => setSearched(true)}
                style={{
                  width: "100%",
                  padding: "15px 20px",
                  borderRadius: 14,
                  border: "none",
                  background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                  color: "#fff",
                  fontWeight: 800,
                  fontSize: 15,
                  cursor: "pointer",
                  boxShadow: "0 12px 26px rgba(37,99,235,0.25)"
                }}
              >
                Search
              </button>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 14
            }}
          >
            <div style={{ background: "#f8fafc", border: "1px solid #e5edf8", borderRadius: 16, padding: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#475569", marginBottom: 8 }}>Alliance</div>
              <select
                value={allianceFilter}
                onChange={(e) => setAllianceFilter(e.target.value)}
                style={{ width: "100%", padding: 12, borderRadius: 12, border: "1px solid #dbe3ee", background: "#fff" }}
              >
                <option value="All">All</option>
                <option value="oneworld">oneworld</option>
                <option value="Star Alliance">Star Alliance</option>
                <option value="SkyTeam">SkyTeam</option>
              </select>
            </div>

            <div style={{ background: "#f8fafc", border: "1px solid #e5edf8", borderRadius: 16, padding: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#475569", marginBottom: 8 }}>Program</div>
              <select
                value={programFilter}
                onChange={(e) => setProgramFilter(e.target.value)}
                style={{ width: "100%", padding: 12, borderRadius: 12, border: "1px solid #dbe3ee", background: "#fff" }}
              >
                <option value="All">All</option>
                {rewardsPrograms.map((p) => (
                  <option key={p.name} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ background: "#f8fafc", border: "1px solid #e5edf8", borderRadius: 16, padding: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#475569", marginBottom: 8 }}>Sort by</div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{ width: "100%", padding: 12, borderRadius: 12, border: "1px solid #dbe3ee", background: "#fff" }}
              >
                <option value="best">Best value</option>
                <option value="lowestMiles">Lowest miles</option>
                <option value="lowestCash">Lowest cash</option>
              </select>
            </div>
          </div>
        </section>

        {bestResult && (
          <section
            style={{
              background: "linear-gradient(135deg, #eff6ff 0%, #ffffff 100%)",
              border: "1px solid #bfdbfe",
              borderRadius: 24,
              padding: 22,
              marginBottom: 20,
              boxShadow: "0 10px 30px rgba(37,99,235,0.08)"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 800, color: "#2563eb", textTransform: "uppercase", letterSpacing: 0.6 }}>
                  Best option right now
                </div>
                <div style={{ fontSize: 30, fontWeight: 900, color: "#0f172a", marginTop: 8 }}>
                  {bestResult.program}
                </div>
                <div style={{ marginTop: 8, display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <Pill active>{bestResult.alliance}</Pill>
                  <Pill>{bestResult.duration}</Pill>
                  <Pill>{bestResult.stops === 0 ? "Nonstop" : `${bestResult.stops} stop${bestResult.stops > 1 ? "s" : ""}`}</Pill>
                </div>
              </div>

              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                <StatCard label="Cash" value={`$${bestResult.cash}`} />
                <StatCard label="Miles" value={bestResult.miles.toLocaleString()} />
                <StatCard label="Value" value={`${bestResult.cpp}¢/pt`} />
              </div>
            </div>
          </section>
        )}

        <section
          style={{
            background: "rgba(255,255,255,0.94)",
            border: "1px solid #e5edf8",
            borderRadius: 26,
            overflow: "hidden",
            boxShadow: "0 16px 40px rgba(15,23,42,0.05)"
          }}
        >
          <div style={{ padding: 22, borderBottom: "1px solid #eef2f7", display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 24, color: "#0f172a" }}>Results</h2>
              <div style={{ marginTop: 6, color: "#64748b", fontSize: 14 }}>
                {searched ? `${results.length} result${results.length === 1 ? "" : "s"} found` : "Search a route to see ranked options"}
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              <Pill>{fromAirport || "From"}</Pill>
              <Pill>{toAirport || "To"}</Pill>
              <Pill>{date || "No date selected"}</Pill>
            </div>
          </div>

          {!searched ? (
            <div style={{ padding: 28, color: "#64748b" }}>Choose your route and date, then click Search.</div>
          ) : results.length === 0 ? (
            <div style={{ padding: 28, color: "#64748b" }}>Please choose valid From, To, and Date.</div>
          ) : (
            <div style={{ padding: 16 }}>
              {results.map((r, idx) => (
                <div
                  key={r.program}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1.7fr 0.9fr 0.9fr 0.9fr 0.9fr auto",
                    gap: 12,
                    alignItems: "center",
                    padding: 18,
                    borderRadius: 18,
                    background: idx === 0 ? "#f8fbff" : "#fff",
                    border: idx === 0 ? "1px solid #bfdbfe" : "1px solid #eef2f7",
                    marginBottom: 12
                  }}
                >
                  <div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                      <div style={{ fontWeight: 800, color: "#0f172a", fontSize: 17 }}>{r.program}</div>
                      {idx === 0 && <Pill active>Top value</Pill>}
                    </div>
                    <div style={{ fontSize: 13, color: "#64748b", marginTop: 6 }}>
                      {r.alliance} • {r.duration} • {r.stops === 0 ? "Nonstop" : `${r.stops} stop${r.stops > 1 ? "s" : ""}`}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: 12, color: "#64748b", fontWeight: 700 }}>Cash</div>
                    <div style={{ fontWeight: 800, fontSize: 18, color: "#0f172a" }}>${r.cash}</div>
                  </div>

                  <div>
                    <div style={{ fontSize: 12, color: "#64748b", fontWeight: 700 }}>Miles</div>
                    <div style={{ fontWeight: 800, fontSize: 18, color: "#0f172a" }}>{r.miles.toLocaleString()}</div>
                  </div>

                  <div>
                    <div style={{ fontSize: 12, color: "#64748b", fontWeight: 700 }}>Value</div>
                    <div style={{ fontWeight: 800, fontSize: 18, color: "#0f172a" }}>{r.cpp}¢/pt</div>
                  </div>

                  <div>
                    <div style={{ fontSize: 12, color: "#64748b", fontWeight: 700 }}>Rank</div>
                    <div style={{ fontWeight: 800, fontSize: 18, color: "#0f172a" }}>#{idx + 1}</div>
                  </div>

                  <div>
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: "inline-block",
                        padding: "11px 16px",
                        borderRadius: 12,
                        background: "#0f172a",
                        color: "#fff",
                        textDecoration: "none",
                        fontSize: 14,
                        fontWeight: 800
                      }}
                    >
                      Book
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
