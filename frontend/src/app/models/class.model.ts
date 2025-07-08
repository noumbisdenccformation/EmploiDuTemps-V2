export interface Class {
  id?: number;
  name: string;
  level: string;
  section?: string;
  studentCount: number;
  isActive: boolean;
  subjects?: Subject[];
}

export interface Subject {
  id?: number;
  name: string;
  code: string;
  duration: number;
  color: string;
  isCommonCore: boolean;
  isActive: boolean;
}