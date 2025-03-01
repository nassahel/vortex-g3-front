export interface Category {
  id: string;
  name: string;
  product: Product[]
}

export interface Product {
  id: string;
  image: string;
  name: string;
  price: number;
  isFavorite: boolean;
  description: string;
  category: string
}

export interface FormData {
  name: string;
  description: string;
  image: string;
  price: string;
  categoryId: string;
}

export interface CartItem {
  itemId: string | string[] | undefined;
  quantity: number;
  subtotal: number;
}