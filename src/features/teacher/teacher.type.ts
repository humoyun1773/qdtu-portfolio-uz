// teacher.type.ts - yangilangan

export interface Teacher {
  id: number;
  fullName: string;
  lavozim: string;
  gender: boolean;
  age: number;
  email: string | null;
  orcid: string | null;
  scopusid: string | null;
  scienceid: string | null;
  researcherid: string | null;
  profession: string | null;
  imgUrl: string | null;
  fileUrl: string | null;
  input: string | null;
  phoneNumber: string;
  departmentName: string;
}

export interface TeacherDetail extends Teacher {
  biography: string;
}

export interface SearchParams {
  name: string;
  college: string;
  lavozim: string;
  page: number;
  size: number;
}

export interface TeacherListData {
  page: number;
  size: number;
  totalPage: number;
  totalElements: number;
  body: Teacher[];
}

export interface GetTeacherListResponse {
  success: boolean;
  message: string;
  data: TeacherListData;
}

/** GET /teacher/{id} javobidagi `data` — ReqUserDTO / teacher card */
export interface ITeacherDetail {
  id: number;
  fullName: string;
  phone: string | null;
  email: string | null;
  biography: string | null;
  input: string | null;
  age: number;
  gender: boolean;
  orcId: string | null;
  scopusId: string | null;
  scienceId: string | null;
  researcherId: string | null;
  imageUrl: string | null;
  fileUrl: string | null;
  profession: string | null;
}

export interface GetTeacherByIdResponse {
  success: boolean;
  message: string;
  data: ITeacherDetail;
}

export interface CreateTeacherRequest {
  id: number;
  fullName: string;
  phoneNumber: string;
  imgUrl: string;
  fileUrl: string;
  lavozmId: number;
  gender: boolean;
  password: string;
  departmentId: number;
}

export interface CreateTeacherParams extends Omit<CreateTeacherRequest, 'imgUrl' | 'fileUrl'> {
  imgUrl: File | null;
  fileUrl: File | null;
}

export interface UpdateTeacherRequest {
  id: number;
  fullName: string;
  phoneNumber: string;
  email: string;
  biography: string;
  input: string;
  age: number;
  orcid: string;
  scopusid: string;
  scienceId: string;
  researcherId: string;
  gender: boolean;
  imgUrl: string;
  fileUrl: string;
  profession: string;
  lavozmId: number;
  departmentId: number;
}

export interface UpdateTeacherParams extends Omit<UpdateTeacherRequest, 'imgUrl' | 'fileUrl'> {
  imgUrl: File | null;
  fileUrl: File | null;
}

export interface EditTeacherRequest {
  id: number;
  fullName: string;
  phoneNumber: string;
  imgUrl: string;
  fileUrl: string;
  lavozmId: number;
  gender: boolean;
  password: string;
  departmentId: number;
}

// ✅ PROFIL EDIT UCHUN TO'G'RI TYPE
export interface ProfileEditRequest extends Partial<UpdateTeacherRequest> {
  id: number;
  // Barcha fieldlar optional bo'ladi partial update uchun
  fullName?: string;
  phoneNumber?: string;
  email?: string;
  biography?: string;
  input?: string;
  age?: number;
  orcid?: string;
  scopusid?: string;
  scienceId?: string;
  researcherId?: string;
  gender?: boolean;
  imgUrl?: string;
  fileUrl?: string;
  profession?: string;
  lavozmId?: number;
  departmentId?: number;
}

/** Backend ReqUserDTO JSON — orcid/scopusid emas, orcId/scopusId; rasm uchun imageUrl */
export interface UpdateProfileRequestBody {
  id: number;
  fullName?: string;
  phoneNumber?: string;
  email?: string;
  biography?: string;
  input?: string;
  age?: number;
  orcId?: string;
  scopusId?: string;
  scienceId?: string;
  researcherId?: string;
  gender?: boolean;
  imageUrl?: string;
  fileUrl?: string;
  profession?: string;
  lavozmId?: number;
  departmentId?: number;
}

export interface ProfileFormData extends Omit<ProfileEditRequest, 'imgUrl' | 'fileUrl'> {
  /** Yangi rasm (File) yoki serverdagi URL (string) */
  imageUri?: File | string | null;
  fileUrl?: File | null | string;
}

export interface CommonResponse {
  success: boolean;
  message: string;
  data: string;
}

export interface TeacherStatsData {
  tadqiqotlar: number;
  nashrlar: number;
  maqolalar: number;
  kitoblar: number;
  ishYuritishlar: number;
  boshqalar: number;
  nazorat: number;
  maslahatlar: number;
  mukofotlar: number;
  treninglar: number;
  tahririyatAzolik: number;
  maxsusKengash: number;
  patentlar: number;
  davlatMukofotlari: number;
}

export interface TeacherStatsResponse {
  success: boolean;
  message: string;
  data: TeacherStatsData;
}

export interface TeacherComplationResponse {
  success: boolean;
  message: string;
  data: number;
}