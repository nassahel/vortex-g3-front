export interface Categorie {
  id: string;
  name: string;
  description: string;
  product: Product[]
}

export interface Product {
  id: string;
  images: string;
  name: string;
  price: number;
  isFavorite: boolean;
  description: string;
  categories: string[];
}

export interface FormuData {
  name: string;
  description: string;
  images: File[];
  price: string;
  stock: number;
  categories: string[];
}

export interface CartItem {
  id: string
  itemId: string;
  name: string;
  image: string;
  size: string;
  productId: string;
  price: number
  color: string;
  subtotal: number;
  quantity: number;
}


export interface MostBoughtProduct {
  id: string;
  image: string;
  name: string;
  price: number;
  // isFavorite: boolean;
  description: string;
  category: string;
  quantity: number;
}

export interface DecodedToken {
  userId: string;
  userName: string;
  userRol: string
}