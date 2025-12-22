
export interface Category {
  id: string;
  name: string;
  parentId?: string; // For sub-categories
  image?: string;
}

export interface BrandCatalogue {
  name: string;
  pdf: string;
}

export interface Brand {
  id: string;
  name: string;
  logo?: string;
  catalogues?: BrandCatalogue[]; // Support for multiple catalogues
  logoSize?: number; // Scale percentage (e.g., 50 to 150)
}

export interface Product {
  id: string;
  name: string;
  description: string;
  specifications?: string; // Field for technical data / additional info
  sku: string;
  categoryId: string;
  subCategoryId?: string;
  brandIds: string[]; // Support for multiple brands
  image: string;
  status: 'active' | 'draft';
  pdf?: string; // URL or Base64 data for product manual/spec sheet
}

export interface BasketItem {
  productId: string;
  quantity: number;
  product?: Product; // Populated for UI convenience
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  password?: string; // Stored in plain text for this demo mock
  address?: string;
  joinedDate: string;
}

export interface QuoteRequest {
  id: string;
  userId?: string; // Link to registered user
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  message: string;
  items: BasketItem[];
  date: string;
  status: 'new' | 'viewed' | 'replied' | 'completed';
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  service: string;
  message: string;
  date: string;
  status: 'new' | 'read';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  image?: string; // base64
  isError?: boolean;
}
