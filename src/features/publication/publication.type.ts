type PublicationType = "ARTICLE" | "BOOK" | "PROCEEDING" | "OTHERS";
type AuthorType = "COAUTHOR" | "FIRST_AUTHOR" | "BOTH_AUTHOR";
type DegreeType = "INTERNATIONAL" | "NATIONAL";

export type PublicationItem = {
  userId: number;
  name: string;
  description: string;
  year: number;
  fileUrl: string;
  type: PublicationType;
  author: AuthorType;
  degree: DegreeType;
  volume: string;
  institution: string;
  popular: boolean;
};

interface PublicationData {
  page: number;
  size: number;
  totalPage: number;
  totalElements: number;
  body: PublicationItem[];
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data: PublicationData;
}
interface PaginationData<T> {
  page: number;
  size: number;
  totalPage: number;
  totalElements: number;
  body: T;
}

export interface GetbyIdResponse {
  success: boolean;
  message: string;
  data: PaginationData<PublicationItem>;
}

enum DegreeLevel {
  INTERNATIONAL = 'INTERNATIONAL',
  NATIONAL = 'NATIONAL'
}

// Asosiy interfeys
export interface PublicationCreateParams {
  userId: number;
  name: string;
  description: string;
  year: number;
  fileUrl: string;
  type: PublicationType;
  author: AuthorType;
  degree: DegreeLevel;
  volume: string;
  institution: string;
  popular: boolean;
}