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
    const filtered = allResults.filter(function (result) {
      const matchesOrigin = origin === "ALL" || result.origin === origin;
      const matchesDestination =
        destination === "ALL" || result.destination === destination;
      const matchesDate = date === "ALL" || result.date === date;
      const matchesCabin = cabin === "ALL" || result.cabin === cabin;

      return matchesOrigin && matchesDestination && matchesDate && matchesCabin;
    });

    setResults(filtered);
  }

  function handleReset() {
    setOrigin("ALL");
    setDestination("ALL");
    setDate("ALL");
    setCabin("Business");
    setResults(allResu
