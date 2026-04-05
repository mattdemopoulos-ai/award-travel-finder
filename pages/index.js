import { useState } from "react";

const allResults = [
  {
    program: "Iberia Avios",
    origin: "BOG",
    destination: "MAD",
    date: "2026-06-10",
    cabin: "Business",
    miles: 42500,
    taxes: 120,
    notes: "Excellent nonstop sweet spot"
  },
  {
    program: "Flying Blue",
    origin: "BOG",
    destination: "CDG",
    date: "2026-06-12",
    cabin: "Business",
    miles: 55000,
    taxes: 210,
    notes: "Good availability and transfer options"
  },
  {
    program: "LifeMiles",
    origin: "MDE",
    destination: "MAD",
    date: "2026-06-10",
    cabin: "Business",
    miles: 63000,
    taxes: 78,
    notes: "Lower fees, one-stop option"
  },
  {
    program: "Flying Blue",
    origin: "MDE",
    destination: "AMS",
    date: "2026-06-15",
    cabin: "Business",
    miles: 59000,
    taxes: 195,
    notes: "Strong Europe option from Medellin"
  },
  {
    program: "Iberia Avios",
    origin: "MDE",
    destination: "MAD",
    date: "2026-06-10",
    cabin: "Economy",
    miles: 25500,
    taxes: 95,
    notes: "Economy fallback option"
  }
];

export default function Home() {
  const [origin, setOrigin] = useState("ALL");
  const [destination, setDestination] = useState("ALL");
  const [date, setDate] = useState("ALL");
  const [cabin, setCabin] = useState("Business");
  const [results, setResults] = useState(allResults);

  function handleSearch() {
    const filtered = allResults.filter((result) => {
      const originMatch = origin === "ALL" || result.origin === origin;
      const destinationMatch =
        destination === "ALL" || result.destination === destination;
      const dateMatch = date === "ALL" || result.date === date;
      const cabinMatch = cabin === "ALL" || result.cabin === cabin;

      return originMatch && destinationMatch && dateMatch && cabinMatch;
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
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        padding: "40px",
        backgroundColor: "#f5f5f5",
        minHeight: "100vh"
      }}
    >
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <h1>Award Travel Finder ✈️</h1>
        <p>Find the best way to fly using points.</p>

        <div
          style={{
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "12px",
            marginBottom: "30px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.08)"
          }}
        >
          <h2>Search</h2>

          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
              marginBottom: "15px"
            }}
          >
            <select
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              style={{ padding: "10px", minWidth: "180px" }}
            >
              <option value="ALL">All origins</option>
              <option value="MDE">MDE</option>
              <option value="BOG">BOG</option>
            </select>

            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              style={{ padding: "10px", minWidth: "180px" }}
            >
              <option value="ALL">All destinations</option>
              <option value="MAD">MAD</option>
              <option value="CDG">CDG</option>
              <option value="AMS">AMS</option>
            </select>

            <select
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={{ padding: "10px", minWidth: "180px" }}
            >
              <option value="ALL">All dates</option>
              <option value="2026-06-10">2026-06-10</option>
              <option value="2026-06-12">2026-06-12</option>
              <option value="2026-06-15">2026-06-15</option>
            </select>

            <select
              value={cabin}
              onChange={(e) => setCabin(e.target.value)}
              style={{ padding: "10px", minWidth: "180px" }}
            >
              <option value="Business">Business</option>
              <option value="Economy">Economy</option>
              <option value="ALL">All cabins</option>
            </select>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={handleSearch}
              style={{
                padding: "10px 16px",
                backgroundColor: "black",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer"
              }}
            >
              Find Awards
            </button>

            <button
              onClick={handleReset}
              style={{
                padding: "10px 16px",
                backgroundColor: "white",
                color: "black",
                border: "1px solid #ccc",
                borderRadius: "8px",
                cursor: "pointer"
              }}
            >
              Reset
            </button>
          </div>
        </div>

        <h2>Results</h2>

        {results.length === 0 ? (
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "12px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.08)"
            }}
          >
            <p>No results found.</p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "16px"
            }}
          >
            {results.map((result, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: "white",
                  padding: "20px",
                  borderRadius: "12px",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.08)"
                }}
              >
                <h3>{result.program}</h3>
                <p>
                  {result.origin} to {result.destination}
                </p>
                <p>{result.date}</p>
                <p>
                  <strong>{result.cabin}</strong>
                </p>
                <p>
                  <strong>{result.miles.toLocaleString()}</strong> miles
                </p>
                <p>
                  <strong>${result.taxes}</strong> taxes
                </p>
                <p>{result.notes}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
