export const cities = [
  { city: "Medellin", airport: "MDE", region: "Latin America" },
  { city: "Bogota", airport: "BOG", region: "Latin America" },
  { city: "Mexico City", airport: "MEX", region: "Latin America" },
  { city: "Lima", airport: "LIM", region: "Latin America" },
  { city: "Sao Paulo", airport: "GRU", region: "Latin America" },
  { city: "Buenos Aires", airport: "EZE", region: "Latin America" },

  { city: "Miami", airport: "MIA", region: "United States" },
  { city: "New York", airport: "JFK", region: "United States" },
  { city: "Dallas", airport: "DFW", region: "United States" },
  { city: "Houston", airport: "IAH", region: "United States" },
  { city: "Los Angeles", airport: "LAX", region: "United States" },

  { city: "Madrid", airport: "MAD", region: "Europe" },
  { city: "Paris", airport: "CDG", region: "Europe" },
  { city: "London", airport: "LHR", region: "Europe" },
  { city: "Amsterdam", airport: "AMS", region: "Europe" },
  { city: "Rome", airport: "FCO", region: "Europe" },

  { city: "Tokyo", airport: "HND", region: "Asia" },
  { city: "Bangkok", airport: "BKK", region: "Asia" },
  { city: "Singapore", airport: "SIN", region: "Asia" },
  { city: "Seoul", airport: "ICN", region: "Asia" },
  { city: "Dubai", airport: "DXB", region: "Asia" }
];

export const rewardsPrograms = [
  { name: "American AAdvantage", type: "airline", alliance: "oneworld" },
  { name: "Alaska Mileage Plan", type: "airline", alliance: "oneworld" },
  { name: "United MileagePlus", type: "airline", alliance: "Star Alliance" },
  { name: "Delta SkyMiles", type: "airline", alliance: "SkyTeam" },
  { name: "Air Canada Aeroplan", type: "airline", alliance: "Star Alliance" },
  { name: "Flying Blue", type: "airline", alliance: "SkyTeam" },
  { name: "British Airways Executive Club", type: "airline", alliance: "oneworld" },
  { name: "Iberia Plus", type: "airline", alliance: "oneworld" },
  { name: "Qatar Airways Privilege Club", type: "airline", alliance: "oneworld" },
  { name: "Avianca LifeMiles", type: "airline", alliance: "Star Alliance" },
  { name: "Virgin Atlantic Flying Club", type: "airline", alliance: "SkyTeam" },
  { name: "Singapore KrisFlyer", type: "airline", alliance: "Star Alliance" },
  { name: "Emirates Skywards", type: "airline", alliance: "Independent" },
  { name: "Etihad Guest", type: "airline", alliance: "Independent" },
  { name: "Turkish Miles&Smiles", type: "airline", alliance: "Star Alliance" },
  { name: "Cathay Pacific Asia Miles", type: "airline", alliance: "oneworld" },
  { name: "ANA Mileage Club", type: "airline", alliance: "Star Alliance" },
  { name: "Qantas Frequent Flyer", type: "airline", alliance: "oneworld" },
  { name: "TAP Miles&Go", type: "airline", alliance: "Star Alliance" },
  { name: "Southwest Rapid Rewards", type: "airline", alliance: "Independent" },
  { name: "JetBlue TrueBlue", type: "airline", alliance: "Independent" },
  { name: "Hilton Honors", type: "hotel", alliance: "Hotel" },
  { name: "Marriott Bonvoy", type: "hotel", alliance: "Hotel" },
  { name: "World of Hyatt", type: "hotel", alliance: "Hotel" },
  { name: "IHG One Rewards", type: "hotel", alliance: "Hotel" }
];

export const airlineInfo = {
  "American AAdvantage": { name: "American Airlines", emoji: "🇺🇸", cashUrl: "https://www.aa.com/", pointsUrl: "https://www.aa.com/" },
  "Alaska Mileage Plan": { name: "Alaska Airlines", emoji: "🇺🇸", cashUrl: "https://www.alaskaair.com/", pointsUrl: "https://www.alaskaair.com/" },
  "United MileagePlus": { name: "United Airlines", emoji: "🇺🇸", cashUrl: "https://www.united.com/", pointsUrl: "https://www.united.com/" },
  "Delta SkyMiles": { name: "Delta", emoji: "🇺🇸", cashUrl: "https://www.delta.com/", pointsUrl: "https://www.delta.com/" },
  "Air Canada Aeroplan": { name: "Air Canada", emoji: "🇨🇦", cashUrl: "https://www.aircanada.com/", pointsUrl: "https://www.aircanada.com/" },
  "Flying Blue": { name: "Air France / KLM", emoji: "🇫🇷", cashUrl: "https://www.flyingblue.com/", pointsUrl: "https://www.flyingblue.com/" },
  "British Airways Executive Club": { name: "British Airways", emoji: "🇬🇧", cashUrl: "https://www.britishairways.com/", pointsUrl: "https://www.britishairways.com/" },
  "Iberia Plus": { name: "Iberia", emoji: "🇪🇸", cashUrl: "https://www.iberia.com/", pointsUrl: "https://www.iberia.com/" },
  "Qatar Airways Privilege Club": { name: "Qatar Airways", emoji: "🇶🇦", cashUrl: "https://www.qatarairways.com/", pointsUrl: "https://www.qatarairways.com/" },
  "Avianca LifeMiles": { name: "Avianca", emoji: "🇨🇴", cashUrl: "https://www.avianca.com/", pointsUrl: "https://www.lifemiles.com/" }
};
