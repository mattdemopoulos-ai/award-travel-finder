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
    current.setDate(current.getDate() + 1);
  }

  return dates;
}

const dateOptions = generateDates();

const origins = [
  "ALL",
  "MDE",
  "BOG",
  "CTG",
  "CLO",
  "MEX",
  "GDL",
  "MTY",
  "LIM",
  "SCL",
  "EZE",
  "GRU",
  "GIG",
  "UIO",
  "PTY",
  "SJO",
  "SAL",
  "SDQ",
  "PUJ",
  "AUA",
  "CUR",
  "MIA",
  "JFK",
  "DFW",
  "LAX",
  "IAH",
  "ORD"
];

const destinations = [
  "ALL",
  "MAD",
  "BCN",
  "CDG",
  "AMS",
  "LHR",
  "FRA",
  "FCO",
  "LIS",
  "DUB",
  "ZRH",
  "ATH",
  "IST",
  "DXB",
  "DOH",
  "MIA",
  "JFK",
  "DFW",
  "LAX",
  "IAH",
  "ORD"
];

const cabins = ["Business", "Economy", "ALL"];

const routeTemplates = [
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
    bookingInstructions: "Transfer points to LifeMiles and book Star Alliance options on LifeMiles.com.",
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
    transferPartners: ["Amex", "Chase
