import { useMemo, useState } from "react";

function generateDates() {
  const dates = [];
  const start = new Date("2026-06-01");
  const end = new Date("2027-02-28");
  const current = new Date(start);

  while (current <= end) {
    const yyyy = current.getFullYear();
    const mm = String(current.getMonth() + 1).padStart(2, "0");
    const dd = String(current.getDate()).padStart(2, "0");
    dates.push(`${yyyy}-${mm}-${dd}`);
    current.setDate(current.getDate() + 7);
  }

  return dates;
}

const dateOptions = generateDates();

const allResults = [
  {
    program: "Iberia Avios",
    origin: "BOG",
    destination: "MAD",
    cabin: "Business",
    miles: 42500,
    taxes: 120,
    cashPrice: 2200,
    transferPartners: ["Amex", "Chase", "Capital One"],
    bookingInstructions: "Transfer points to Iberia Avios and book on Iberia.com.",
    easeScore: 9
  },
  {
    program: "Flying Blue",
    origin: "BOG",
    destination: "CDG",
    cabin: "Business",
    miles: 55000,
    taxes: 210,
    cashPrice: 2400,
    transferPartners: ["Amex", "Chase", "Citi", "Capital One"],
    bookingInstructions: "Transfer points to Flying Blue and book on Air France or KLM.",
    easeScore: 8
  },
  {
    program: "LifeMiles",
    origin: "MDE",
    destination: "MAD",
    cabin: "Business",
    miles: 63000,
    taxes: 78,
    cashPrice: 2100,
    transferPartners: ["Amex", "Citi", "Capital One"],
    bookingInstructions: "Transfer points to LifeMiles and search partner awards on LifeMiles.com.",
    easeScore: 7
  },
  {
    program: "Flying Blue",
    origin: "MDE",
    destination: "AMS",
    cabin: "Business",
    miles: 59000,
    taxes: 195,
    cashPrice: 2350,
    transferPartners: ["Amex", "Chase", "Citi", "Capital One"],
    bookingInstructions: "Transfer points to Flying Blue and book online.",
    easeScore: 8
  },
  {
    program: "Iberia Avios",
    origin: "MDE",
    destination: "MAD",
    cabin: "Economy",
    miles: 25500,
    taxes: 95,
    cashPrice: 650,
    transferPartners: ["Amex", "Chase", "Capital One"],
    bookingInstructions: "Transfer points to Iberia Avios and book on Iberia.com.",
    easeScore: 9
  },
  {
    program: "AAdvantage",
    origin: "BOG",
    destination: "MIA",
    cabin: "Business",
    miles: 30000,
    taxes: 80,
    cashPrice: 900,
    transferPartners: ["Bilt"],
    bookingInstructions: "Book directly through American Airlines using AAdvantage miles.",
    easeScore: 8
  },
  {
    program: "United MileagePlus",
    origin: "MDE",
    destination: "IAH",
    cabin: "Business",
    miles: 35000,
    taxes: 70,
    cashPrice: 950,
    transferPartners: ["Chase", "Bilt"],
    bookingInstructions: "Transfer Chase points to United and book on United.com.",
    easeScore: 9
  },
  {
    program: "Flying Blue",
    origin: "GRU",
    destination: "CDG",
    cabin: "Business",
    miles: 55000,
    taxes: 250,
    cashPrice: 2700,
    transferPartners: ["Amex", "Chase", "Citi", "Capital One"],
    bookingInstructions: "Transfer points to Flying Blue and book on Air France.",
    easeScore: 8
  },
  {
    program: "Iberia Avios",
    origin: "MEX",
    destination: "MAD",
    cabin: "Business",
    miles: 51000,
    taxes: 150,
    cashPrice: 2400,
    transferPartners: ["Amex", "Chase", "Capital One"],
    bookingInstructions: "Transfer points to Iberia Avios and book on Iberia.com.",
    easeScore: 9
  },
  {
    program: "LifeMiles",
    origin: "LIM",
    destination: "MAD",
    cabin: "Business",
    miles: 65000,
    taxes: 85,
    cashPrice: 2300,
    transferPartners: ["Amex", "Citi", "Capital One"],
    bookingInstructions: "Transfer points to LifeMiles and search Star Alliance options.",
    easeScore: 7
  },
  {
    program: "Flying Blue",
    origin: "BOG",
    destination: "AMS",
    cabin: "Business",
    miles: 57000,
    taxes: 205,
    cashPrice: 2450,
    transferPartners: ["Amex", "Chase", "Citi", "Capital One"],
    bookingInstructions: "Transfer points to Flying Blue and book online.",
    easeScore: 8
  },
  {
    program: "Iberia Avios",
    origin: "LIM",
    destination: "MAD",
    cabin: "Business",
    miles: 49000,
    taxes: 140,
    cashPrice: 2250,
    transferPartners: ["Amex", "Chase", "Capital One"],
    bookingInstructions: "Transfer points to Iberia Avios and book on Iberia.com.",
    easeScore: 9
  }
];

const origins = ["ALL", "MDE", "BOG", "GRU", "MEX", "LIM"];
const destinations = ["ALL", "MAD", "CDG", "AMS", "MIA", "IAH"];
const cabins = ["Business", "Economy", "ALL"];

function calculateCpp(cashPrice, taxes, miles) {
  if (!miles || miles <= 0) return 0;
  const value = ((cashPrice - taxes) / miles) * 100;
  return Math.max(0, value);
}

function calculateScore(result) {
  const cpp = calculateCpp(result.cashPrice, result.taxes, result.miles);

  let score = 0;
  score += Math.max(0, 35 - result.miles / 2500);
  score += Math.max(0, 20 - result.taxes / 15);
  score += Math.min(20, cpp * 4);
  score += result.easeScore * 2.5;

  return Math.round(score);
}

function getBadges(results) {
  if (results.length === 0) return {};

  let bestOverallIndex = 0;
  let bestValueIndex = 0;
  let lowestFeesIndex = 0;
  let easiestBookingIndex = 0;

  for (let i = 1; i < results.length; i++) {
    if (results[i].score > results[bestOverallIndex].score) bestOverallIndex = i;
    if (results[i].cpp > results[bestValueIndex].cpp) bestValueIndex = i;
    if (results[i].taxes < results[lowestFeesIndex].taxes) lowestFeesIndex = i;
    if (results[i].easeScore > results[easiestBookingIndex].easeScore) easiestBookingIndex = i;
  }

  const badges = {};

  badges[bestOverallIndex] = "Best Overall";
  if (bestValueIndex !== bestOverallIndex) badges[bestValueIndex] = "Best Value";
  if (
    lowestFeesIndex !== bestOverallIndex &&
    lowestFeesIndex !== bestValueIndex
  ) {
    badges[lowestFeesIndex] = "Lowest Fees";
  }
  if (
    easiestBookingIndex !== bestOverallIndex &&
    easiestBookingIndex !== bestValueIndex &&
    easiestBookingIndex !== lowestFeesIndex
  ) {
    badges[easiestBookingIndex] = "Easiest Booking";
  }

  return badges;
}

export default function Home() {
  const [origin, setOrigin] = useState("ALL");
  const [destination, setDestination] = useState("ALL");
  const [date, setDate] = useState("ALL");
  const [cabin, setCabin] = useState("Business");
  const [hasSearched, setHasSearched] = useState(false);

  const filteredResults = useMemo(() => {
    const filtered = allResults
      .filter((r) => {
        return (
          (origin === "ALL" || r.origin === origin) &&
          (destination === "ALL" || r.destination === destination) &&
          (cabin === "ALL" || r.cabin === cabin)
        );
      })
      .map((r) => {
        const cpp = calculateCpp(r.cashPrice, r.taxes, r.miles);
        const score = calculateScore(r);
        return {
          ...r,
          date: date === "ALL" ? dateOptions[0] : date,
          cpp,
          score
        };
      })
      .sort((a, b) => b.score - a.score);

    return filtered;
  }, [origin, destination, date, cabin]);

  const badges = useMemo(() => getBadges(filteredResults), [filteredResults]);

  function handleSearch() {
    setHasSearched(true);
  }

  function handleReset() {
    setOrigin("ALL");
    setDestination("ALL");
    setDate("ALL");
    setCabin("Business");
    setHasSearched(false);
  }

  const displayedResults = hasSearched ? filteredResults : [];

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        padding: "40px 20px",
        backgroundColor: "#f5f7fb",
        minHeight: "100vh"
      }}
    >
      <div style={{ maxWidth: "1150px", margin: "0 auto" }}>
        <div style={{ marginBottom: "24px" }}>
          <h1 style={{ marginBottom: "8px", fontSize: "42px" }}>
            Award Travel Finder ✈️
          </h1>
          <p style={{ color: "#555", marginTop: 0, fontSize: "18px" }}>
            Find the best way to book award flights with points.
          </p>
        </div>

        <div
          style={{
            backgroundColor: "white",
            padding: "24px",
            borderRadius: "16px",
            marginBottom: "28px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.08)"
          }}
        >
          <h2 style={{ marginTop: 0 }}>Search</h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "12px",
              marginBottom: "16px"
            }}
          >
            <select value={origin} onChange={(e) => setOrigin(e.target.value)} style={inputStyle}>
              {origins.map((o) => (
                <option key={o} value={o}>
                  {o === "ALL" ? "All origins" : o}
                </option>
              ))}
            </select>

            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              style={inputStyle}
            >
              {destinations.map((d) => (
                <option key={d} value={d}>
                  {d === "ALL" ? "All destinations" : d}
                </option>
              ))}
            </select>

            <select value={date} onChange={(e) => setDate(e.target.value)} style={inputStyle}>
              <option value="ALL">All dates</option>
              {dateOptions.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            <select value={cabin} onChange={(e) => setCabin(e.target.value)} style={inputStyle}>
              {cabins.map((c) => (
                <option key={c} value={c}>
                  {c === "ALL" ? "All cabins" : c}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button onClick={handleSearch} style={primaryButtonStyle}>
              Find Awards
            </button>
            <button onClick={handleReset} style={secondaryButtonStyle}>
              Reset
            </button>
          </div>
        </div>

        {hasSearched ? (
          <>
            <div style={{ marginBottom: "16px" }}>
              <h2 style={{ marginBottom: "6px" }}>Results ({displayedResults.length})</h2>
              <p style={{ color: "#666", marginTop: 0 }}>
                Ranked by overall value, fees, point value, and booking ease.
              </p>
            </div>

            {displayedResults.length === 0 ? (
              <div style={emptyStyle}>
                <p style={{ margin: 0 }}>No results found for that search.</p>
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                  gap: "18px"
                }}
              >
                {displayedResults.map((r, index) => (
                  <div key={`${r.program}-${r.origin}-${r.destination}-${index}`} style={cardStyle}>
                    {badges[index] ? <div style={badgeStyle}>{badges[index]}</div> : null}

                    <h3 style={{ marginTop: 0, marginBottom: "8px", fontSize: "24px" }}>
                      {r.program}
                    </h3>

                    <p style={{ color: "#666", marginTop: 0, marginBottom: "14px" }}>
                      {r.origin} → {r.destination} · {r.date}
                    </p>

                    <div style={statGridStyle}>
                      <div style={statBoxStyle}>
                        <div style={labelStyle}>Miles</div>
                        <div style={valueStyle}>{r.miles.toLocaleString()}</div>
                      </div>

                      <div style={statBoxStyle}>
                        <div style={labelStyle}>Taxes</div>
                        <div style={valueStyle}>${r.taxes}</div>
                      </div>

                      <div style={statBoxStyle}>
                        <div style={labelStyle}>Cash Price</div>
                        <div style={valueStyle}>${r.cashPrice}</div>
                      </div>

                      <div style={statBoxStyle}>
                        <div style={labelStyle}>CPP</div>
                        <div style={valueStyle}>{r.cpp.toFixed(1)}</div>
                      </div>
                    </div>

                    <p style={{ marginBottom: "8px" }}>
                      <strong>Cabin:</strong> {r.cabin}
                    </p>
                    <p style={{ marginBottom: "8px" }}>
                      <strong>Score:</strong> {r.score}/100
                    </p>
                    <p style={{ marginBottom: "8px" }}>
                      <strong>Transfer partners:</strong> {r.transferPartners.join(", ")}
                    </p>
                    <p style={{ marginBottom: "8px" }}>
                      <strong>How to book:</strong> {r.bookingInstructions}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div style={emptyStyle}>
            <p style={{ margin: 0 }}>
              Choose your route, date, and cabin, then click <strong>Find Awards</strong>.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

const inputStyle = {
  padding: "12px 14px",
  borderRadius: "10px",
  border: "1px solid #d6dbe6",
  fontSize: "15px",
  backgroundColor: "white"
};

const primaryButtonStyle = {
  padding: "12px 18px",
  backgroundColor: "#111",
  color: "white",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontSize: "15px"
};

const secondaryButtonStyle = {
  padding: "12px 18px",
  backgroundColor: "white",
  color: "#111",
  border: "1px solid #d6dbe6",
  borderRadius: "10px",
  cursor: "pointer",
  fontSize: "15px"
};

const cardStyle = {
  backgroundColor: "white",
  padding: "22px",
  borderRadius: "16px",
  boxShadow: "0 8px 24px rgba(0,0,0,0.08)"
};

const badgeStyle = {
  display: "inline-block",
  backgroundColor: "#111",
  color: "white",
  borderRadius: "999px",
  padding: "6px 12px",
  fontSize: "12px",
  marginBottom: "14px"
};

const statGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: "10px",
  marginBottom: "16px"
};

const statBoxStyle = {
  backgroundColor: "#f7f8fb",
  borderRadius: "12px",
  padding: "12px"
};

const labelStyle = {
  fontSize: "12px",
  color: "#666",
  marginBottom: "4px"
};

const valueStyle = {
  fontSize: "20px",
  fontWeight: "bold",
  color: "#111"
};

const emptyStyle = {
  backgroundColor: "white",
  padding: "24px",
  borderRadius: "16px",
  boxShadow: "0 8px 24px rgba(0,0,0,0.08)"
};
