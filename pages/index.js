import { useMemo, useState } from "react";
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

function formatCityLabel(c) {
  return `${c.city} (${c.airport})`;
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
    const cash = 200 + ((seed + i * 37) % 800);
    const miles = 10000 + ((seed + i * 5000) % 80000);
    const cpp = ((cash * 100) / miles).toFixed(1);

    return {
      program: program.name,
      alliance: program.alliance,
      cash,
      miles,
      cpp,
      url: program.url
    };
  });
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
      return Number(b.cpp) - Number(a.cpp);
    });

    return output;
  }, [fromAirport, toAirport, date, searched, allianceFilter, programFilter, sortBy]);

  return (
    <main style={{ padding: 30, fontFamily: "Inter, sans-serif" }}>
      <h1>✈️ Award Travel Finder</h1>

      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <input value={fromInput} onChange={(e) => setFromInput(e.target.value)} placeholder="From" />
        <input value={toInput} onChange={(e) => setToInput(e.target.value)} placeholder="To" />
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <button onClick={() => setSearched(true)}>Search</button>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <select value={allianceFilter} onChange={(e) => setAllianceFilter(e.target.value)}>
          <option value="All">All Alliances</option>
          <option value="oneworld">oneworld</option>
          <option value="Star Alliance">Star Alliance</option>
          <option value="SkyTeam">SkyTeam</option>
        </select>

        <select value={programFilter} onChange={(e) => setProgramFilter(e.target.value)}>
          <option value="All">All Programs</option>
          {rewardsPrograms.map((p) => (
            <option key={p.name}>{p.name}</option>
          ))}
        </select>

        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="best">Best Value</option>
          <option value="lowestMiles">Lowest Miles</option>
          <option value="lowestCash">Lowest Cash</option>
        </select>
      </div>

      {results.map((r) => (
        <div key={r.program} style={{ border: "1px solid #ddd", padding: 12, marginBottom: 10 }}>
          <strong>{r.program}</strong> ({r.alliance})<br />
          ${r.cash} | {r.miles.toLocaleString()} miles | {r.cpp}¢/pt<br />
          <a href={r.url} target="_blank">Book</a>
        </div>
      ))}
    </main>
  );
}
