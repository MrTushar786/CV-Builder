export interface PersonalInfo {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  profileImage?: string;
}

export interface WorkExperience {
  id: string;
  position: string;
  company: string;
  startDate: string;
  endDate: string;
  current: boolean;
  achievements: string[];
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  startYear: string;
  endYear: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  year?: string;
}

export interface Language {
  language: string;
  proficiency: string;
}

export interface CVData {
  personalInfo: PersonalInfo;
  workExperience: WorkExperience[];
  skills: string[];
  education: Education[];
  certifications: Certification[];
  languages: Language[];
}