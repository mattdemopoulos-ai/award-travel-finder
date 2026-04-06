import { useState } from "react";

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

const origins = [
  "ALL", "MDE", "BOG", "CTG", "CLO", "MEX", "LIM", "SCL", "EZE", "GRU", "GIG",
  "UIO", "PTY", "SJO", "SDQ", "PUJ", "AUA", "CUR", "MIA", "JFK", "DFW", "LAX", "IAH", "ORD"
];

const destinations = [
  "ALL", "MAD", "BCN", "CDG", "AMS", "LHR", "FRA", "FCO", "LIS", "DUB",
  "ZRH", "ATH", "IST", "DXB", "DOH", "MIA", "JFK", "DFW", "LAX", "IAH", "ORD"
];

const allResults = [
  { program: "Iberia Avios", origin: "BOG", destination: "MAD", date: "2026-06-10", cabin: "Business", miles: 42500, taxes: 120, notes: "Excellent nonstop sweet spot" },
  { program: "Flying Blue", origin: "BOG", destination: "CDG", date: "2026-06-12", cabin: "Business", miles: 55000, taxes: 210, notes: "Good availability and transfer options" },
  { program: "LifeMiles", origin: "MDE", destination: "MAD", date: "2026-06-10", cabin: "Business", miles: 63000, taxes: 78, notes: "Lower fees, one-stop option" },
  { program: "Flying Blue", origin: "MDE", destination: "AMS", date: "2026-06-15", cabin: "Business", miles: 59000, taxes: 195, notes: "Strong Europe option from Medellin" },
  { program: "Iberia Avios", origin: "MEX", destination: "MAD", date: "2026-07-01", cabin: "Business", miles: 51000, taxes: 150, notes: "Reliable Iberia sweet spot" },
  { program: "Flying Blue", origin: "GRU", destination: "CDG", date: "2026-07-08", cabin: "Business", miles: 55000, taxes: 250, notes: "Good nonstop-style long-haul option" },
  { program: "LifeMiles", origin: "LIM", destination: "MAD", date: "2026-08-05", cabin: "Business", miles: 65000, taxes: 85, notes: "Low-fee Star Alliance option" },
  { program: "AAdvantage", origin: "BOG", destination: "MIA", date: "2026-06-20", cabin: "Business", miles: 30000, taxes: 80, notes: "Strong short-haul premium value" },
  { program: "United", origin: "MDE", destination: "IAH", date: "2026-09-01", cabin: "Business", miles: 35000, taxes: 70, notes: "Easy booking from Medellin" },
  { program: "Iberia Avios", origin: "CTG", destination: "MAD", date: "2026-10-10", cabin: "Economy", miles: 28000, taxes: 110, notes: "Economy fallback option" }
];

function dateDiffDays(dateA, dateB) {
  const a = new Date(dateA);
  const b = new Date(dateB);
  const diffMs = Math.abs(a - b);
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

export default function Home() {
  const [origin, setOrigin] = useState("ALL");
  const [destination, setDestination] = useState("ALL");
  const [date, setDate] = useState("ALL");
  const [cabin, setCabin] = useState("Business");
  const [results, setResults] = useState(allResults);
  const [message, setMessage] = useState("Showing sample results.");

  function handleSearch() {
    let filtered = allResults.filter(function (r) {
      const originOk = origin === "ALL" || r.origin === origin;
      const destOk = destination === "ALL" || r.destination === destination;
      const cabinOk = cabin === "ALL" || r.cabin === cabin;
      return originOk && destOk && cabinOk;
    });

    if (date !== "ALL") {
      const exactDateMatches = filtered.filter(function (r) {
        return r.date === date;
      });

      if (exactDateMatches.length > 0) {
        setResults(exactDateMatches);
        setMessage(`Showing exact matches for ${date}.`);
        return;
      }

      const nearbyDateMatches = filtered
        .map(function (r) {
          return {
            ...r,
            daysAway: dateDiffDays(r.date, date)
          };
        })
        .filter(function (r) {
          return r.daysAway <= 30;
        })
        .sort(function (a, b) {
          return a.daysAway - b.daysAway;
        });

      if (nearbyDateMatches.length > 0) {
        setResults(nearbyDateMatches);
        setMessage(`No exact matches for ${date}. Showing nearest available dates instead.`);
        return;
      }
    }

    if (filtered.length > 0) {
      setResults(filtered);
      setMessage("No exact date match found. Showing available routes for your search.");
      return;
    }

    setResults(allResults);
    setMessage("No matching routes found. Showing all sample results instead.");
  }

  function handleReset() {
    setOrigin("ALL");
    setDestination("ALL");
    setDate("ALL");
    setCabin("Business");
    setResults(allResults);
    setMessage("Showing sample results.");
  }

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: 40, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <h1>Award Travel Finder ✈️</h1>
        <p>Search award routes with smarter fallback logic.</p>

        <div style={{ backgroundColor: "white", padding: 20, borderRadius: 12, marginBottom: 30 }}>
          <h2>Search</h2>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 15 }}>
            <select value={origin} onChange={(e) => setOrigin(e.target.value)} style={{ padding: 10, minWidth: 160 }}>
              {origins.map((o) => (
                <option key={o} value={o}>{o === "ALL" ? "All origins" : o}</option>
              ))}
            </select>

            <select value={destination} onChange={(e) => setDestination(e.target.value)} style={{ padding: 10, minWidth: 160 }}>
              {destinations.map((d) => (
                <option key={d} value={d}>{d === "ALL" ? "All destinations" : d}</option>
              ))}
            </select>

            <select value={date} onChange={(e) => setDate(e.target.value)} style={{ padding: 10, minWidth: 180 }}>
              <option value="ALL">All dates</option>
              {dates.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            <select value={cabin} onChange={(e) => setCabin(e.target.value)} style={{ padding: 10, minWidth: 160 }}>
              <option value="Business">Business</option>
              <option value="Economy">Economy</option>
              <option value="ALL">All cabins</option>
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

        <h2>Results ({results.length})</h2>
        <p style={{ color: "#666", marginBottom: 20 }}>{message}</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
          {results.map(function (r, i) {
            return (
              <div key={i} style={{ backgroundColor: "white", padding: 20, borderRadius: 12 }}>
                <h3>{r.program}</h3>
                <p>{r.origin} to {r.destination}</p>
                <p>{r.date}</p>
                {"daysAway" in r ? <p><strong>{r.daysAway} days away from selected date</strong></p> : null}
                <p><strong>{r.cabin}</strong></p>
                <p><strong>{r.miles.toLocaleString()}</strong> miles</p>
                <p><strong>${r.taxes}</strong> taxes</p>
                <p>{r.notes}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
