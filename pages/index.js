import { useMemo, useState } from "react";

const cities = [
  { city: "Medellin", airport: "MDE", region: "Latin America" },
  { city: "Bogota", airport: "BOG", region: "Latin America" },
  { city: "Mexico City", airport: "MEX", region: "Latin America" },
  { city: "Lima", airport: "LIM", region: "Latin America" },
  { city: "Sao Paulo", airport: "GRU", region: "Latin America" },
  { city: "Buenos Aires", airport: "EZE", region: "Latin America" },
  { city: "Miami", airport: "MIA", region: "United States" },
  { city: "New York", airport: "JFK", region: "United States" },
  { city: "Dallas", airport: "DFW", region: "United States" },
  { city: "Houston", airport: "IAH", region: "United States" },
  { city: "Los Angeles", airport: "LAX", region: "United States" },
  { city: "Madrid", airport: "MAD", region: "Europe" },
  { city: "Paris", airport: "CDG", region: "Europe" },
  { city: "London", airport: "LHR", region: "Europe" },
  { city: "Amsterdam", airport: "AMS", region: "Europe" },
  { city: "Rome", airport: "FCO", region: "Europe" },
  { city: "Tokyo", airport: "HND", region: "Asia" },
  { city: "Bangkok", airport: "BKK", region: "Asia" },
  { city: "Singapore", airport: "SIN", region: "Asia" },
  { city: "Seoul", airport: "ICN", region: "Asia" },
  { city: "Dubai", airport: "DXB", region: "Asia" }
];

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

function formatCityLabel(c) {
  return `${c.city} (${c.airport})`;
}

function AutocompleteAirport({ label, value, onChange, cities, excludeAirport }) {
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = value.toLowerCase().trim();
    return cities
      .filter((c) => c.airport !== excludeAirport)
      .filter(
        (c) =>
          c.city.toLowerCase().includes(q) ||
          c.airport.toLowerCase().includes(q) ||
          c.region.toLowerCase().includes(q)
      )
      .slice(0, 8);
  }, [value, cities, excludeAirport]);

  return (
    <div style={{ position: "relative" }}>
      <div style={{ fontSize: 13, color: "#475569", marginBottom: 8 }}>{label}</div>
      <input
        value={value}
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        placeholder="City or airport"
        style={{
          width: "100%",
          padding: "14px 16px",
          borderRadius: 12,
          border: "1px solid #dbe3ee",
          fontSize: 16,
          outline: "none",
          background: "white"
        }}
      />
      {open && filtered.length > 0 && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            background: "white",
            border: "1px solid #dbe3ee",
            borderRadius: 12,
            marginTop: 6,
            boxShadow: "0 10px 30px rgba(15,23,42,0.10)",
            zIndex: 20,
            overflow: "hidden"
          }}
        >
          {filtered.map((c) => (
            <button
              key={`${c.airport}-${label}`}
              type="button"
              onClick={() => {
                onChange(formatCityLabel(c));
                setOpen(false);
              }}
              style={{
                width: "100%",
                textAlign: "left",
                padding: "12px 14px",
                border: "none",
                background: "white",
                cursor: "pointer",
                borderBottom: "1px solid #f1f5f9"
              }}
            >
              <div style={{ fontWeight: 600, color: "#0f172a" }}>
                {c.city} <span style={{ color: "#64748b" }}>({c.airport})</span>
              </div>
              <div style={{ fontSize: 12, color: "#64748b" }}>{c.region}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
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
    const cash = 220 + ((seed + i * 37) % 900);
    const miles = 12000 + ((seed + i * 5100) % 90000);
    const cpp = ((cash * 100) / miles).toFixed(1);

    return {
      program: program.name,
      alliance: program.alliance,
      cash,
      miles,
      cpp,
      url: program.url
    };
  }).sort((a, b) => Number(b.cpp) - Number(a.cpp));
}

export default function Home() {
  const [fromInput, setFromInput] = useState("Medellin (MDE)");
  const [toInput, setToInput] = useState("Madrid (MAD)");
  const [date, setDate] = useState("");
  const [searched, setSearched] = useState(false);

  const fromAirport = parseAirport(fromInput);
  const toAirport = parseAirport(toInput);

  const results = useMemo(() => {
    if (!searched) return [];
    return generateMockResults(fromAirport, toAirport, date);
  }, [fromAirport, toAirport, date, searched]);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #f8fbff 0%, #eef4ff 100%)",
        fontFamily: "Inter, system-ui, sans-serif",
        padding: "32px 20px"
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 14, color: "#2563eb", fontWeight: 700, marginBottom: 10 }}>
            AWARD TRAVEL
          </div>
          <h1 style={{ fontSize: 40, lineHeight: 1.1, margin: 0, color: "#0f172a" }}>
            Find the best points redemptions faster
          </h1>
          <p style={{ color: "#475569", fontSize: 17, maxWidth: 700, marginTop: 12 }}>
            Search routes, compare miles vs cash, and surface the best-value booking options.
          </p>
        </div>

        <div
          style={{
            background: "rgba(255,255,255,0.92)",
            border: "1px solid #dbe7ff",
            borderRadius: 20,
            padding: 20,
            boxShadow: "0 18px 50px rgba(37,99,235,0.08)",
            marginBottom: 24
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.2fr 1.2fr 0.9fr auto",
              gap: 14
            }}
          >
            <AutocompleteAirport
              label="From"
              value={fromInput}
              onChange={setFromInput}
              cities={cities}
              excludeAirport={toAirport}
            />
            <AutocompleteAirport
              label="To"
              value={toInput}
              onChange={setToInput}
              cities={cities}
              excludeAirport={fromAirport}
            />
            <div>
              <div style={{ fontSize: 13, color: "#475569", marginBottom: 8 }}>Date</div>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  borderRadius: 12,
                  border: "1px solid #dbe3ee",
                  fontSize: 16,
                  background: "white"
                }}
              />
            </div>
            <div style={{ display: "flex", alignItems: "end" }}>
              <button
                onClick={() => setSearched(true)}
                style={{
                  width: "100%",
                  padding: "14px 18px",
                  borderRadius: 12,
                  border: "none",
                  background: "#2563eb",
                  color: "white",
                  fontWeight: 700,
                  fontSize: 15,
                  cursor: "pointer",
                  boxShadow: "0 8px 20px rgba(37,99,235,0.25)"
                }}
              >
                Search
              </button>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
            marginBottom: 24
          }}
        >
          {[
            { label: "From", value: fromAirport || "Select airport" },
            { label: "To", value: toAirport || "Select airport" },
            { label: "Date", value: date || "Select date" }
          ].map((item) => (
            <div
              key={item.label}
              style={{
                background: "white",
                borderRadius: 16,
                padding: 18,
                border: "1px solid #e5edf8"
              }}
            >
              <div style={{ fontSize: 12, color: "#64748b", marginBottom: 6 }}>{item.label}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#0f172a" }}>{item.value}</div>
            </div>
          ))}
        </div>

        <div
          style={{
            background: "white",
            borderRadius: 20,
            border: "1px solid #e5edf8",
            overflow: "hidden"
          }}
        >
          <div style={{ padding: 20, borderBottom: "1px solid #eef2f7" }}>
            <h2 style={{ margin: 0, fontSize: 22, color: "#0f172a" }}>Best Results</h2>
            <div style={{ marginTop: 6, color: "#64748b", fontSize: 14 }}>
              Mock data for now — next step is wiring real award/cash search sources.
            </div>
          </div>

          {!searched ? (
            <div style={{ padding: 24, color: "#64748b" }}>Choose route and date, then click Search.</div>
          ) : results.length === 0 ? (
            <div style={{ padding: 24, color: "#64748b" }}>Please choose valid From, To, and Date.</div>
          ) : (
            <div style={{ padding: 16 }}>
              {results.map((r, idx) => (
                <div
                  key={r.program}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "2fr 1fr 1fr 1fr auto",
                    gap: 12,
                    alignItems: "center",
                    padding: "16px 12px",
                    borderRadius: 14,
                    background: idx === 0 ? "#eff6ff" : "white",
                    border: idx === 0 ? "1px solid #bfdbfe" : "1px solid #eef2f7",
                    marginBottom: 10
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, color: "#0f172a" }}>{r.program}</div>
                    <div style={{ fontSize: 13, color: "#64748b" }}>{r.alliance}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: "#64748b" }}>Cash</div>
                    <div style={{ fontWeight: 700 }}>${r.cash}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: "#64748b" }}>Miles</div>
                    <div style={{ fontWeight: 700 }}>{r.miles.toLocaleString()}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: "#64748b" }}>Value</div>
                    <div style={{ fontWeight: 700 }}>{r.cpp}¢/pt</div>
                  </div>
                  <div>
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: "inline-block",
                        padding: "10px 14px",
                        borderRadius: 10,
                        background: "#0f172a",
                        color: "white",
                        textDecoration: "none",
                        fontSize: 14,
                        fontWeight: 600
                      }}
                    >
                      Book
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
