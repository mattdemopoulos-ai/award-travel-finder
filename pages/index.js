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

const airlineInfo = {
  "Iberia Avios": {
    name: "Iberia",
    emoji: "🇪🇸",
    cashUrl: "https://www.iberia.com/",
    pointsUrl: "https://www.iberia.com/"
  },
  "Flying Blue": {
    name: "Air France / KLM",
    emoji: "🇫🇷",
    cashUrl: "https://www.airfrance.com/",
    pointsUrl: "https://www.flyingblue.com/"
  },
  "LifeMiles": {
    name: "Avianca LifeMiles",
    emoji: "✈️",
    cashUrl: "https://www.avianca.com/",
    pointsUrl: "https://www.lifemiles.com/"
  },
  "AAdvantage": {
    name: "American Airlines",
    emoji: "🇺🇸",
    cashUrl: "https://www.aa.com/",
    pointsUrl: "https://www.aa.com/"
  },
  "United": {
    name: "United Airlines",
    emoji: "🇺🇸",
    cashUrl: "https://www.united.com/",
    pointsUrl: "https://www.united.com/"
  }
};

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
  if (cpp >= 4.5) return "Excellent Value";
  if (cpp >= 3.2) return "Good Value";
  if (cpp >= 2.0) return "Average Value";
  return "Weak Value";
}

function dealColor(cpp) {
  if (cpp >= 4.5) return "#16a34a";
  if (cpp >= 3.2) return "#2563eb";
  if (cpp >= 2.0) return "#d97706";
  return "#dc2626";
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

  const info = airlineInfo[route.program] || {
    name: route.program,
    emoji: "✈️",
    cashUrl: "#",
    pointsUrl: "#"
  };

  return {
    ...route,
    date,
    miles,
    taxes,
    cashPrice,
    cpp,
    valueLabel: dealLabel(cpp),
    valueColor: dealColor(cpp),
    airlineName: info.name,
    airlineEmoji: info.emoji,
    cashUrl: info.cashUrl,
    pointsUrl: info.pointsUrl
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

function AutocompleteInput({ label, value, setValue, placeholder }) {
  const [isOpen, setIsOpen] = useState(false);

  const suggestions = useMemo(() => {
    if (!value.trim()) return cities.slice(0, 8);

    return cities
      .filter((item) => {
        const text = value.toLowerCase();
        return (
          item.city.toLowerCase().includes(text) ||
          item.airport.toLowerCase().includes(text)
        );
      })
      .slice(0, 8);
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
              <div style={suggestionTitleStyle}>{item.city}</div>
              <div style={suggestionSubtitleStyle}>{item.airport}</div>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function ResultCard({ r }) {
  return (
    <div style={cardStyle}>
      <div style={cardHeaderStyle}>
        <div>
          <div
            style={{
              ...pillStyle,
              backgroundColor: r.valueColor
            }}
          >
            {r.valueLabel}
          </div>
          <h3 style={routeTitleStyle}>
            {r.origin} → {r.destination}
          </h3>
          <p style={mutedStyle}>{r.date} · {r.cabin}</p>
        </div>

        <div style={brandBoxStyle}>
          <div style={brandEmojiStyle}>{r.airlineEmoji}</div>
          <div style={brandNameStyle}>{r.airlineName}</div>
        </div>
      </div>

      <div style={statsGridStyle}>
        <div style={statBoxStyle}>
          <div style={smallLabelStyle}>Cash fare</div>
          <div style={bigValueStyle}>${r.cashPrice}</div>
        </div>

        <div style={statBoxStyle}>
          <div style={smallLabelStyle}>Award price</div>
          <div style={bigValueStyle}>{r.miles.toLocaleString()}</div>
          <div style={tinyTextStyle}>miles + ${r.taxes}</div>
        </div>

        <div style={statBoxStyle}>
          <div style={smallLabelStyle}>CPP</div>
          <div style={bigValueStyle}>{r.cpp.toFixed(1)}</div>
        </div>

        <div style={statBoxStyle}>
          <div style={smallLabelStyle}>Program</div>
          <div style={programValueStyle}>{r.program}</div>
        </div>
      </div>

      <div style={buttonGroupStyle}>
        <a
          href={r.cashUrl}
          target="_blank"
          rel="noreferrer"
          style={linkButtonPrimaryStyle}
        >
          Book with cash
        </a>

        <a
          href={r.pointsUrl}
          target="_blank"
          rel="noreferrer"
          style={linkButtonSecondaryStyle}
        >
          Book with points
        </a>
      </div>
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
      <div style={backgroundGlowOne} />
      <div style={backgroundGlowTwo} />

      <div style={containerStyle}>
        <div style={heroStyle}>
          <div style={heroBadgeStyle}>Premium award search demo</div>
          <h1 style={titleStyle}>Book smarter with points</h1>
          <p style={subtitleStyle}>
            Search by city, compare cash versus miles, and jump straight to the airline website.
          </p>
        </div>

        <div style={searchCardStyle}>
          <h2 style={sectionTitleStyle}>Search flights</h2>

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

          <div style={buttonRowStyle}>
            <button onClick={() => setSearched(true)} style={primaryButtonStyle}>
              Find awards
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
              <h3 style={{ marginTop: 0, marginBottom: 8 }}>No sample routes found</h3>
              <p style={{ margin: 0, color: "#5f6b7a" }}>
                Try Medellin → Madrid, Bogota → Madrid, Bogota → Paris, Mexico City → Madrid, Sao Paulo → Paris, Lima → Madrid, or Bogota → Miami.
              </p>
            </div>
          ) : (
            <>
              <div style={resultsHeaderStyle}>
                <div>
                  <h2 style={sectionTitleStyle}>Results</h2>
                  <p style={resultsSubtextStyle}>
                    Showing the selected date plus nearby dates.
                  </p>
                </div>
                <div style={resultsCountStyle}>{shownResults.length} options</div>
              </div>

              <div style={resultsGridStyle}>
                {shownResults.map((r, i) => (
                  <ResultCard key={i} r={r} />
                ))}
              </div>
            </>
          )
        ) : (
          <div style={emptyStyle}>
            <p style={{ margin: 0, color: "#5f6b7a" }}>
              Start typing a city name, choose a date, and click <strong>Find awards</strong>.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

const pageStyle = {
  position: "relative",
  overflow: "hidden",
  fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  background: "linear-gradient(180deg, #f8fbff 0%, #eef4ff 100%)",
  minHeight: "100vh",
  padding: "40px 18px"
};

const backgroundGlowOne = {
  position: "absolute",
  top: "-120px",
  right: "-80px",
  width: "340px",
  height: "340px",
  borderRadius: "999px",
  background: "rgba(96, 165, 250, 0.18)",
  filter: "blur(60px)"
};

const backgroundGlowTwo = {
  position: "absolute",
  bottom: "-120px",
  left: "-80px",
  width: "320px",
  height: "320px",
  borderRadius: "999px",
  background: "rgba(167, 139, 250, 0.16)",
  filter: "blur(60px)"
};

const containerStyle = {
  position: "relative",
  zIndex: 1,
  maxWidth: "1140px",
  margin: "0 auto"
};

const heroStyle = {
  marginBottom: "28px"
};

const heroBadgeStyle = {
  display: "inline-block",
  padding: "8px 12px",
  borderRadius: "999px",
  background: "rgba(255,255,255,0.75)",
  border: "1px solid rgba(148,163,184,0.2)",
  color: "#31507a",
  fontSize: "13px",
  fontWeight: 600,
  marginBottom: "14px",
  backdropFilter: "blur(10px)"
};

const titleStyle = {
  fontSize: "52px",
  lineHeight: 1.02,
  letterSpacing: "-0.04em",
  marginBottom: "12px",
  color: "#0f172a",
  maxWidth: "800px"
};

const subtitleStyle = {
  color: "#475569",
  fontSize: "18px",
  lineHeight: 1.6,
  marginTop: 0,
  maxWidth: "760px"
};

const searchCardStyle = {
  background: "rgba(255,255,255,0.8)",
  backdropFilter: "blur(16px)",
  borderRadius: "28px",
  padding: "26px",
  border: "1px solid rgba(148,163,184,0.18)",
  boxShadow: "0 20px 50px rgba(15, 23, 42, 0.08)",
  marginBottom: "28px"
};

const sectionTitleStyle = {
  marginTop: 0,
  marginBottom: 16,
  fontSize: "24px",
  color: "#0f172a",
  letterSpacing: "-0.02em"
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "14px"
};

const labelStyle = {
  display: "block",
  fontSize: "13px",
  fontWeight: 600,
  color: "#475569",
  marginBottom: "8px"
};

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "14px 16px",
  borderRadius: "16px",
  border: "1px solid #dbe4f0",
  fontSize: "15px",
  color: "#0f172a",
  backgroundColor: "#ffffff",
  outline: "none",
  boxShadow: "inset 0 1px 2px rgba(15,23,42,0.03)"
};

const suggestionsBoxStyle = {
  position: "absolute",
  top: "100%",
  left: 0,
  right: 0,
  backgroundColor: "rgba(255,255,255,0.96)",
  border: "1px solid #dbe4f0",
  borderRadius: "16px",
  marginTop: "8px",
  boxShadow: "0 18px 40px rgba(15,23,42,0.12)",
  overflow: "hidden",
  zIndex: 20,
  backdropFilter: "blur(12px)"
};

const suggestionButtonStyle = {
  display: "block",
  width: "100%",
  textAlign: "left",
  padding: "13px 14px",
  border: "none",
  backgroundColor: "white",
  cursor: "pointer"
};

const suggestionTitleStyle = {
  fontWeight: 700,
  color: "#0f172a",
  fontSize: "14px"
};

const suggestionSubtitleStyle = {
  fontSize: "12px",
  color: "#64748b",
  marginTop: "2px"
};

const buttonRowStyle = {
  display: "flex",
  gap: 10,
  marginTop: 20,
  flexWrap: "wrap"
};

const primaryButtonStyle = {
  padding: "14px 20px",
  background: "linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)",
  color: "white",
  border: "none",
  borderRadius: "16px",
  cursor: "pointer",
  fontSize: "15px",
  fontWeight: 700,
  boxShadow: "0 12px 24px rgba(79,70,229,0.22)"
};

const secondaryButtonStyle = {
  padding: "14px 20px",
  backgroundColor: "rgba(255,255,255,0.9)",
  color: "#111",
  border: "1px solid #dbe4f0",
  borderRadius: "16px",
  cursor: "pointer",
  fontSize: "15px",
  fontWeight: 600
};

const emptyStyle = {
  background: "rgba(255,255,255,0.84)",
  backdropFilter: "blur(14px)",
  padding: "26px",
  borderRadius: "24px",
  border: "1px solid rgba(148,163,184,0.16)",
  boxShadow: "0 18px 40px rgba(15,23,42,0.08)"
};

const resultsHeaderStyle = {
  display: "flex",
  alignItems: "end",
  justifyContent: "space-between",
  gap: "12px",
  marginBottom: "18px",
  flexWrap: "wrap"
};

const resultsSubtextStyle = {
  marginTop: 0,
  color: "#64748b"
};

const resultsCountStyle = {
  padding: "10px 14px",
  borderRadius: "999px",
  background: "rgba(255,255,255,0.85)",
  border: "1px solid rgba(148,163,184,0.18)",
  color: "#334155",
  fontWeight: 700
};

const resultsGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
  gap: "18px"
};

const cardStyle = {
  background: "rgba(255,255,255,0.9)",
  backdropFilter: "blur(12px)",
  borderRadius: "26px",
  padding: "22px",
  border: "1px solid rgba(148,163,184,0.16)",
  boxShadow: "0 18px 40px rgba(15,23,42,0.08)"
};

const cardHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  gap: "14px",
  alignItems: "flex-start",
  marginBottom: "16px"
};

const pillStyle = {
  display: "inline-block",
  padding: "7px 12px",
  color: "white",
  borderRadius: "999px",
  fontSize: "12px",
  fontWeight: 700,
  marginBottom: "12px"
};

const routeTitleStyle = {
  marginTop: 0,
  marginBottom: 8,
  fontSize: "24px",
  color: "#0f172a",
  letterSpacing: "-0.02em"
};

const mutedStyle = {
  color: "#64748b",
  marginTop: 0,
  marginBottom: "0"
};

const brandBoxStyle = {
  minWidth: "92px",
  textAlign: "right"
};

const brandEmojiStyle = {
  fontSize: "24px",
  marginBottom: "6px"
};

const brandNameStyle = {
  fontSize: "13px",
  color: "#475569",
  fontWeight: 700
};

const statsGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: "12px",
  marginBottom: "18px"
};

const statBoxStyle = {
  background: "linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)",
  borderRadius: "18px",
  padding: "14px",
  border: "1px solid #e5edf7"
};

const smallLabelStyle = {
  fontSize: "12px",
  color: "#64748b",
  marginBottom: "5px",
  fontWeight: 600
};

const bigValueStyle = {
  fontSize: "22px",
  fontWeight: 800,
  color: "#0f172a",
  letterSpacing: "-0.02em"
};

const tinyTextStyle = {
  fontSize: "12px",
  color: "#64748b",
  marginTop: "4px"
};

const programValueStyle = {
  fontSize: "16px",
  fontWeight: 700,
  color: "#0f172a"
};

const buttonGroupStyle = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap"
};

const linkButtonPrimaryStyle = {
  display: "inline-block",
  padding: "12px 16px",
  borderRadius: "14px",
  textDecoration: "none",
  background: "linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)",
  color: "white",
  fontWeight: 700,
  fontSize: "14px"
};

const linkButtonSecondaryStyle = {
  display: "inline-block",
  padding: "12px 16px",
  borderRadius: "14px",
  textDecoration: "none",
  background: "#ffffff",
  color: "#0f172a",
  border: "1px solid #dbe4f0",
  fontWeight: 700,
  fontSize: "14px"
};
