export type StockStatus = "in_stock" | "low_stock" | "request";

export type ProductSpecification = {
  label: string;
  value: string | number;
  unit?: string;
};

export type ProductCrossReference = {
  brand: string;
  partNo: string;
};

export type Product = {
  /**
   * Internal unique id used in routes and app logic
   * Example: donaldson-p164384
   */
  id: string;

  /**
   * Manufacturer part number
   * Example: P164384
   */
  partNo: string;

  /**
   * Brand name
   * Example: Donaldson, NTN, MANN-FILTER
   */
  brand: string;

  /**
   * Product category
   * Example: filter, bearing, fuel_filter
   */
  category: string;

  /**
   * Display title
   */
  title?: string;

  /**
   * Short flat spec string for cards / quick summaries
   */
  spec?: string;

  /**
   * Stock / sourcing status
   */
  stockStatus?: StockStatus;

  /**
   * Product image source
   *
   * Supports:
   * - local public path: /images/products/donaldson/p164384.jpg
   * - remote absolute URL: https://example.com/product.jpg
   *
   * Optional because some industrial items may rely on official reference
   * rather than local image assets.
   */
  image?: string;

  /**
   * Official manufacturer / supplier reference page
   * Example: Donaldson official product page
   */
  officialUrl?: string;

  /**
   * Optional list of structured specifications
   */
  specifications?: ProductSpecification[];

  /**
   * Optional cross reference / interchange part numbers
   */
  cross_reference?: ProductCrossReference[];
};