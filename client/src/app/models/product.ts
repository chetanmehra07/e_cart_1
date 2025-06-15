export type Product = {
  product_id: number;
  product_name: string;
  MRP: number;
  discount: number;
  stock_avl: number;
  free_delivery_status: boolean;
  item_category: number;
  category_name: string; // 👈 Add this line
  product_image: string;
  specs: string;
  applicable_policies?: {
    policy_id: number;
    policy_name: string;
    policy_description: string;
  }[];
};
