import { db } from '../lib/firebase';
import { collection, addDoc, getDocs, query, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';
import { FormData, NewsPost, CandidateRegistrationData, PartnerApplication, Task, Transaction, Project } from '../types';

// ==========================================
// MOCK DATA (Simulation Mode)
// ==========================================
const MOCK_NEWS: NewsPost[] = [
  {
    id: '1',
    title: 'Expanding Our Tech Horizon',
    category: 'Milestone',
    date: 'Oct 24, 2025',
    excerpt: 'Jackson Multifacet is proud to announce the launch of our new AI-driven analytics dashboard for Business Development clients.',
    content: '',
    author: 'Admin',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '2',
    title: 'Recruitment Trends in 2026',
    category: 'Insight',
    date: 'Oct 15, 2025',
    excerpt: 'Remote work is evolving. Here is how we are adapting our candidate screening process to find the best distributed talent.',
    content: '',
    author: 'HR Dept',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '3',
    title: 'Q3 Growth Report',
    category: 'Update',
    date: 'Oct 01, 2025',
    excerpt: 'A successful quarter with over 50 successful executive placements and 20 new corporate branding projects initiated.',
    content: '',
    author: 'Admin',
    image: 'https://images.unsplash.com/photo-1558494949-ef2bb6ffa030?auto=format&fit=crop&q=80&w=800'
  }
];

const MOCK_TASKS: Task[] = [
  { id: 't1', title: 'Design Homepage Mockup', project: 'Dangote Rebrand', status: 'in-progress', priority: 'high', dueDate: 'Oct 30, 2025' },
  { id: 't2', title: 'Setup CI/CD Pipeline', project: 'FinTech App', status: 'todo', priority: 'medium', dueDate: 'Nov 05, 2025' },
  { id: 't3', title: 'Candidate Screening: Senior Dev', project: 'Recruitment Batch A', status: 'done', priority: 'high', dueDate: 'Oct 20, 2025' },
  { id: 't4', title: 'Write Project Proposal', project: 'Government Tender', status: 'review', priority: 'high', dueDate: 'Oct 28, 2025' },
];

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 'tx1', date: 'Oct 25, 2025', description: 'Project Milestone Payment - Dangote', amount: 150000, status: 'paid', type: 'credit' },
  { id: 'tx2', date: 'Oct 10, 2025', description: 'Monthly Retainer', amount: 50000, status: 'paid', type: 'credit' },
  { id: 'tx3', date: 'Oct 28, 2025', description: 'Software License Reimbursement', amount: 15000, status: 'pending', type: 'credit' },
];

const MOCK_PROJECTS: Project[] = [
  { id: 'p1', name: 'Corporate Rebrand', client: 'Dangote Industries', status: 'active', progress: 65, deadline: 'Dec 20, 2025', category: 'Branding' },
  { id: 'p2', name: 'Mobile App Dev', client: 'Kuda Bank', status: 'planning', progress: 10, deadline: 'Jan 15, 2026', category: 'IT Support' },
  { id: 'p3', name: 'Executive Hiring', client: 'MTN Nigeria', status: 'completed', progress: 100, deadline: 'Oct 01, 2025', category: 'Recruitment' },
];

// ==========================================
// SERVICE IMPLEMENTATION
// ==========================================

export const DbService = {
  
  // ... (Previous methods remain the same)
  async submitContactForm(data: FormData): Promise<boolean> {
    if (db) {
      try {
        await addDoc(collection(db, 'contact_submissions'), { ...data, submittedAt: Timestamp.now(), status: 'new' });
        return true;
      } catch (e) { console.error(e); return false; }
    } else {
      console.log("[Simulation] Contact:", data);
      return new Promise(resolve => setTimeout(() => resolve(true), 1500));
    }
  },

  async submitCandidateRegistration(data: CandidateRegistrationData): Promise<boolean> {
    const { passportImage, guarantors, ...cleanData } = data;
    const cleanGuarantors = guarantors.map(g => { const { idCardImage, ...rest } = g; return { ...rest, idCardUploaded: !!idCardImage }; });
    const payload = { ...cleanData, guarantors: cleanGuarantors, passportUploaded: !!passportImage, submittedAt: Timestamp.now(), status: 'pending_payment_verification' };

    if (db) {
      try { await addDoc(collection(db, 'candidate_registrations'), payload); return true; } catch (e) { console.error(e); return false; }
    } else {
      console.log("[Simulation] Candidate Reg:", payload);
      return new Promise(resolve => setTimeout(() => resolve(true), 2000));
    }
  },

  async submitPartnerApplication(app: PartnerApplication): Promise<boolean> {
    const { type, data } = app;
    let cleanData: any = { ...data };
    if (type === 'individual' && 'idDocument' in cleanData) { delete cleanData.idDocument; cleanData.idDocumentUploaded = true; }
    else if (type === 'org' && 'cacCertificate' in cleanData) { delete cleanData.cacCertificate; cleanData.cacCertificateUploaded = true; }
    const payload = { type, data: cleanData, submittedAt: Timestamp.now(), status: 'pending_review' };

    if (db) {
      try { await addDoc(collection(db, 'partner_applications'), payload); return true; } catch (e) { console.error(e); return false; }
    } else {
      console.log("[Simulation] Partner App:", payload);
      return new Promise(resolve => setTimeout(() => resolve(true), 2000));
    }
  },

  async subscribeToNewsletter(email: string): Promise<boolean> {
    if (db) {
      try { await addDoc(collection(db, 'newsletter_subscribers'), { email, subscribedAt: Timestamp.now() }); return true; } catch (e) { return false; }
    } else { return new Promise(resolve => setTimeout(() => resolve(true), 1000)); }
  },

  async addNewsPost(post: Omit<NewsPost, 'id' | 'date'>): Promise<NewsPost | null> {
    const newPostData = { ...post, date: new Date().toLocaleDateString(), createdAt: Timestamp.now() };
    if (db) {
      try { const docRef = await addDoc(collection(db, 'news_posts'), newPostData); return { id: docRef.id, ...newPostData }; } catch (e) { return null; }
    } else {
      const mockPost = { id: Date.now().toString(), ...newPostData };
      return new Promise(resolve => setTimeout(() => resolve(mockPost), 800));
    }
  },

  subscribeToNews(onUpdate: (posts: NewsPost[]) => void): () => void {
    if (db) {
      const q = query(collection(db, 'news_posts'), orderBy('createdAt', 'desc'));
      return onSnapshot(q, (snapshot) => onUpdate(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as NewsPost))), () => onUpdate(MOCK_NEWS));
    } else {
      onUpdate(MOCK_NEWS);
      return () => {};
    }
  },

  // --- NEW DASHBOARD METHODS ---
  
  async getPartnerTasks(): Promise<Task[]> {
    // In real app, filter by userId
    return new Promise(resolve => setTimeout(() => resolve(MOCK_TASKS), 800));
  },

  async getPartnerEarnings(): Promise<Transaction[]> {
    return new Promise(resolve => setTimeout(() => resolve(MOCK_TRANSACTIONS), 800));
  },

  async getProjects(): Promise<Project[]> {
    return new Promise(resolve => setTimeout(() => resolve(MOCK_PROJECTS), 800));
  }
};