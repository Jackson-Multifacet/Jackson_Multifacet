import { db, storage } from '../lib/firebase';
import { collection, addDoc, getDocs, query, orderBy, onSnapshot, Timestamp, updateDoc, doc, where, setDoc, deleteDoc, increment } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { FormData, NewsPost, CandidateRegistrationData, PartnerApplication, Task, Transaction, Project, CandidateRecord, PartnerRecord, Job, JobApplication, Invoice, AppNotification } from '../types';

// --- MOCK DATA FOR SIMULATION MODE ---
const MOCK_PROJECTS: Project[] = [
  { id: 'p1', name: 'TechCorp Rebrand', client: 'TechCorp Industries', status: 'active', progress: 65, deadline: '2024-12-15', category: 'Branding' },
  { id: 'p2', name: 'Senior Dev Recruitment', client: 'FinTech Solutions', status: 'planning', progress: 15, deadline: '2024-11-30', category: 'Recruitment' },
  { id: 'p3', name: 'Network Infrastructure', client: 'Lagos State Gov', status: 'completed', progress: 100, deadline: '2024-10-01', category: 'IT Support' }
];

const MOCK_TASKS: Task[] = [
  { id: 't1', title: 'Design Homepage Mockup', project: 'TechCorp Rebrand', status: 'in-progress', priority: 'high', dueDate: 'Today' },
  { id: 't2', title: 'Screen Candidates', project: 'Senior Dev Recruitment', status: 'todo', priority: 'medium', dueDate: 'Tomorrow' },
  { id: 't3', title: 'Finalize Contract', project: 'Network Infrastructure', status: 'done', priority: 'low', dueDate: 'Yesterday' }
];

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 'tr1', date: 'Oct 24, 2024', description: 'Project Milestone 1', amount: 450000, status: 'paid', type: 'credit' },
  { id: 'tr2', date: 'Oct 28, 2024', description: 'Consultation Fee', amount: 25000, status: 'pending', type: 'credit' },
];

const MOCK_NEWS: NewsPost[] = [
  { 
    id: 'n1', title: 'Expansion into West Africa', category: 'Milestone', date: 'Oct 20, 2024', author: 'CEO',
    excerpt: 'Jackson Multifacet is proud to announce new operational hubs in Accra and Lagos.',
    content: '', image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800',
    status: 'published', likes: 124
  },
  {
    id: 'n2', title: 'The Future of AI in Recruitment', category: 'Insight', date: 'Oct 15, 2024', author: 'Head of HR',
    excerpt: 'How we are leveraging machine learning to match candidates with 99% accuracy.',
    content: '', image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800',
    status: 'published', likes: 89
  }
];

const MOCK_CANDIDATES: CandidateRecord[] = [
  { 
    id: 'c1', surname: 'Okonkwo', firstName: 'David', otherName: '', sex: 'M', stateOfOrigin: 'Anambra', 
    paymentReference: 'REF-773822', desiredPositions: ['Software Engineer', '', ''], 
    status: 'pending_payment_verification', submittedAt: new Date(),
    address: 'Lagos', dob: '1995-05-12', nationality: 'Nigerian', lga: 'Nnewi', religion: 'Christian',
    tel: '08012345678', email: 'david@example.com', whatsapp: '', maritalStatus: 'Single',
    handicap: 'No', validIdNumber: '123456789', idType: 'NIN',
    nextOfKin: { name: 'Joy', address: 'Lagos', tel: '080000', email: '', relationship: 'Sister' },
    jobLocations: ['Lagos', '', ''], jobMode: 'Remote', yearsExperience: '5',
    guarantors: [
       { name: 'G1', address: '', tel: '', email: '', dob: '', occupation: '', workAddress: '', yearsKnown: '', relationship: '', idCardImage: null },
       { name: 'G2', address: '', tel: '', email: '', dob: '', occupation: '', workAddress: '', yearsKnown: '', relationship: '', idCardImage: null }
    ],
    guarantorConsent: true, acquaintances: [], agreedToTerms: true
  },
  { 
    id: 'c2', surname: 'Adeyemi', firstName: 'Tola', otherName: '', sex: 'F', stateOfOrigin: 'Ogun', 
    paymentReference: 'REF-992833', desiredPositions: ['Product Manager', '', ''], 
    status: 'verified', submittedAt: new Date(),
    address: 'Abuja', dob: '1998-02-20', nationality: 'Nigerian', lga: 'Abeokuta', religion: 'Christian',
    tel: '0809999999', email: 'tola@example.com', whatsapp: '', maritalStatus: 'Single',
    handicap: 'No', validIdNumber: '987654321', idType: 'Passport',
    nextOfKin: { name: 'Sola', address: 'Abuja', tel: '0801111', email: '', relationship: 'Brother' },
    jobLocations: ['Abuja', 'Lagos', ''], jobMode: 'Hybrid', yearsExperience: '3',
    guarantors: [
       { name: 'G3', address: '', tel: '', email: '', dob: '', occupation: '', workAddress: '', yearsKnown: '', relationship: '', idCardImage: null },
       { name: 'G4', address: '', tel: '', email: '', dob: '', occupation: '', workAddress: '', yearsKnown: '', relationship: '', idCardImage: null }
    ],
    guarantorConsent: true, acquaintances: [], agreedToTerms: true
  }
];

const MOCK_PARTNERS: PartnerRecord[] = [
  {
    id: 'p1', type: 'individual', status: 'pending_review', submittedAt: new Date(),
    data: {
      fullName: 'Sarah Connor', professionalTitle: 'Senior UI Designer', whatsapp: '080999999', email: 'sarah@design.com',
      portfolioLink: 'behance.net/sarah', nin: '11122233344', primarySkill: 'Product Design', projectDescription: 'Fintech App Redesign',
      idDocument: null
    }
  }
];

let MOCK_JOBS: Job[] = [
  { id: 'j1', title: 'Senior Frontend Engineer', company: 'FinTech Solutions', location: 'Lagos (Hybrid)', type: 'Full-time', salaryRange: '₦600k - ₦900k/mo', postedAt: '2 days ago', description: 'Seeking React expert.' },
  { id: 'j2', title: 'Digital Marketing Manager', company: 'Retail Giant', location: 'Abuja (On-site)', type: 'Full-time', salaryRange: '₦300k - ₦450k/mo', postedAt: '5 days ago', description: 'Lead our growth campaigns.' },
  { id: 'j3', title: 'Customer Support Lead', company: 'Logistics Co', location: 'Remote', type: 'Full-time', salaryRange: '₦200k - ₦300k/mo', postedAt: '1 week ago', description: 'Manage support team.' }
];

// Added mock applications
let MOCK_APPLICATIONS: JobApplication[] = [
  { id: 'a1', jobId: 'j1', candidateId: 'demo-candidate', jobTitle: 'Senior Frontend Engineer', company: 'FinTech Solutions', appliedAt: 'Oct 25, 2024', status: 'Screening' },
];

const MOCK_INVOICES: Invoice[] = [
  { id: 'inv1', invoiceNumber: 'INV-2024-001', description: 'Recruitment Fee - Batch A', amount: 250000, dueDate: 'Nov 05, 2024', status: 'pending', issuedDate: 'Oct 25, 2024' },
  { id: 'inv2', invoiceNumber: 'INV-2024-002', description: 'Consultation Deposit', amount: 50000, dueDate: 'Oct 20, 2024', status: 'paid', issuedDate: 'Oct 15, 2024' },
];

let MOCK_NOTIFICATIONS: AppNotification[] = [
  { id: 'n1', userId: 'demo-candidate', title: 'Welcome to Jackson Multifacet', message: 'Complete your profile to get started.', type: 'info', read: false, timestamp: 'Just now' },
  { id: 'n2', userId: 'demo-candidate', title: 'Application Received', message: 'Your application for Senior Frontend Engineer was sent.', type: 'success', read: false, timestamp: '1 hour ago' },
  { id: 'n3', userId: 'demo-candidate', title: 'Profile Incomplete', message: 'Please upload your Guarantor ID.', type: 'warning', read: true, timestamp: '1 day ago' },
];

// Helper to upload files
const uploadFile = async (file: File, path: string): Promise<string> => {
  if (!storage) {
    console.log(`[SIMULATION] File uploaded to ${path}: ${file.name}`);
    return URL.createObjectURL(file); // Return local blob URL for simulation
  }
  const storageRef = ref(storage, `${path}/${Date.now()}_${file.name}`);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
};

export const DbService = {
  
  // --- NEWS & UPDATES ---
  
  // Public Feed: Only 'published' posts
  subscribeToNews(onUpdate: (posts: NewsPost[]) => void): () => void {
    if (!db) {
        onUpdate(MOCK_NEWS.filter(n => n.status === 'published'));
        return () => {};
    }
    const q = query(
      collection(db, 'news_posts'), 
      where('status', '==', 'published'),
      orderBy('createdAt', 'desc')
    );
    return onSnapshot(q, (snapshot) => {
      onUpdate(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as NewsPost)));
    });
  },

  // Submit News (Partners/Clients -> Pending, Admin -> Published)
  async submitNewsPost(post: Omit<NewsPost, 'id' | 'date' | 'status' | 'likes'>, isAdmin: boolean): Promise<boolean> {
    const status = isAdmin ? 'published' : 'pending';
    const date = new Date().toLocaleDateString();
    
    if (!db) {
      console.log(`[SIMULATION] News Submitted (Status: ${status}):`, post);
      // Manually add to mock for immediate feedback in demo
      MOCK_NEWS.unshift({
        id: `mock-${Date.now()}`,
        ...post,
        date,
        status,
        likes: 0,
        createdAt: new Date()
      });
      return true;
    }

    try {
      await addDoc(collection(db, 'news_posts'), {
        ...post,
        date,
        status,
        likes: 0,
        createdAt: Timestamp.now()
      });
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  },

  // Toggle Like on News Post
  async toggleNewsLike(id: string): Promise<number> {
    if (!db) {
      const post = MOCK_NEWS.find(n => n.id === id);
      if (post) {
        post.likes = (post.likes || 0) + 1;
        return post.likes;
      }
      return 0;
    }

    try {
      const ref = doc(db, 'news_posts', id);
      await updateDoc(ref, { likes: increment(1) });
      return 1; // Real-time listener will handle actual count update
    } catch (e) {
      console.error(e);
      return 0;
    }
  },

  // Admin/Dashboard: Get all news (including pending)
  async getDashboardNews(uid: string, role: string): Promise<NewsPost[]> {
    if (!db) {
      if (role === 'admin') return MOCK_NEWS;
      return MOCK_NEWS.filter(n => n.authorId === uid || n.status === 'published');
    }

    try {
      let q;
      if (role === 'admin') {
        // Admin sees everything
        q = query(collection(db, 'news_posts'), orderBy('createdAt', 'desc'));
      } else {
        q = query(collection(db, 'news_posts'), where('authorId', '==', uid), orderBy('createdAt', 'desc'));
      }
      
      const snap = await getDocs(q);
      return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as NewsPost));
    } catch (e) {
      console.error(e);
      return [];
    }
  },

  async updateNewsStatus(id: string, status: 'published' | 'rejected'): Promise<boolean> {
    if (!db) {
      console.log(`[SIMULATION] News ${id} status updated to: ${status}`);
      const idx = MOCK_NEWS.findIndex(n => n.id === id);
      if (idx !== -1) MOCK_NEWS[idx].status = status;
      return true;
    }
    try {
      await updateDoc(doc(db, 'news_posts', id), { status });
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  },


  // --- CONTACT ---

  async submitContactForm(data: FormData): Promise<boolean> {
    if (!db) {
      console.log("[SIMULATION] Contact Form Submitted:", data);
      await new Promise(r => setTimeout(r, 1000));
      return true;
    }
    try {
      await addDoc(collection(db, 'contact_submissions'), { ...data, submittedAt: Timestamp.now(), status: 'new' });
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  },

  // --- CANDIDATE ---

  async submitCandidateRegistration(data: CandidateRegistrationData): Promise<boolean> {
    if (!db) {
      console.log("[SIMULATION] Candidate Registration Submitted:", data);
      await new Promise(r => setTimeout(r, 1500));
      return true;
    }

    try {
      let passportUrl = '';
      if (data.passportImage instanceof File) {
        passportUrl = await uploadFile(data.passportImage, 'candidates/passports');
      }

      const cleanGuarantors = await Promise.all(data.guarantors.map(async (g) => {
         let idUrl = '';
         if (g.idCardImage instanceof File) {
           idUrl = await uploadFile(g.idCardImage, 'candidates/guarantors');
         }
         const { idCardImage, ...rest } = g;
         return { ...rest, idCardImageUrl: idUrl };
      }));

      const { passportImage, guarantors, ...cleanData } = data;
      
      const payload = { 
        ...cleanData, 
        passportImageUrl: passportUrl,
        guarantors: cleanGuarantors, 
        submittedAt: Timestamp.now(), 
        status: 'pending_payment_verification' 
      };

      await addDoc(collection(db, 'candidate_registrations'), payload);
      return true;
    } catch (e) {
      console.error("Registration Error:", e);
      return false;
    }
  },

  // --- PARTNER ---

  async submitPartnerApplication(app: PartnerApplication): Promise<boolean> {
    if (!db) {
      console.log("[SIMULATION] Partner Application Submitted:", app);
      await new Promise(r => setTimeout(r, 1000));
      return true;
    }
    try {
      const { type, data } = app;
      let cleanData: any = { ...data };
      
      if (type === 'individual' && cleanData.idDocument instanceof File) {
         cleanData.idDocumentUrl = await uploadFile(cleanData.idDocument, 'partners/ids');
         delete cleanData.idDocument;
      } else if (type === 'org' && cleanData.cacCertificate instanceof File) {
         cleanData.cacCertificateUrl = await uploadFile(cleanData.cacCertificate, 'partners/certs');
         delete cleanData.cacCertificate;
      }

      const payload = { type, data: cleanData, submittedAt: Timestamp.now(), status: 'pending_review' };
      await addDoc(collection(db, 'partner_applications'), payload);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  },

  // --- NEWSLETTER ---

  async subscribeToNewsletter(email: string): Promise<boolean> {
    if (!db) {
      console.log(`[SIMULATION] Newsletter subscription: ${email}`);
      return true;
    }
    try {
      await addDoc(collection(db, 'newsletter_subscribers'), { email, subscribedAt: Timestamp.now() });
      return true;
    } catch (e) { return false; }
  },

  // --- USER & ROLES ---

  async setUserRole(uid: string, role: string, name: string, email: string | null, photoURL: string | null): Promise<void> {
    if (!db) {
      console.log(`[SIMULATION] Role assigned for ${uid}: ${role}`);
      return;
    }
    try {
      const userRef = doc(db, 'users', uid);
      await setDoc(userRef, {
        role,
        name,
        email,
        photoURL,
        updatedAt: Timestamp.now()
      }, { merge: true });
    } catch (e) {
      console.error("Error setting user role:", e);
    }
  },

  async updateUserProfile(uid: string, data: { name?: string, photoURL?: string }): Promise<boolean> {
    if (!db) {
      console.log(`[SIMULATION] User profile updated for ${uid}`, data);
      return true;
    }
    try {
      await updateDoc(doc(db, 'users', uid), data);
      return true;
    } catch (e) {
      console.error("Error updating profile:", e);
      return false;
    }
  },

  // --- NOTIFICATIONS SYSTEM ---

  async createNotification(userId: string, notification: Omit<AppNotification, 'id' | 'userId' | 'read' | 'timestamp' | 'createdAt'>): Promise<void> {
    const newNotif = {
      ...notification,
      userId,
      read: false,
      timestamp: 'Just now',
      createdAt: Timestamp.now()
    };

    if (!db) {
      MOCK_NOTIFICATIONS.unshift({ 
        id: `n-${Date.now()}`, 
        ...newNotif 
      } as AppNotification);
      return;
    }

    try {
      await addDoc(collection(db, 'notifications'), newNotif);
    } catch (e) {
      console.error("Failed to create notification", e);
    }
  },

  async getNotifications(userId: string): Promise<AppNotification[]> {
    if (!db) {
      return MOCK_NOTIFICATIONS.filter(n => n.userId === userId || userId.startsWith('demo-'));
    }
    try {
      const q = query(
        collection(db, 'notifications'), 
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const snap = await getDocs(q);
      return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as AppNotification));
    } catch (e) {
      console.error("Error fetching notifications:", e);
      return [];
    }
  },

  async markNotificationRead(id: string): Promise<void> {
    if (!db) {
      const notif = MOCK_NOTIFICATIONS.find(n => n.id === id);
      if (notif) notif.read = true;
      return;
    }
    try {
      await updateDoc(doc(db, 'notifications', id), { read: true });
    } catch (e) {
      console.error(e);
    }
  },

  async markAllNotificationsRead(userId: string): Promise<void> {
    if (!db) {
      MOCK_NOTIFICATIONS.filter(n => n.userId === userId).forEach(n => n.read = true);
      return;
    }
    // Batch update skipped for brevity in production logic, looping is acceptable for low volume
    // Ideally use writeBatch()
  },

  // --- JOB APPLICATIONS ---

  async applyToJob(userId: string, job: Job): Promise<boolean> {
    const applicationId = `app-${Date.now()}`;
    const application: JobApplication = {
      id: applicationId,
      jobId: job.id,
      candidateId: userId,
      jobTitle: job.title,
      company: job.company,
      appliedAt: new Date().toLocaleDateString(),
      status: 'Applied'
    };

    if (!db) {
      console.log(`[SIMULATION] User ${userId} applied to ${job.title}`);
      MOCK_APPLICATIONS.unshift(application);
      
      // Notify Candidate
      await this.createNotification(userId, {
        title: 'Application Sent',
        message: `You successfully applied for ${job.title} at ${job.company}.`,
        type: 'success'
      });

      return true;
    }

    try {
      await addDoc(collection(db, 'applications'), application);
      
      // Notify Candidate
      await this.createNotification(userId, {
        title: 'Application Sent',
        message: `You successfully applied for ${job.title} at ${job.company}.`,
        type: 'success'
      });

      // In real app, notify Admin/Client too
      
      return true;
    } catch (e) {
      console.error("Job Application Error:", e);
      return false;
    }
  },

  async getCandidateApplications(userId?: string): Promise<JobApplication[]> {
    if (!db) {
        if (!userId) return MOCK_APPLICATIONS;
        return MOCK_APPLICATIONS.filter(a => a.candidateId === userId || userId.startsWith('demo-'));
    }
    try {
      // If userId is provided, filter by it. Otherwise return all (for admin)
      const q = userId 
        ? query(collection(db, 'applications'), where('candidateId', '==', userId))
        : query(collection(db, 'applications'));
      
      const snap = await getDocs(q);
      return snap.docs.map(doc => ({id: doc.id, ...doc.data()} as JobApplication));
    } catch (e) { return []; }
  },

  // --- DATA FETCHING (DASHBOARD) ---

  async getPartnerTasks(): Promise<Task[]> {
    if(!db) return MOCK_TASKS;
    const snap = await getDocs(collection(db, 'tasks'));
    return snap.docs.map(d => ({id: d.id, ...d.data()} as Task));
  },

  async getPartnerEarnings(): Promise<Transaction[]> {
    if(!db) return MOCK_TRANSACTIONS;
    const snap = await getDocs(collection(db, 'earnings'));
    return snap.docs.map(d => ({id: d.id, ...d.data()} as Transaction));
  },

  async getProjects(): Promise<Project[]> {
    if(!db) return MOCK_PROJECTS;
    const snap = await getDocs(collection(db, 'projects'));
    return snap.docs.map(d => ({id: d.id, ...d.data()} as Project));
  },

  async getPendingCandidates(): Promise<CandidateRecord[]> {
    if (!db) return MOCK_CANDIDATES.filter(c => c.status === 'pending_payment_verification');
    try {
      const q = query(collection(db, 'candidate_registrations'), where('status', '==', 'pending_payment_verification'));
      const snap = await getDocs(q);
      return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as CandidateRecord));
    } catch (e) { console.error(e); return []; }
  },

  // For Admin Candidate Pool (All verified)
  async getAllVerifiedCandidates(): Promise<CandidateRecord[]> {
    if (!db) return MOCK_CANDIDATES.filter(c => c.status !== 'pending_payment_verification');
    try {
      const q = query(collection(db, 'candidate_registrations'), where('status', 'in', ['verified', 'placed', 'rejected']));
      const snap = await getDocs(q);
      return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as CandidateRecord));
    } catch (e) { console.error(e); return []; }
  },

  async verifyCandidatePayment(id: string, newStatus: 'verified' | 'rejected'): Promise<boolean> {
    if (!db) {
      console.log(`[SIMULATION] Candidate ${id} status update: ${newStatus}`);
      const idx = MOCK_CANDIDATES.findIndex(c => c.id === id);
      if (idx !== -1) MOCK_CANDIDATES[idx].status = newStatus;
      return true;
    }
    try {
      await updateDoc(doc(db, 'candidate_registrations', id), { status: newStatus });
      return true;
    } catch (e) { return false; }
  },

  async getPendingPartners(): Promise<PartnerRecord[]> {
    if (!db) return MOCK_PARTNERS;
    try {
      const q = query(collection(db, 'partner_applications'), where('status', '==', 'pending_review'));
      const snap = await getDocs(q);
      return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as PartnerRecord));
    } catch (e) { console.error(e); return []; }
  },

  async reviewPartnerApplication(id: string, newStatus: 'approved' | 'rejected'): Promise<boolean> {
    if (!db) {
      console.log(`[SIMULATION] Partner ${id} status update: ${newStatus}`);
      await new Promise(r => setTimeout(r, 500));
      return true;
    }
    try {
      await updateDoc(doc(db, 'partner_applications', id), { status: newStatus });
      return true;
    } catch (e) { return false; }
  },

  // --- NEW MODULES ---

  async getJobs(): Promise<Job[]> {
    if (!db) return MOCK_JOBS;
    const snap = await getDocs(collection(db, 'jobs'));
    return snap.docs.map(d => ({id: d.id, ...d.data()} as Job));
  },

  async createJob(job: Omit<Job, 'id'>): Promise<boolean> {
    if (!db) {
      console.log("[SIMULATION] Creating Job:", job);
      MOCK_JOBS.unshift({ id: `job-${Date.now()}`, ...job });
      return true;
    }
    try {
      await addDoc(collection(db, 'jobs'), job);
      return true;
    } catch (e) { return false; }
  },

  async deleteJob(id: string): Promise<boolean> {
    if (!db) {
      console.log("[SIMULATION] Deleting Job:", id);
      MOCK_JOBS = MOCK_JOBS.filter(j => j.id !== id);
      return true;
    }
    try {
      await deleteDoc(doc(db, 'jobs', id));
      return true;
    } catch (e) { return false; }
  },

  async getClientInvoices(): Promise<Invoice[]> {
    if (!db) return MOCK_INVOICES;
    // In real app, filter by clientId
    const snap = await getDocs(collection(db, 'invoices'));
    return snap.docs.map(d => ({id: d.id, ...d.data()} as Invoice));
  }
};