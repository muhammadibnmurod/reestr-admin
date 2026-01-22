// src/types/presentation.ts

export interface Feature {
  id?: number;
  createdAt?: string;
  titleUz: string;
  titleRu: string;
  titleEn: string;
  titleKiril: string;
  descriptionUz: string;
  descriptionRu: string;
  descriptionEn: string;
  descriptionKiril: string;
  icon: string;
  order: number;
}

export interface Presentation {
  id: number;
  createdAt: string;
  logo: string;
  titleUz: string;
  titleRu: string;
  titleEn: string;
  titleKiril: string;
  subtitleUz: string;
  subtitleRu: string;
  subtitleEn: string;
  subtitleKiril: string;
  descriptionTitleUz: string;
  descriptionTitleRu: string;
  descriptionTitleEn: string;
  descriptionTitleKiril: string;
  descriptionUz: string;
  descriptionRu: string;
  descriptionEn: string;
  descriptionKiril: string;
  color: string;
  image: string;
  order: number;
  features: Feature[];
}

export interface PresentationFormData {
  titleUz: string;
  titleRu: string;
  titleEn: string;
  titleKiril: string;
  subtitleUz: string;
  subtitleRu: string;
  subtitleEn: string;
  subtitleKiril: string;
  descriptionTitleUz: string;
  descriptionTitleRu: string;
  descriptionTitleEn: string;
  descriptionTitleKiril: string;
  descriptionUz: string;
  descriptionRu: string;
  descriptionEn: string;
  descriptionKiril: string;
  color: string;
  image: string;
  logo: string;
  features: Feature[];
}

export interface PresentationApiResponse {
  statusCode: number;
  message: string;
  data: Presentation | Presentation[];
}

// Filter params
export interface PresentationFilterParams {
  currentPage: number;
  pageSize: number;
  search: string;
}