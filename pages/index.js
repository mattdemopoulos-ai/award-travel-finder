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
  { name: "American AAdvantage", type: "airline", alliance: "oneworld" },
  { name: "Alaska Mileage Plan", type: "airline", alliance: "oneworld" },
  { name: "United MileagePlus", type: "airline", alliance: "Star Alliance" },
  { name: "Delta SkyMiles", type: "airline", alliance: "SkyTeam" },
  { name: "Air Canada Aeroplan", type: "airline", alliance: "Star Alliance" },
  { name: "Flying Blue", type: "airline", alliance: "SkyTeam" },
  { name: "British Airways Executive Club", type: "airline", alliance: "oneworld" },
  { name: "Iberia Plus", type: "airline", alliance: "oneworld" },
  { name: "Qatar Airways Privilege Club", type: "airline", alliance: "oneworld" },
  { name: "Avianca LifeMiles", type: "airline", alliance: "Star Alliance" },
  { name: "Virgin Atlantic Flying Club", type: "airline", alliance: "SkyTeam" },
  { name: "Singapore KrisFlyer", type: "airline", alliance: "Star Alliance" },
  { name: "Emirates Skywards", type: "airline", alliance: "Independent" },
  { name: "Etihad Guest", type: "airline", alliance: "Independent" },
  { name: "Turkish Miles&Smiles", type: "airline", alliance: "Star Alliance" },
  { name: "Cathay Pacific Asia Miles", type: "airline", alliance: "oneworld" },
  { name: "ANA Mileage Club", type: "airline", alliance: "Star Alliance" },
  { name: "Qantas Frequent Flyer", type: "airline", alliance: "oneworld" },
  { name: "TAP Miles&Go", type: "airline", alliance: "Star Alliance" },
  { name: "Southwest Rapid Rewards", type: "airline", alliance: "Independent" },
  { name: "JetBlue TrueBlue", type: "airline", alliance: "Independent" },
  { name: "Hilton Honors", type: "hotel", alliance: "Hotel" },
  { name: "Marriott Bonvoy", type: "hotel", alliance: "Hotel" },
  { name: "World of Hyatt", type: "hotel", alliance: "Hotel" },
  { name: "IHG One Rewards", type: "hotel", alliance: "Hotel" }
];

export default function Home() {
  const [from, setFrom] = useState("MDE");
  const [to, setTo] = useState("MAD");
  const [search, setSearch] = useState("");

  const filteredCities = useMemo(() => {
    const q = search.toLowerCase();
    return cities.filter(
      (c) =>
        c.city.toLowerCase().includes(q) ||
        c.airport.toLowerCase().includes(q) ||
        c.region.toLowerCase().includes(q)
    );
  }, [search]);

  return (
  <main style={{
    fontFamily: "Inter, system-ui, sans-serif",
    background: "#f8fafc",
    minHeight: "100vh",
    padding: "40px 20px"
  }}>
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      
      <h1 style={{ fontSize: 32, marginBottom: 20 }}>
        ✈️ Award Travel Finder
      </h1>

      <div style={{
        background: "white",
        padding: 20,
        borderRadius: 12,
        boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        marginBottom: 20
      }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search cities or airports"
          style={{
            width: "100%",
            padding: 14,
            fontSize: 16,
            borderRadius: 8,
            border: "1px solid #ddd",
            marginBottom: 12
          }}
        />

        <div style={{ display: "flex", gap: 10 }}>
          <select value={from} onChange={(e) => setFrom(e.target.value)} style={{ flex: 1, padding: 12 }}>
            {cities.map((c) => (
              <option key={`${c.airport}-from`} value={c.airport}>
                {c.city} ({c.airport})
              </option>
            ))}
          </select>

          <select value={to} onChange={(e) => setTo(e.target.value)} style={{ flex: 1, padding: 12 }}>
            {cities.map((c) => (
              <option key={`${c.airport}-to`} value={c.airport}>
                {c.city} ({c.airport})
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginTop: 12, fontWeight: 500 }}>
          Route: {from} → {to}
        </div>
      </div>

      <div style={{
        background: "white",
        padding: 20,
        borderRadius: 12,
        boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        marginBottom: 20
      }}>
        <h2 style={{ marginBottom: 10 }}>Rewards Programs</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {rewardsPrograms.map((p) => (
            <div key={p.name} style={{
              padding: 10,
              border: "1px solid #eee",
              borderRadius: 8
            }}>
              <strong>{p.name}</strong>
              <div style={{ fontSize: 12, color: "#666" }}>
                {p.type} • {p.alliance}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        background: "white",
        padding: 20,
        borderRadius: 12,
        boxShadow: "0 4px 20px rgba(0,0,0,0.05)"
      }}>
        <h2 style={{ marginBottom: 10 }}>Matching Cities</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {filteredCities.map((c) => (
            <div key={`${c.city}-${c.airport}`} style={{
              padding: 10,
              border: "1px solid #eee",
              borderRadius: 8
            }}>
              {c.city} ({c.airport})
              <div style={{ fontSize: 12, color: "#666" }}>
                {c.region}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  </main>
);
}
