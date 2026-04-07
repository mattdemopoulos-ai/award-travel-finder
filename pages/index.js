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
    <main style={{ fontFamily: "Arial, sans-serif", padding: 24, maxWidth: 1000, margin: "0 auto" }}>
      <h1>Award Travel Finder</h1>

      <div style={{ display: "grid", gap: 12, marginBottom: 24 }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search cities or airports"
          style={{ padding: 12, fontSize: 16 }}
        />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <select value={from} onChange={(e) => setFrom(e.target.value)} style={{ padding: 12 }}>
            {cities.map((c) => (
              <option key={`${c.airport}-from`} value={c.airport}>
                {c.city} ({c.airport})
              </option>
            ))}
          </select>

          <select value={to} onChange={(e) => setTo(e.target.value)} style={{ padding: 12 }}>
            {cities.map((c) => (
              <option key={`${c.airport}-to`} value={c.airport}>
                {c.city} ({c.airport})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <strong>Route:</strong> {from} → {to}
      </div>

      <h2>Rewards Programs</h2>
      <ul>
        {rewardsPrograms.map((p) => (
          <li key={p.name}>
            {p.name} — {p.type} — {p.alliance}
          </li>
        ))}
      </ul>

      <h2>Matching Cities</h2>
      <ul>
        {filteredCities.map((c) => (
          <li key={`${c.city}-${c.airport}`}>
            {c.city} ({c.airport}) — {c.region}
          </li>
        ))}
      </ul>
    </main>
  );
}
