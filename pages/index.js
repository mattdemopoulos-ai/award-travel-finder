import { useMemo, useState } from "react";

function makeDates() {
  const out = [];
  const start = new Date("2026-06-01");
  const end = new Date("2027-02-28");
  const d = new Date(start);

  while (d <= end) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    out.push(`${y}-${m}-${day}`);
    d.setDate(d.getDate() + 1);
  }

  return out;
}

const dates = makeDates();

const origins = [
  "ALL", "MDE", "BOG", "CTG", "CLO", "MEX", "LIM", "SCL", "EZE", "GRU", "GIG",
  "UIO", "PTY", "SJO", "SDQ", "PUJ", "AUA", "CUR", "MIA", "JFK", "DFW", "LAX", "IAH", "ORD"
];

const destinations = [
  "ALL", "MAD", "BCN", "CDG", "AMS", "LHR", "FRA", "FCO", "LIS", "DUB",
  "ZRH", "ATH", "IST", "DXB", "DOH", "MIA", "JFK", "DFW", "LAX", "IAH", "ORD"
];

const cabins = ["Business", "Economy", "ALL"];

const routeTemplates = [
  {
    program: "Iberia Avios",
    origin: "BOG",
    destination: "MAD",
    cabin: "Business",
    baseMiles: 42500,
    baseTaxes: 120,
    baseCash: 2200,
    transferPartners: ["Amex", "Chase", "Capital One"],
    bookingInstructions: "Transfer points to Iberia Avios and book on Iberia.com."
  },
  {
    program: "Flying Blue",
    origin: "BOG",
    destination: "CDG",
    cabin: "Business",
    baseMiles: 55000,
    baseTaxes: 210,
    baseCash: 2400,
    transferPartners: ["Amex", "Chase", "Citi", "Capital One"],
    bookingInstructions: "Transfer points to Flying Blue and book on Air France or KLM."
  },
  {
    program: "LifeMiles",
    origin: "MDE",
    destination: "MAD",
    cabin: "Business",
    baseMiles: 63000,
    baseTaxes: 78,
    baseCash: 2100,
    transferPartners: ["Amex", "Citi", "Capital One"],
    bookingInstructions: "Transfer points to LifeMiles and search on LifeMiles.com."
  },
  {
    program: "Flying Blue",
    origin: "MDE",
    destination: "AMS",
    cabin: "Business",
    baseMiles: 59000,
    baseTaxes: 195,
    baseCash: 2350,
    transferPartners: ["Amex", "Chase", "Citi", "Capital One"],
    bookingInstructions: "Transfer points to Flying Blue and book online."
  },
  {
    program: "Iberia Avios",
    origin: "MEX",
    destination: "MAD",
    cabin: "Business",
    baseMiles: 51000,
    baseTaxes: 150,
    baseCash: 2400,
    transferPartners: ["Amex", "Chase", "Capital One"],
    bookingInstructions: "Transfer points to Iberia Avios and book on Iberia.com."
  },
  {
    program: "Flying Blue",
    origin: "GRU",
    destination: "CDG",
    cabin: "Business",
    baseMiles: 55000,
    baseTaxes: 250,
    baseCash: 2700,
    transferPartners: ["Amex", "Chase", "Citi", "Capital One"],
    bookingInstructions: "Transfer points to Flying Blue and book on Air France."
  },
  {
    program: "LifeMiles",
    origin: "LIM",
    destination: "MAD",
    cabin: "Business",
    baseMiles: 65000,
    baseTaxes: 85,
    baseCash: 2300,
    transferPartners: ["Amex", "Citi", "Capital One"],
    bookingInstructions: "Transfer points to LifeMiles and search Star Alliance options."
  },
  {
    program: "AAdvantage",
    origin: "BOG",
    destination: "MIA",
    cabin: "Business",
    baseMiles: 30000,
    baseTaxes: 80,
    baseCash: 900,
    transferPartners: ["Bilt"],
    bookingInstructions: "Book directly through American Airlines using AAdvantage miles."
  },
  {
    program: "United MileagePlus",
    origin: "MDE",
    destination: "IAH",
    cabin: "Business",
    baseMiles: 35000,
    baseTaxes: 70,
    baseCash: 950,
    transferPartners: ["Chase", "Bilt"],
    bookingInstructions: "Transfer Chase points to United and book on United.com."
  },
  {
    program: "Iberia Avios",
    origin: "CTG",
    destination: "MAD",
    cabin: "Economy",
    baseMiles: 28000,
    baseTaxes: 110,
    baseCash: 700,
    transferPartners: ["Amex", "Chase", "Capital One"],
    bookingInstructions: "Transfer points to Iberia Avios and book on Iberia.com."
  }
];

function hashString(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) % 1000000;
  }
  return h;
}

function clamp(num, min, max) {
  return Math.max(min, Math.min(max, num));
}

function calculateCpp(cashPrice, taxes, miles) {
  if (!miles) return 0;
  return Math.max(0, ((cashPrice - taxes) / miles) * 100);
}

function labelDeal(cpp) {
  if (cpp >= 4.5) return "Excellent redemption";
  if (cpp >= 3.2) return "Good redemption";
  if (cpp >= 2.0) return "Average redemption";
  return "Weak redemption";
}

function buildAllResults() {
  const results = [];

  routeTemplates.forEach((route) => {
    dates.forEach((date) => {
      const seed = hashString(
        `${route.origin}-${route.destination}-${route.program}-${route.cabin}-${date}`
      );

      const milesFactor = ((seed % 11) - 5) * 0.03;
      const taxesFactor = ((seed % 7) - 3) * 0.04;
      const cashFactor = ((seed % 13) - 6) * 0.05;

      const miles = Math.round(route.baseMiles * (1 + milesFactor) / 500) * 500;
      const taxes = Math.round(clamp(route.baseTaxes * (1 + taxesFactor), 5, 1500));
      const cashPrice = Math.round(clamp(route.baseCash * (1 + cashFactor), 60, 10000));

      const cpp = calculateCpp(cashPrice, taxes, miles);

      results.push({
        program: route.program,
        origin: route.origin,
        destination: route.destination,
        date,
        cabin: route.cabin,
        miles,
        taxes,
        cashPrice,
        cpp,
        dealLabel: labelDeal(cpp),
        transferPartners: route.transferPartners,
        bookingInstructions: route.bookingInstructions
      });
    });
  });

  return results;
}

const allResults = buildAllResults();

function getBadges(results) {
  const badges = {};
  if (results.length === 0) return badges;

  let bestOverall = 0;
  let bestValue = 0;
  let lowestMiles = 0;
  let lowestCash = 0;

  for (let i = 1; i < results.length; i++) {
    const currentScore = results[i].cpp * 10 - results[i].taxes / 20;
    const bestOverallScore = results[bestOverall].cpp * 10 - results[bestOverall].taxes / 20;

    if (currentScore > bestOverallScore) bestOverall = i;
    if (results[i].cpp > results[bestValue].cpp) bestValue = i;
    if (results[i].miles < results[lowestMiles].miles) lowestMiles = i;
    if (results[i].cashPrice < results[lowestCash].cashPrice) lowestCash = i;
  }

  badges[bestOverall] = "Best Overall";
  if (bestValue !== bestOverall) badges[bestValue] = "Best Value";
  if (lowestMiles !== bestOverall && lowestMiles !== bestValue) badges[lowestMiles] = "Lowest Miles";
  if (
    lowestCash !== bestOverall &&
    lowestCash !== bestValue &&
    lowestCash !== lowestMiles
  ) {
    badges[lowestCash] = "Lowest Cash";
  }

  return badges;
}

export default function Home() {
  const [origin, setOrigin] = use
