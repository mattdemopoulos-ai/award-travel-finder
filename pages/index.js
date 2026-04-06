import { useState } from "react";

// 🔹 Generate dates through Feb 2027
function generateDates() {
  const dates = [];
  const start = new Date("2026-06-01");
  const end = new Date("2027-02-28");

  let current = start;
  while (current <= end) {
    const yyyy = current.getFullYear();
    const mm = String(current.getMonth() + 1).padStart(2, "0");
    const dd = String(current.getDate()).padStart(2, "0");

    dates.push(`${yyyy}-${mm}-${dd}`);
    current.setDate(current.getDate() + 7); // weekly intervals (cleaner UX)
  }

  return dates;
}

const dateOptions = generateDates();

// 🔹 Expanded dataset
const allResults = [
  { program: "Iberia Avios", origin: "BOG", destination: "MAD", cabin: "Business", miles: 42500, taxes: 120 },
  { program: "Flying Blue", origin: "BOG", destination: "CDG", cabin: "Business", miles: 55000, taxes: 210 },
  { program: "LifeMiles", origin: "MDE", destination: "MAD", cabin: "Business", miles: 63000, taxes: 78 },
  { program: "Flying Blue", origin: "MDE", destination: "AMS", cabin: "Business", miles: 59000, taxes: 195 },
  { program: "Iberia Avios", origin: "MDE", destination: "MAD", cabin: "Economy", miles: 25500, taxes: 95 },

  // New routes
  { program: "AAdvantage", origin: "BOG", destination: "MIA", cabin: "Business", miles: 30000, taxes: 80 },
  { program: "United", origin: "MDE", destination: "IAH", cabin: "Business", miles: 35000, taxes: 70 },
  { program: "Flying Blue", origin: "GRU", destination: "CDG", cabin: "Business", miles: 55000, taxes: 250 },
  { program: "Iberia Avios", origin: "MEX", destination: "MAD", cabin: "Business", miles: 51000, taxes: 150 },
  { program: "LifeMiles", origin: "LIM", destination: "MAD", cabin: "Business", miles: 65000, taxes: 85 }
];

// 🔹 Airport lists
const origins = ["ALL", "MDE", "BOG", "GRU", "MEX", "LIM"];
const destinations = ["ALL", "MAD", "CDG", "AMS", "MIA", "IAH"];

export default function Home() {
  const [origin, setOrigin] = useState("ALL");
  const [destination, setDestination] = useState("ALL");
  const [date, setDate] = useState("ALL");
  const [cabin, setCabin] = useState("Business");
  const [results, setResults] = useState(allResults);

  function handleSearch() {
    const filtered = allResults.filter((r) => {
      return (
        (origin === "ALL" || r.origin === origin) &&
        (destination === "ALL" || r.destination === destination) &&
        (cabin === "ALL" || r.cabin === cabin)
      );
    });

    setResults(filtered);
  }

  function handleReset() {
    setOrigin("ALL");
    setDestination("ALL");
    setDate("ALL");
    setCabin("Business");
    setResults(allResults);
  }

  return (
    <div style={{ fontFamily: "Arial", padding: "40px", background: "#f5f5f5", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <h1>Award Travel Finder ✈️</h1>

        <div style={{ background: "white", padding: "20px", borderRadius: "12px", marginBottom: "30px" }}>
          <h2>Search</h2>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <select value={origin} onChange={(e) => setOrigin(e.target.value)}>
              {origins.map((o) => <option key={o}>{o === "ALL" ? "All origins" : o}</option>)}
            </select>

            <select value={destination} onChange={(e) => setDestination(e.target.value)}>
              {destinations.map((d) => <option key={d}>{d === "ALL" ? "All destinations" : d}</option>)}
            </select>

            <select value={date} onChange={(e) => setDate(e.target.value)}>
              <option value="ALL">All dates</option>
              {dateOptions.map((d) => <option key={d}>{d}</option>)}
            </select>

            <select value={cabin} onChange={(e) => setCabin(e.target.value)}>
              <option value="Business">Business</option>
              <option value="Economy">Economy</option>
              <option value="ALL">All cabins</option>
            </select>
          </div>

          <div style={{ marginTop: "15px" }}>
            <button onClick={handleSearch} style={{ marginRight: 10 }}>Find Awards</button>
            <button onClick={handleReset}>Reset</button>
          </div>
        </div>

        <h2>Results ({results.length})</h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "15px" }}>
          {results.map((r, i) => (
            <div key={i} style={{ background: "white", padding: "15px", borderRadius: "10px" }}>
              <h3>{r.program}</h3>
              <p>{r.origin} → {r.destination}</p>
              <p><strong>{r.cabin}</strong></p>
              <p>{r.miles.toLocaleString()} miles</p>
              <p>${r.taxes} taxes</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
