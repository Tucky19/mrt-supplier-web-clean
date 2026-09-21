import type { ProductRelationInput } from "@/lib/products/relations";

// Parenthesized part numbers from the supplied purchasing list.
// Approved by the user as interchangeable on 2026-09-21.
// Commercial notes and ambiguous set-plus-inner notation are excluded.
const partNumbersByProduct: Record<string, string[]> = {
  "p777869": [
    "P836913"
  ],
  "p537876": [
    "P777409",
    "P777279"
  ],
  "p175120": [
    "23641236"
  ],
  "p551065": [
    "WK1060/3X"
  ],
  "p502643": [
    "FS36230"
  ],
  "p778335": [
    "C301240"
  ],
  "p500202": [
    "P823295"
  ],
  "p828889": [
    "P772580"
  ],
  "p550148": [
    "P565245"
  ],
  "r010042": [
    "FS36210"
  ],
  "c1140": [
    "P784578",
    "SA6847"
  ],
  "p765075": [
    "9364243"
  ],
  "p565059": [
    "P565060"
  ],
  "kw2140c1": [
    "KAS199"
  ],
  "p782105": [
    "C25710/3"
  ],
  "p781039": [
    "P777638"
  ],
  "p170612": [
    "0800D010BN4HC"
  ],
  "p553771": [
    "W962"
  ],
  "p181034": [
    "P182034"
  ],
  "p782108": [
    "CF710"
  ],
  "p554685": [
    "KW473A"
  ],
  "p550881": [
    "P550880"
  ],
  "aa90138r": [
    "AF26531/32"
  ],
  "p164381": [
    "P164375",
    "P163542"
  ],
  "p551423": [
    "P551426"
  ],
  "4900053601": [
    "LE5001X"
  ],
  "p550848": [
    "KFW6733"
  ],
  "p550588": [
    "WK842/2"
  ],
  "w962": [
    "P553771"
  ],
  "p551551": [
    "P551553"
  ],
  "p552006": [
    "P551006"
  ],
  "p559128": [
    "P556007"
  ],
  "c1574": [
    "SA6116"
  ],
  "p165659": [
    "P171275"
  ],
  "p551425": [
    "P550435"
  ],
  "p559000": [
    "P550949"
  ],
  "c16400": [
    "P778972"
  ],
  "p556745": [
    "WK8106"
  ],
  "p955606": [
    "WK1080/7X"
  ],
  "p550748": [
    "P551858"
  ],
  "r010039": [
    "FF5327"
  ],
  "wd96232": [
    "1092035894"
  ],
  "aa90145r": [
    "KAS345"
  ],
  "p550268": [
    "P565243"
  ],
  "p532966": [
    "600-185-4100"
  ],
  "p550719": [
    "P552819"
  ],
  "p526428": [
    "P134353"
  ],
  "p502458": [
    "P502085"
  ],
  "p812924": [
    "P780522"
  ],
  "p821963": [
    "P846296"
  ],
  "p771561": [
    "C20325/2",
    "KA460"
  ],
  "p555680": [
    "W940/5"
  ],
  "w1110237": [
    "W11102/14"
  ],
  "w9405": [
    "P559418",
    "P1001555805"
  ],
  "p551426": [
    "P551423",
    "WK8113"
  ],
  "p550318": [
    "W920/7"
  ],
  "p550939": [
    "W962/21"
  ],
  "p526432": [
    "P134354",
    "P820635"
  ],
  "cf400": [
    "P780012"
  ],
  "p558616": [
    "LF3345"
  ],
  "fp1111": [
    "4461492"
  ],
  "w92021": [
    "P550939"
  ],
  "c257103": [
    "P782105"
  ],
  "p505982": [
    "P551843"
  ],
  "tb13941x": [
    "P781466",
    "TB1374X",
    "P951413"
  ],
  "wd962": [
    "P550230"
  ],
  "1ais068": [
    "BAP111",
    "1-86750430-2",
    "P534436"
  ],
  "1ois054": [
    "BO221"
  ],
  "1fis433": [
    "1-86750444-0",
    "TF112"
  ],
  "df0766lluacs32": [
    "A3910732"
  ],
  "ba343": [
    "1-AIS090"
  ],
  "khl1124": [
    "YN52V01025F1V8"
  ],
  "khl1728": [
    "SLR0400Ax10-S"
  ],
  "kh560": [
    "6024017"
  ],
  "kh140a": [
    "P584515",
    "HF35549"
  ]
};

export const supplierCrossReferences: Record<string, ProductRelationInput[]> = Object.fromEntries(
  Object.entries(partNumbersByProduct).map(([key, partNumbers]) => [
    key,
    partNumbers.map((partNumber) => ({
      partNumber,
      relationType: "equivalent",
      verificationStatus: "verified",
      source: "Customer-provided supplier product list",
      evidenceNote: "Parenthesized part number approved as interchangeable by the site owner.",
      approvedBy: "Site owner",
      approvedAt: "2026-09-21",
    })),
  ]),
);
