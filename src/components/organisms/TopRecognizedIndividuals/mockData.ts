import { TTopRecognizedIndividual } from "./TopRecognizedIndividuals.types";

export const mockDataByPeriod: Record<string, TTopRecognizedIndividual[]> = {
  weekly: [
    { name: "Sarah J.", count: 5 },
    { name: "Michael R.", count: 2 },
    { name: "Emily W.", count: 3 },
    { name: "David K.", count: 2 },
    { name: "Olivia T.", count: 5 },
  ],
  monthly: [
    { name: "Sarah J.", count: 16 },
    { name: "Michael R.", count: 5 },
    { name: "Emily W.", count: 6 },
    { name: "David K.", count: 6 },
    { name: "Olivia T.", count: 16 },
  ],
  yearly: [
    { name: "Sarah J.", count: 80 },
    { name: "Michael R.", count: 30 },
    { name: "Emily W.", count: 40 },
    { name: "David K.", count: 35 },
    { name: "Olivia T.", count: 82 },
  ],
};
