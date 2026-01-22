import React from 'react';

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export type PricingTier = {
  title: string;
  price: string;
  features: string[];
  highlight?: boolean;
};

export interface FormData {
  category: 'recruitment' | 'business_dev' | 'it_support' | 'general' | null;
  subServices: string[];
  name: string;
  email: string;
  budget: number;
  message?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isStreaming?: boolean;
}

export interface NewsPost {
  id: string;
  title: string;
  category: 'Update' | 'Insight' | 'Milestone';
  date: string;
  excerpt: string;
  content: string;
  author: string;
  image?: string;
}

// --- Candidate Registration Types ---

export interface NextOfKin {
  name: string;
  address: string;
  tel: string;
  email: string;
  relationship: string;
}

export interface Guarantor {
  name: string;
  address: string;
  tel: string;
  email: string;
  dob: string;
  occupation: string;
  workAddress: string;
  yearsKnown: string;
  relationship: string;
  idCardImage?: File | null; // Added ID Card
}

export interface Acquaintance {
  surname: string;
  firstName: string;
  otherName: string;
}

export interface CandidateRegistrationData {
  // Personal
  passportImage?: File | null; 
  surname: string;
  firstName: string;
  otherName: string;
  address: string;
  dob: string;
  sex: 'M' | 'F' | '';
  nationality: string;
  stateOfOrigin: string;
  lga: string;
  religion: string;
  tel: string;
  email: string;
  whatsapp: string;
  maritalStatus: string;
  handicap: 'Yes' | 'No' | '';
  handicapDescription?: string;
  
  // ID
  validIdNumber: string;
  idType: string;

  // Next of Kin
  nextOfKin: NextOfKin;

  // Employment
  desiredPositions: [string, string, string];
  jobLocations: [string, string, string];
  jobMode: 'Remote' | 'On-Site' | 'Hybrid' | '';
  yearsExperience: string;

  // Guarantors (Changed to Array of 2)
  guarantors: [Guarantor, Guarantor];
  guarantorConsent: boolean; // Added consent flag

  // References
  acquaintances: Acquaintance[];

  // Meta
  agreedToTerms: boolean;
  paymentReference?: string;
}

// --- Partner Registration Types ---

export type PartnerType = 'individual' | 'org' | null;

export interface IndividualPartnerData {
  fullName: string;
  professionalTitle: string;
  whatsapp: string;
  email: string; // Added for contact
  portfolioLink: string;
  nin: string;
  primarySkill: string;
  projectDescription: string;
  idDocument?: File | null;
}

export interface OrganizationPartnerData {
  businessName: string;
  website: string;
  cacNumber: string;
  tin: string;
  contactName: string;
  contactRole: string;
  officialEmail: string;
  teamSize: string;
  servicesOffered: string[];
  cacCertificate?: File | null;
}

export interface PartnerApplication {
  type: PartnerType;
  data: IndividualPartnerData | OrganizationPartnerData;
  submittedAt?: any;
}

// --- Dashboard Types ---

export interface Task {
  id: string;
  title: string;
  project: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  assignee?: string;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: 'pending' | 'paid';
  type: 'credit' | 'debit';
}

export interface Project {
  id: string;
  name: string;
  client: string;
  status: 'planning' | 'active' | 'review' | 'completed';
  progress: number;
  deadline: string;
  category: string;
}