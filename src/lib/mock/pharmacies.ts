import type { Pharmacy } from "@/lib/types";

export const pharmacies: Pharmacy[] = [
  {
    id: "p1",
    name: "CityCare Pharmacy • Koramangala",
    distanceKm: 0.8,
    rating: 4.7,
    etaMin: 14,
    open: true,
    stockScore: 0.94,
  },
  {
    id: "p2",
    name: "Wellness Rx • Indiranagar",
    distanceKm: 1.4,
    rating: 4.5,
    etaMin: 22,
    open: true,
    stockScore: 0.88,
  },
  {
    id: "p3",
    name: "Apollo Pharmacy • Domlur",
    distanceKm: 2.1,
    rating: 4.8,
    etaMin: 28,
    open: false,
    stockScore: 0.79,
  },
];
