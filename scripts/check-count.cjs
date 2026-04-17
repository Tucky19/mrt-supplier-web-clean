const fs = require("fs");
const path = require("path");

const p = path.join(process.cwd(), "data", "search", "meta.json");
const meta = JSON.parse(fs.readFileSync(p, "utf8"));
console.log("skuCount:", meta.skuCount);
