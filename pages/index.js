import { useMemo, useState } from "react";

const cities = [
  { city: "Medellin", airport: "MDE" },
  { city: "Bogota", airport: "BOG" },
  { city: "Cartagena", airport: "CTG" },
  { city: "Cali", airport: "CLO" },
  { city: "Mexico City", airport: "MEX" },
  { city: "Lima", airport: "LIM" },
  { city: "Santiago", airport: "SCL" },
  { city: "Buenos Aires", airport: "EZE" },
  { city: "Sao Paulo", airport: "GRU" },
  { city: "Miami", airport: "MIA" },
  { city: "Houston", airport: "IAH" },
  { city: "New York", airport: "JFK" },
  { city: "Dallas", airport: "DFW" },
  { city: "Madrid", airport: "MAD" },
  { city: "Paris", airport: "CDG" },
  { city: "Amsterdam", airport: "AMS" },
  { city: "London", airport: "LHR" },
  { city: "Frankfurt", airport: "FRA" },
  { city: "Rome", airport: "FCO" },
  { city: "Lisbon", airport: "LIS" },
  { city: "Dubai", airport: "DXB" },
  { city: "Doha", airport: "DOH" }
];

const routeTemplates = [
  { program: "Iberia Avios", origin: "BOG", destination: "MAD", cabin: "Business", baseMiles: 42500, baseTaxes: 120, baseCash: 2200 },
  { program: "Flying Blue", origin: "BOG", destination: "CDG", cabin: "Business", baseMiles: 55000, baseTaxes: 210, baseCash: 2400 },
  { program: "LifeMiles", origin: "MDE", destination: "MAD", cabin: "Business", baseMiles: 63000, baseTaxes: 78, baseCash: 2100 },
  { program: "Flying Blue", origin: "MDE", destination: "AMS", cabin: "Business", baseMiles: 59000, baseTaxes: 195, baseCash: 2350 },
  { program: "Iberia Avios", origin: "MEX", destination: "MAD", cabin: "Business", baseMiles: 51000, baseTaxes: 150, baseCash: 2400 },
  { program: "Flying Blue", origin: "GRU", destination: "CDG", cabin: "Business", baseMiles: 55000, baseTaxes: 250, baseCash: 2700 },
  { program: "LifeMiles", origin: "LIM", destination: "MAD", cabin: "Business", baseMiles: 65000, baseTaxes: 85, baseCash: 2300 },
  { program: "AAdvantage", origin: "BOG", destination: "MIA", cabin: "Business", baseMiles: 30000, baseTaxes: 80, baseCash: 900 },
  { program: "United", origin: "MDE", destination: "IAH", cabin: "Business", baseMiles: 35000, baseTaxes: 70, baseCash: 950 },
  { program: "Flying Blue", origin: "SCL", destination: "CDG", cabin: "Business", baseMiles: 64000, baseTaxes: 240, baseCash: 2600 },
  { program: "Iberia Avios", origin: "EZE", destination: "MAD", cabin: "Business", baseMiles: 59000, baseTaxes: 170, baseCash: 2550 }
];

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function hashString(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) % 1000000;
  }
  return h;
}

function calcCpp(cashPrice, taxes, miles) {
  if (!miles) return 0;
  return ((cashPrice - taxes) / miles) * 100;
}

function dealLabel(cpp) {
  if (cpp >= 4.5) return "Excellent";
  if (cpp >= 3.2) return "Good";
  if (cpp >= 2.0) return "Average";
  return "Weak";
}

function buildResult(route, date) {
  const seed = hashString(route.origin + route.destination + route.program + route.cabin + date);
  const milesAdj = 1 + (((seed % 11) - 5) * 0.03);
  const taxesAdj = 1 + (((seed % 7) - 3) * 0.04);
  const cashAdj = 1 + (((seed % 13) - 6) * 0.05);

  const miles = Math.round((route.baseMiles * milesAdj) / 500) * 500;
  const taxes = Math.round(clamp(route.baseTaxes * taxesAdj, 5, 2000));
  const cashPrice = Math.round(clamp(route.baseCash * cashAdj, 60, 10000));
  const cpp = calcCpp(cashPrice, taxes, miles);

  return {
    ...route,
    date,
    miles,
    taxes,
    cashPrice,
    cpp,
    valueLabel: dealLabel(cpp)
  };
}

function nearbyDates(dateStr) {
  const base = new Date(dateStr);
  const out = [];

  for (let i = -3; i <= 3; i++) {
    const d = new Date(base);
    d.setDate(d.getDate() + i);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    out.push(`${y}-${m}-${day}`);
  }

  return out;
}

function findAirportCode(input) {
  const value = input.trim().toLowerCase();

  for (let i = 0; i < cities.length; i++) {
    const cityMatch = cities[i].city.toLowerCase() === value;
    const airportMatch = cities[i].airport.toLowerCase() === value;
    if (cityMatch || airportMatch) return cities[i].airport;
  }

  return "";
}

function AutocompleteInput({
  label,
  value,
  setValue,
  placeholder
}) {
  const [isOpen, setIsOpen] = useState(false);

  const suggestions = useMemo(() => {
    if (!value.trim()) return cities.slice(0, 8);

    return cities.filter((item) => {
      const text = value.toLowerCase();
      return (
        item.city.toLowerCase().includes(text) ||
        item.airport.toLowerCase().includes(text)
      );
    }).slice(0, 8);
  }, [value]);

  return (
    <div style={{ position: "relative" }}>
      <label style={labelStyle}>{label}</label>
      <input
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        placeholder={placeholder}
        style={inputStyle}
      />

      {isOpen && suggestions.length > 0 ? (
        <div style={suggestionsBoxStyle}>
          {suggestions.map((item) => (
            <button
              key={item.city + item.airport}
              type="button"
              onClick={() => {
                setValue(item.city);
                setIsOpen(false);
              }}
              style={suggestionButtonStyle}
            >
              <div style={{ fontWeight: "bold", color: "#111" }}>{item.city}</div>
              <div style={{ fontSize: "12px", color: "#667" }}>{item.airport}</div>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default function Home() {
  const [originCity, setOriginCity] = useState("Medellin");
  const [destinationCity, setDestinationCity] = useState("Madrid");
  const [date, setDate] = useState("2026-06-10");
  const [cabin, setCabin] = useState("Business");
  const [searched, setSearched] = useState(false);

  const results = useMemo(() => {
    const originCode = findAirportCode(originCity);
    const destinationCode = findAirportCode(destinationCity);

    if (!originCode || !destinationCode || !date) return [];

    const matchingRoutes = routeTemplates.filter((r) => {
      return (
        r.origin === originCode &&
        r.destination === destinationCode &&
        (cabin === "ALL" || r.cabin === cabin)
      );
    });

    if (matchingRoutes.length === 0) return [];

    const datesToShow = nearbyDates(date);
    const built = [];

    for (let i = 0; i < matchingRoutes.length; i++) {
      for (let j = 0; j < datesToShow.length; j++) {
        built.push(buildResult(matchingRoutes[i], datesToShow[j]));
      }
    }

    return built.sort((a, b) => b.cpp - a.cpp);
  }, [originCity, destinationCity, date, cabin]);

  const shownResults = searched ? results : [];

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <div style={heroStyle}>
          <h1 style={titleStyle}>Award Travel Finder ✈️</h1>
          <p style={subtitleStyle}>
            Type city names, choose a date, and compare cash vs award pricing.
          </p>
        </div>

        <div style={searchCardStyle}>
          <h2 style={{ marginTop: 0 }}>Search flights</h2>

          <div style={gridStyle}>
            <AutocompleteInput
              label="From"
              value={originCity}
              setValue={setOriginCity}
              placeholder="Type a city or airport"
            />

            <AutocompleteInput
              label="To"
              value={destinationCity}
              setValue={setDestinationCity}
              placeholder="Type a city or airport"
            />

            <div>
              <label style={labelStyle}>Departure date</label>
              <input
                type="date"
                value={date}
                min="2026-01-01"
                max="2026-12-31"
                onChange={(e) => setDate(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Cabin</label>
              <select
                value={cabin}
                onChange={(e) => setCabin(e.target.value)}
                style={inputStyle}
              >
                <option value="Business">Business</option>
                <option value="Economy">Economy</option>
                <option value="ALL">All cabins</option>
              </select>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 18, flexWrap: "wrap" }}>
            <button onClick={() => setSearched(true)} style={primaryButtonStyle}>
              Find Awards
            </button>

            <button
              onClick={() => {
                setOriginCity("Medellin");
                setDestinationCity("Madrid");
                setDate("2026-06-10");
                setCabin("Business");
                setSearched(false);
              }}
              style={secondaryButtonStyle}
            >
              Reset
            </button>
          </div>
        </div>

        {searched ? (
          shownResults.length === 0 ? (
            <div style={emptyStyle}>
              <p style={{ marginTop: 0 }}>No sample routes found for that city pair yet.</p>
              <p style={{ marginBottom: 0 }}>
                Try Medellin → Madrid, Bogota → Madrid, Bogota → Paris, Mexico City → Madrid, Sao Paulo → Paris, Lima → Madrid, or Bogota → Miami.
              </p>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: 16 }}>
                <h2 style={{ marginBottom: 6 }}>Results ({shownResults.length})</h2>
                <p style={{ color: "#666", marginTop: 0 }}>
                  Showing the selected date plus nearby dates.
                </p>
              </div>

              <div style={resultsGridStyle}>
                {shownResults.map((r, i) => (
                  <div key={i} style={cardStyle}>
                    <div style={pillStyle}>{r.valueLabel}</div>

                    <h3 style={{ marginTop: 0, marginBottom: 8 }}>{r.program}</h3>

                    <p style={mutedStyle}>
                      {r.origin} → {r.destination} · {r.date}
                    </p>

                    <div style={statsGridStyle}>
                      <div style={statBoxStyle}>
                        <div style={smallLabelStyle}>Cash</div>
                        <div style={bigValueStyle}>${r.cashPrice}</div>
                      </div>

                      <div style={statBoxStyle}>
                        <div style={smallLabelStyle}>Award</div>
                        <div style={bigValueStyle}>{r.miles.toLocaleString()}</div>
                        <div style={tinyTextStyle}>miles + ${r.taxes}</div>
                      </div>

                      <div style={statBoxStyle}>
                        <div style={smallLabelStyle}>CPP</div>
                        <div style={bigValueStyle}>{r.cpp.toFixed(1)}</div>
                      </div>

                      <div style={statBoxStyle}>
                        <div style={smallLabelStyle}>Cabin</div>
                        <div style={bigValueStyle}>{r.cabin}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )
        ) : (
          <div style={emptyStyle}>
            <p style={{ margin: 0 }}>
              Start typing a city name and choose from the suggestions.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

const pageStyle = {
  fontFamily: "Arial, sans-serif",
  backgroundColor: "#f4f7fb",
  minHeight: "100vh",
  padding: "32px 18px"
};

const containerStyle = {
  maxWidth: "1140px",
  margin: "0 auto"
};

const heroStyle = {
  marginBottom: "24px"
};

const titleStyle = {
  fontSize: "42px",
  marginBottom: "8px"
};

const subtitleStyle = {
  color: "#556",
  fontSize: "18px",
  marginTop: 0
};

const searchCardStyle = {
  backgroundColor: "white",
  borderRadius: "18px",
  padding: "24px",
  boxShadow: "0 10px 28px rgba(0,0,0,0.08)",
  marginBottom: "26px"
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "14px"
};

const labelStyle = {
  display: "block",
  fontSize: "14px",
  color: "#556",
  marginBottom: "8px"
};

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "12px 14px",
  borderRadius: "12px",
  border: "1px solid #d6dce5",
  fontSize: "15px",
  backgroundColor: "white"
};

const suggestionsBoxStyle = {
  position: "absolute",
  top: "100%",
  left: 0,
  right: 0,
  backgroundColor: "white",
  border: "1px solid #d6dce5",
  borderRadius: "12px",
  marginTop: "6px",
  boxShadow: "0 10px 24px rgba(0,0,0,0.10)",
  overflow: "hidden",
  zIndex: 20
};

const suggestionButtonStyle = {
  display: "block",
  width: "100%",
  textAlign: "left",
  padding: "12px 14px",
  border: "none",
  backgroundColor: "white",
  cursor: "pointer"
};

const primaryButtonStyle = {
  padding: "12px 18px",
  backgroundColor: "#111",
  color: "white",
  border: "none",
  borderRadius: "12px",
  cursor: "pointer",
  fontSize: "15px"
};

const secondaryButtonStyle = {
  padding: "12px 18px",
  backgroundColor: "white",
  color: "#111",
  border: "1px solid #d6dce5",
  borderRadius: "12px",
  cursor: "pointer",
  fontSize: "15px"
};

const emptyStyle = {
  backgroundColor: "white",
  padding: "24px",
  borderRadius: "18px",
  boxShadow: "0 10px 28px rgba(0,0,0,0.08)"
};

const resultsGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: "18px"
};

const cardStyle = {
  backgroundColor: "white",
  borderRadius: "18px",
  padding: "22px",
  boxShadow: "0 10px 28px rgba(0,0,0,0.08)"
};

const pillStyle = {
  display: "inline-block",
  padding: "6px 12px",
  backgroundColor: "#111",
  color: "white",
  borderRadius: "999px",
  fontSize: "12px",
  marginBottom: "14px"
};

const mutedStyle = {
  color: "#667",
  marginTop: 0,
  marginBottom: "14px"
};

const statsGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: "10px"
};

const statBoxStyle = {
  backgroundColor: "#f7f9fc",
  borderRadius: "14px",
  padding: "12px"
};

const smallLabelStyle = {
  fontSize: "12px",
  color: "#667",
  marginBottom: "4px"
};

const bigValueStyle = {
  fontSize: "22px",
  fontWeight: "bold",
  color: "#111"
};

const tinyTextStyle = {
  fontSize: "12px",
  color: "#667",
  marginTop: "2px"
};
