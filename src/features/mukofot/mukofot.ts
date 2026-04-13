export interface MukofotItem {
  id: number;
  name: string;
  description: string;
  year: number;
  fileUrl: string;
  userId: number;
  awardEnum: "Trening_Va_Amaliyot" | "SERTIFIKAT" | "DIPLOM";
  memberEnum: "XALQARO" | "MILLIY";
}

interface MukofotData {
  page: number;
  size: number;
  totalPage: number;
  totalElements: number;
  body: MukofotItem[];
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data: MukofotData;
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
  data: PaginationData<MukofotItem>;
}

enum MemberEnum {
  MILLIY = "MILLIY",
  XALQARO = "XALQARO"
}

enum AwardEnum {
  Trening_Va_Amaliyot = "Trening_Va_Amaliyot",
  Tahririyat_Kengashiga_Azolik = "Tahririyat_Kengashiga_Azolik",
  Maxsus_Kengash_Azoligi = "Maxsus_Kengash_Azoligi",
  Patent_Dgu = "Patent_Dgu",
  Davlat_Mukofoti = "Davlat_Mukofoti"
}

export interface AwardRequest {
  name: string;
  description: string;
  year: number;
  fileUrl: string;
  userId: number;
  awardEnum: AwardEnum;
  memberEnum: MemberEnum;
}