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
  "CUZ",
  "SCL",
  "EZE",
  "AEP",
  "GRU",
  "GIG",
  "BSB",
  "UIO",
  "GYE",
  "SJO",
  "PTY",
  "SAL",
  "CUN",
  "SDQ",
  "PUJ",
  "AUA",
  "CUR",
  "MIA",
  "JFK",
  "DFW",
  "LAX",
  "IAH",
  "ORD",
  "ATL"
];

const destinations = [
  "ALL",
  "MAD",
  "BCN",
  "CDG",
  "AMS",
  "LHR",
  "FRA",
  "MUC",
  "ZRH",
  "FCO",
  "MXP",
  "LIS",
  "DUB",
  "VIE",
  "PRG",
  "ATH",
  "IST",
  "DOH",
  "DXB",
  "MIA",
  "JFK",
  "DFW",
  "LAX",
  "IAH",
  "ORD"
];

const cabins = ["Business", "Economy", "ALL"];

const baseResults = [
  {
    program: "Iberia Avios",
    origin: "BOG",
    destination: "MAD",
    cabin: "Business",
    miles: 42500,
    taxes: 120,
    cashPrice: 2200,
    transferPartners: ["Amex", "Chase", "Capital One"],
    bookingInstructions: "Transfer points to Iberia Avios and
