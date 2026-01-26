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
  authorId?: string; // Link to user
  image?: string;
  status: 'published' | 'pending' | 'rejected'; // Approval workflow
  likes: number; // Social engagement
  createdAt?: any;
}

export interface AppNotification {
  id: string;
  userId: string; // Who receives it
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  timestamp: any;
  link?: string; // Optional redirect
  createdAt?: any;
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
  idCardImage?: File | string | null;
}

export interface Acquaintance {
  surname: string;
  firstName: string;
  otherName: string;
}

export interface CandidateRegistrationData {
  // Personal
  passportImage?: File | string | null;
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

  // Guarantors
  guarantors: [Guarantor, Guarantor];
  guarantorConsent: boolean;

  // References
  acquaintances: Acquaintance[];

  // Meta
  agreedToTerms: boolean;
  paymentReference?: string;
}

export interface CandidateRecord extends CandidateRegistrationData {
  id: string;
  status: 'pending_payment_verification' | 'verified' | 'rejected' | 'placed';
  submittedAt: any;
  passportUploaded?: boolean;
}

// --- Partner Registration Types ---

export type PartnerType = 'individual' | 'org' | null;

export interface IndividualPartnerData {
  fullName: string;
  professionalTitle: string;
  whatsapp: string;
  email: string;
  portfolioLink: string;
  nin: string;
  primarySkill: string;
  projectDescription: string;
  idDocument?: File | string | null;
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
  cacCertificate?: File | string | null;
}

export interface PartnerApplication {
  type: PartnerType;
  data: IndividualPartnerData | OrganizationPartnerData;
  submittedAt?: any;
}

export interface PartnerRecord extends PartnerApplication {
  id: string;
  status: 'pending_review' | 'approved' | 'rejected';
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

// --- Job & Invoicing Types ---

export interface Job {
  id: string;
  title: string;
  company: string; // Hidden from candidate until placed usually, but shown for now
  location: string;
  type: 'Full-time' | 'Contract' | 'Remote';
  salaryRange: string;
  postedAt: string;
  description: string;
}

export interface JobApplication {
  id: string;
  jobId: string;
  candidateId: string;
  jobTitle: string;
  company: string;
  appliedAt: string;
  status: 'Applied' | 'Screening' | 'Interview' | 'Offer' | 'Rejected';
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  description: string;
  amount: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
  issuedDate: string;
}