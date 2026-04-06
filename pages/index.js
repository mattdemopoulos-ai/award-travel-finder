import { useMemo, useState } from "react";

function makeDates() {
  const out = [];
  const start = new Date("2026-06-01");
  const end = new Date("2027-02-28");
  const d = new Date(start);

  while (d <= end) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    out.push(`${y}-${m}-${day}`);
    d.setDate(d.getDate() + 1);
  }

  return out;
}

const dates = makeDates();

const origins = ["ALL", "MDE", "BOG", "CTG", "MEX", "LIM", "GRU", "MIA", "JFK", "DFW", "IAH"];
const destinations = ["ALL", "MAD", "CDG", "AMS", "MIA", "JFK", "DFW", "IAH"];
const cabins = ["Business", "Economy", "ALL"];

const routes = [
  { program: "Iberia Avios", origin: "BOG", destination: "MAD", cabin: "Business", baseMiles: 42500, baseTaxes: 120, baseCash: 2200 },
  { program: "Flying Blue", origin: "BOG", destination: "CDG", cabin: "Business", baseMiles: 55000, baseTaxes: 210, baseCash: 2400 },
  { program: "LifeMiles", origin: "MDE", destination: "MAD", cabin: "Business", baseMiles: 63000, baseTaxes: 78, baseCash: 2100 },
  { program: "Flying Blue", origin: "MDE", destination: "AMS", cabin: "Business", baseMiles: 59000, baseTaxes: 195, baseCash: 2350 },
  { program: "Iberia Avios", origin: "MEX", destination: "MAD", cabin: "Business", baseMiles: 51000, baseTaxes: 150, baseCash: 2400 },
  { program: "Flying Blue", origin: "GRU", destination: "CDG", cabin: "Business", baseMiles: 55000, baseTaxes: 250, baseCash: 2700 },
  { program: "LifeMiles", origin: "LIM", destination: "MAD", cabin: "Business", baseMiles: 65000, baseTaxes: 85, baseCash: 2300 },
  { program: "AAdvantage", origin: "BOG", destination: "MIA", cabin: "Business", baseMiles: 30000, baseTaxes: 80, baseCash: 900 },
  { program: "United", origin: "MDE", destination: "IAH", cabin: "Business", baseMiles: 35000, baseTaxes: 70, baseCash: 950 },
  { program: "Iberia Avios", origin: "CTG", destination: "MAD", cabin: "Economy", baseMiles: 28000, baseTaxes: 110, baseCash: 700 }
];

function hashString(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) % 1000000;
  }
  return h;
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function calcCpp(cashPrice, taxes, miles) {
  if (!miles) return 0;
  return ((cashPrice - taxes) / miles) * 100;
}

function getDealLabel(cpp) {
  if (cpp >= 4.5) return "Excellent";
  if (cpp >= 3.2) return "Good";
  if (cpp >= 2.0) return "Average";
  return "Weak";
}

function buildResults() {
  const out = [];

  for (let i = 0; i < routes.length; i++) {
    const route = routes[i];

    for (let j = 0; j < dates.length; j++) {
      const date = dates[j];
      const seed = hashString(route.origin + route.destination + route.program + route.cabin + date);

      const milesAdj = 1 + (((seed % 11) - 5) * 0.03);
      const taxesAdj = 1 + (((seed % 7) - 3) * 0.04);
      const cashAdj = 1 + (((seed % 13) - 6) * 0.05);

      const miles = Math.round((route.baseMiles * milesAdj) / 500) * 500;
      const taxes = Math.round(clamp(route.baseTaxes * taxesAdj, 5, 2000));
      const cashPrice = Math.round(clamp(route.baseCash * cashAdj, 60, 10000));
      const cpp = calcCpp(cashPrice, taxes, miles);

      out.push({
        program: route.program,
        origin: route.origin,
        destination: route.destination,
        date: date,
        cabin: route.cabin,
        miles: miles,
        taxes: taxes,
        cashPrice: cashPrice,
        cpp: cpp,
        dealLabel: getDealLabel(cpp)
      });
    }
  }

  return out;
}

const allResults = buildResults();

export default function Home() {
  const [origin, setOrigin] = useState("ALL");
  const [destination, setDestination] = useState("ALL");
  const [date, setDate] = useState(dates[0]);
  const [cabin, setCabin] = useState("Business");
  const [hasSearched, setHasSearched] = useState(false);

  const filteredResults = useMemo(function () {
    return allResults
      .filter(function (r) {
        const okOrigin = origin === "ALL" || r.origin === origin;
        const okDestination = destination === "ALL" || r.destination === destination;
        const okDate = date === "ALL" || r.date === date;
        const okCabin = cabin === "ALL" || r.cabin === cabin;
        return okOrigin && okDestination && okDate && okCabin;
      })
      .sort(function (a, b) {
        return b.cpp - a.cpp;
      });
  }, [origin, destination, date, cabin]);

  function handleSearch() {
    setHasSearched(true);
  }

  function handleReset() {
    setOrigin("ALL");
    setDestination("ALL");
    setDate(dates[0]);
    setCabin("Business");
    setHasSearched(false);
  }

  const resultsToShow = hasSearched ? filteredResults : allResults.slice(0, 12);

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: 40, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <h1>Award Travel Finder ✈️</h1>
        <p>Compare cash prices and award prices by date.</p>

        <div style={{ backgroundColor: "white", padding: 20, borderRadius: 12, marginBottom: 30 }}>
          <h2>Search</h2>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 15 }}>
            <select value={origin} onChange={(e) => setOrigin(e.target.value)} style={{ padding: 10, minWidth: 160 }}>
              {origins.map(function (o) {
                return <option key={o} value={o}>{o === "ALL" ? "All origins" : o}</option>;
              })}
            </select>

            <select value={destination} onChange={(e) => setDestination(e.target.value)} style={{ padding: 10, minWidth: 160 }}>
              {destinations.map(function (d) {
                return <option key={d} value={d}>{d === "ALL" ? "All destinations" : d}</option>;
              })}
            </select>

            <select value={date} onChange={(e) => setDate(e.target.value)} style={{ padding: 10, minWidth: 180 }}>
              {dates.map(function (d) {
                return <option key={d} value={d}>{d}</option>;
              })}
            </select>

            <select value={cabin} onChange={(e) => setCabin(e.target.value)} style={{ padding: 10, minWidth: 160 }}>
              {cabins.map(function (c) {
                return <option key={c} value={c}>{c === "ALL" ? "All cabins" : c}</option>;
              })}
            </select>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={handleSearch} style={{ padding: "10px 16px", backgroundColor: "black", color: "white", border: "none", borderRadius: 8 }}>
              Find Awards
            </button>
            <button onClick={handleReset} style={{ padding: "10px 16px", backgroundColor: "white", color: "black", border: "1px solid #ccc", borderRadius: 8 }}>
              Reset
            </button>
          </div>
        </div>

        <h2>Results ({resultsToShow.length})</h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
          {resultsToShow.map(function (r, i) {
            return (
              <div key={i} style={{ backgroundColor: "white", padding: 20, borderRadius: 12 }}>
                <h3>{r.program}</h3>
                <p>{r.origin} to {r.destination}</p>
                <p>{r.date}</p>
                <p><strong>{r.cabin}</strong></p>
                <p><strong>Cash:</strong> ${r.cashPrice}</p>
                <p><strong>Award:</strong> {r.miles.toLocaleString()} miles + ${r.taxes}</p>
                <p><strong>CPP:</strong> {r.cpp.toFixed(1)}</p>
                <p><strong>Value:</strong> {r.dealLabel}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
