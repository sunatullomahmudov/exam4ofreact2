export type ProductOption = {
  id: number;
  name: string;
};

export type ProductExtrasData = {
  tax: boolean;
  multiple: boolean;
  tags: string[];
  options: { name: string; values: string }[];
};

export const emptyExtras: ProductExtrasData = {
  tax: false,
  multiple: true,
  tags: [],
  options: [{ name: "Size", values: "" }, { name: "Weight", values: "" }],
};

export type ProductFormData = {
  productName: string;
  description: string;
  quantity: string;
  code: string;
  price: string;
  brandId: string;
  colorId: string;
  subCategoryId: string;
  weight: string;
  size: string;
  hasDiscount: boolean;
  discountPrice: string;
};

export const initialProductForm: ProductFormData = {
  productName: "",
  description: "",
  quantity: "",
  code: "",
  price: "",
  brandId: "",
  colorId: "",
  subCategoryId: "",
  weight: "",
  size: "",
  hasDiscount: false,
  discountPrice: "",
};
