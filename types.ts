
export enum Marketplace {
  MERCADO_LIVRE = 'Mercado Livre',
  SHOPEE = 'Shopee',
  TIKTOK_SHOPS = 'TikTok Shops'
}

export interface ProductData {
  marketplace: Marketplace;
  productName: string;
  category: string;
  subcategory: string;
  technicalSpecs: string;
  indicatedUse: string;
  differentials: string;
  additionalObservations: string;
}

export interface ImageData {
  visualDescription: string;
  category: string;
  scenario: string;
  sourceImage?: string; // Base64 string
}

export interface GenerationResult {
  title: string;
  description: string;
}

export interface ImageGenerationResult {
  imageUrl: string;
}
