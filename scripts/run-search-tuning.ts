import { searchProductsPRO } from "../data/search/server";

type SearchableProduct = {
  id: string;
  partNo: string;
  brand?: string;
  category?: string;
  title?: string;
  spec?: string;
};

type SearchHit = {
  product: SearchableProduct;
  score: number;
};

type Case = {
  query: string;
};

const TEST_PRODUCTS: SearchableProduct[] = [
  {
    id: "1",
    partNo: "P553004",
    brand: "Donaldson",
    category: "Fuel Filter",
    title: "Fuel Filter Spin-On",
    spec: "OD 93mm",
  },
  {
    id: "2",
    partNo: "P550084",
    brand: "Donaldson",
    category: "Oil Filter",
    title: "Oil Filter",
  },
];

const CASES: Case[] = [
  { query: "P553004" },
  { query: "553004" },
  { query: "fuel filter" },
];

function run() {
  for (const c of CASES) {
    console.log("\nQuery:", c.query);

  

const results = searchProductsPRO(c.query, 5);

results.forEach((r, i: number) => {
  console.log(`${i + 1}. ${r.partNo} | ${r.brand ?? "-"} | ${r.title ?? "-"}`);
});
  }
}

run();