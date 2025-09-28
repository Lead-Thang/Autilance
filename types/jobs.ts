export type JobSkill = {
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
};

export type JobBehavior = {
  name: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
};

export type JobCertification = {
  name: string;
  required: boolean;
};

export type JobDocument = {
  id: string;
  name: string;
  url: string;
  type: string;
};

export type JobLink = {
  title: string;
  url: string;
};

export type JobRule = {
  title: string;
  description: string;
};

export interface Job {
  id: string;
  creator: string;
  title: string;
  company: string;
  category: string;
  description: string;
  skills: JobSkill[];
  behaviors: JobBehavior[];
  certifications?: JobCertification[];
  documents?: JobDocument[];
  links?: JobLink[];
  rules?: JobRule[];
  verifiedCount: number;
  verifiedUsers: number;
  updatedAt: string;
  location: string;
  latitude?: number;
  longitude?: number;
  price?: number;
  remote?: boolean;
  status?: string;
  deadline?: string;
  coordinates?: { lat: number; lng: number };
}
