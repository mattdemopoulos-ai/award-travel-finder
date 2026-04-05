export default function Home() {
  const results = [
    {
      tag: "Best Overall",
      program: "Iberia Avios",
      route: "BOG → MAD",
      miles: "42,500",
      taxes: "$120",
      cpp: "4.9",
      notes: "Excellent nonstop sweet spot"
    },
    {
      tag: "Best Value",
      program: "Flying Blue",
      route: "BOG → CDG",
      miles: "55,000",
      taxes: "$210",
      cpp: "4.2",
      notes: "Good availability and transfer options"
    },
    {
      tag: "Lowest Fees",
      program: "LifeMiles",
      route: "MDE → MAD",
      miles: "63,000",
      taxes: "$78",
      cpp: "3.8",
      notes: "Lower fees, one-stop option"
    }
  ];

  return (
    <div style={{ 
      fontFamily: "Arial, sans-serif",
      background: "#f7f7f7",
      minHeight: "100vh",
      padding: "40px 20px"
    }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "48px", marginBottom: "12px" }}>
            Award Travel Finder ✈️
          </h1>
          <p style={{ fontSize: "20px", color: "#555", margin: 0 }}>
            Find the best way to fly business class using points
          </p>
        </div>

        <div style={{
          background: "white",
          borderRadius: "16px",
          padding: "24px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
          marginBottom: "32px"
        }}>
          <h2 style={{ marginTop: 0 }}>Search awards</h2>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "12px",
            marginBottom: "16px"
          }}>
            <input placeholder="Origin (e.g. MDE)" style={inputStyle} />
            <input placeholder="Destination (e.g. MAD)" style={inputStyle} />
            <input placeholder="Departure date" style={inputStyle} />
            <select style={inputStyle}>
              <option>Business</option>
              <option>Economy</option>
              <option>First</option>
            </select>
            <select style={inputStyle}>
              <option>1 Passenger</option>
              <option>2 Passengers</option>
            </select>
          </div>

          <button style={buttonStyle}>
            Find Awards
          </button>
        </div>

        <div>
          <h2 style={{ marginBottom: "16px" }}>Sample results</h2>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "18px"
          }}>
            {results.map((r, i) => (
              <div key={i} style={{
                background: "white",
                borderRadius: "16px",
                padding: "22px",
                boxShadow: "0 8px 24px rgba(0,0,0,0.08)"
              }}>
                <div style={{
                  display: "inline-block",
                  background: "#111",
                  color: "white",
                  borderRadius: "999px",
                  padding: "6px 12px",
                  fontSize: "12px",
                  marginBottom: "14px"
                }}>
                  {r.tag}
                </div>

                <h3 style={{ margin: "0 0 8px 0", fontSize: "24px" }}>
                  {r.program}
                </h3>

                <p style={{ color: "#666", marginTop: 0 }}>{r.route}</p>

                <div style={{ margin: "16px 0" }}>
                  <p style={statStyle}><strong>{r.miles}</strong> miles</p>
                  <p style={statStyle}><strong>{r.taxes}</strong> taxes</p>
                  <p style={statStyle}><strong>{r.cpp} cpp</strong></p>
                </div>

                <p style={{ color: "#444" }}>{r.notes}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  padding: "14px 16px",
  borderRadius: "10px",
  border: "1px solid #ddd",
  fontSize: "16px",
  width: "100%",
  boxSizing: "border-box"
};

const buttonStyle = {
  background: "#111",
  color: "white",
  border: "none",
  borderRadius: "10px",
  padding: "14px 20px",
  fontSize: "16px",
  cursor: "pointer"
};

const statStyle = {
  margin: "6px 0",
  fontSize: "16px"
};
