// CartItem uses string id (MongoDB _id)
export interface CartItem {
  id: string;
  title: string;
  author: string[];
  price: number;
  originalPrice: number;
  cover: string;
  color: string;
  description: string;
  pages: number;
  rating: number;
  tag: string;
  topics: string[];
  isbn?: string;
  qty: number;
}

export const fmt = (n: number) => "৳" + n.toLocaleString("en-BD");
