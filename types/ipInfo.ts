export interface IpInfo {
  ip: string;
  city: string;
  region: string;
  country: string;
  loc: string;
  org: string;
  postal: string;
  timezone: string;
}

// example response
//
// {
//   "ip": "41.90.106.247",
//   "city": "Nairobi",
//   "region": "Nairobi County",
//   "country": "KE",
//   "loc": "-1.2833,36.8167",
//   "org": "AS37061 Safaricom Limited",
//   "postal": "00800",
//   "timezone": "Africa/Nairobi"
// }
