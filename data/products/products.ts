export type Product = {
  id: string;
  partNo: string;
  brand: string;
  category: string;
  title?: string;
  spec?: string;
  imageUrl?: string;
  officialUrl?: string;
  stockStatus?: string;
};

export const products: Product[] = [
  {
    id: "p550084",
    partNo: "P550084",
    brand: "donaldson",
    category: "filter",
    title: "Donaldson Oil Filter P550084",
    spec: "Spin-On Oil Filter",
    imageUrl: "/images/products/donaldson/p550086.jpg",
    officialUrl:
      "https://shop.donaldson.com/store/en-th/product/P550084/20085",
  },
  {
  id: "p551315",
  partNo: "P551315",
  brand: "donaldson",
  category: "filter",
  title: "Donaldson Filter P551315",
  spec: "Spin-On Filter",

  imageUrl: "/images/products/donaldson/p551315.jpg", // 👈 ใส่ตรงนี้
  stockStatus: "request",
},
{
  id: "p550012",
  partNo: "P550012",
  brand: "donaldson",
  category: "filter",
  title: "Donaldson Oil Filter P550012",
  spec: "Spin-On Oil Filter",

  imageUrl: "/images/products/donaldson/p550012.jpg",
  officialUrl: "https://shop.donaldson.com/store/en-th/product/P550012/20019",

  stockStatus: "request",
}
];
