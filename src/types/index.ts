export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  category: string;
  brand: string;
  model?: string;
  description: string;
  sizes: string[];
  colors?: string[];
  inStock: boolean;
  isNew?: boolean;
  isHit?: boolean;
  rating?: number;
  reviews?: Review[];
  releaseDate?: string;
}

// Новый интерфейс для данных из JSON файлов
export interface ProductFromJSON {
  id?: string; // Добавляем опциональное поле ID
  url: string;
  title: string;
  brand: string;
  model: string;
  price: string;
  images: string[];
  description: string;
  sku: string;
  release_date: string;
  type: string;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  userImage?: string;
}

export interface CartItem {
  product: Product;
  size: string;
  quantity: number;
  color?: string;
}

export interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, size: string, quantity?: number, color?: string) => void;
  removeFromCart: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

export interface FilterOptions {
  categories: string[];
  brands: string[];
  models: string[];
  priceRange?: [number, number];
  sizes?: string[];
  colors?: string[];
  inStock?: boolean;
}

export interface SortOptions {
  sortBy: 'price' | 'name' | 'newest';
  order: 'asc' | 'desc';
}

export interface OrderForm {
  name: string;
  phone: string;
  instagram: string;
  comments?: string;
} 