export interface Categorie {
  id: string;
  name: string;
  isDeleted: boolean;
  product?: Product[]
}

export interface Product {
  id?: string;
  images?: Image[];
  name?: string;
  price?: number;
  stock?: number;
  description?: string;
  categories?: Categorie[] | string[];
}


export interface Image {
  url: string;
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
  productId: string;
  price: number
  color: string;
  subtotal: number;
  quantity: number;
  product?: Product;
}


export interface MostBoughtProduct {
  id: string;
  images: Image[];
  name: string;
  price: number;
  description: string;
  category: string;
  quantity: number;
}

export interface DecodedToken {
  userId: string;
  userName: string;
  userRol: string
}


export interface PaginationType {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface Filters {
  min: number;
  max: number;
}


export interface User {
  id: string;
  name: string;
  address: string;
  phone: string;
  rol: string;
  email: string;
  profile: Profile;
  password?: string;
  cart: Cart[];
}

export interface Profile {
  address: string;
  birthday: string;
  dni: string;
  id: string;
  phone: string;
  profileImage: string;
  userId: string
}


export interface Cart {

}



export interface Purchase {
  id: string;
  status: string;
  price: number;
  userId: string;
  createdAt: string;
  product?: CartItem[];
  items?: CartItem[];
}


export interface DecodedUser {
  userRol: string;
  userName: string;
}