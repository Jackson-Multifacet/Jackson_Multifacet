import { db, storage } from '../lib/firebase';
import { collection, addDoc, getDocs, query, orderBy, onSnapshot, Timestamp, updateDoc, doc, where, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { FormData, NewsPost, CandidateRegistrationData, PartnerApplication, Task, Transaction, Project, CandidateRecord, PartnerRecord } from '../types';

// Helper to upload files
const uploadFile = async (file: File, path: string): Promise<string> => {
  if (!storage) throw new Error("Storage not initialized");
  const storageRef = ref(storage, `${path}/${Date.now()}_${file.name}`);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
};

export const DbService = {
  
  async submitContactForm(data: FormData): Promise<boolean> {
    if (!db) return false;
    try {
      await addDoc(collection(db, 'contact_submissions'), { ...data, submittedAt: Timestamp.now(), status: 'new' });
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  },

  async submitCandidateRegistration(data: CandidateRegistrationData): Promise<boolean> {
    if (!db) return false;
    try {
      let passportUrl = '';
      if (data.passportImage instanceof File) {
        passportUrl = await uploadFile(data.passportImage, 'candidates/passports');
      }

      // Handle Guarantors Images
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

  async submitPartnerApplication(app: PartnerApplication): Promise<boolean> {
    if (!db) return false;
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

  async subscribeToNewsletter(email: string): Promise<boolean> {
    if (!db) return false;
    try {
      await addDoc(collection(db, 'newsletter_subscribers'), { email, subscribedAt: Timestamp.now() });
      return true;
    } catch (e) { return false; }
  },

  async addNewsPost(post: Omit<NewsPost, 'id' | 'date'>): Promise<NewsPost | null> {
    if (!db) return null;
    try {
      const newPostData = { ...post, date: new Date().toLocaleDateString(), createdAt: Timestamp.now() };
      const docRef = await addDoc(collection(db, 'news_posts'), newPostData);
      return { id: docRef.id, ...newPostData };
    } catch (e) { return null; }
  },

  subscribeToNews(onUpdate: (posts: NewsPost[]) => void): () => void {
    if (!db) {
        // Fallback for empty DB or no connection, allows app to not crash
        onUpdate([]);
        return () => {};
    }
    const q = query(collection(db, 'news_posts'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      onUpdate(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as NewsPost)));
    });
  },

  // --- USER & DASHBOARD METHODS ---

  async setUserRole(uid: string, role: string, name: string, email: string | null, photoURL: string | null): Promise<void> {
    if (!db) return;
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

  async getUserRole(uid: string): Promise<string | null> {
      if(!db) return null;
      // You could implement fetching the user doc here. 
      // For now, we handle this logic in AuthContext usually.
      return null;
  },

  async getPartnerTasks(): Promise<Task[]> {
    if(!db) return [];
    // Currently querying a global tasks collection for demo purposes
    // In a real app, you'd filter by assignee == currentUserId
    const snap = await getDocs(collection(db, 'tasks'));
    return snap.docs.map(d => ({id: d.id, ...d.data()} as Task));
  },

  async getPartnerEarnings(): Promise<Transaction[]> {
    if(!db) return [];
    const snap = await getDocs(collection(db, 'earnings'));
    return snap.docs.map(d => ({id: d.id, ...d.data()} as Transaction));
  },

  async getProjects(): Promise<Project[]> {
    if(!db) return [];
    const snap = await getDocs(collection(db, 'projects'));
    return snap.docs.map(d => ({id: d.id, ...d.data()} as Project));
  },

  // --- ADMIN METHODS ---

  async getPendingCandidates(): Promise<CandidateRecord[]> {
    if (!db) return [];
    try {
      const q = query(collection(db, 'candidate_registrations'), where('status', '==', 'pending_payment_verification'));
      const snap = await getDocs(q);
      return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as CandidateRecord));
    } catch (e) { console.error(e); return []; }
  },

  async verifyCandidatePayment(id: string, newStatus: 'verified' | 'rejected'): Promise<boolean> {
    if (!db) return false;
    try {
      await updateDoc(doc(db, 'candidate_registrations', id), { status: newStatus });
      return true;
    } catch (e) { return false; }
  },

  async getPendingPartners(): Promise<PartnerRecord[]> {
    if (!db) return [];
    try {
      const q = query(collection(db, 'partner_applications'), where('status', '==', 'pending_review'));
      const snap = await getDocs(q);
      return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as PartnerRecord));
    } catch (e) { console.error(e); return []; }
  },

  async reviewPartnerApplication(id: string, newStatus: 'approved' | 'rejected'): Promise<boolean> {
    if (!db) return false;
    try {
      await updateDoc(doc(db, 'partner_applications', id), { status: newStatus });
      return true;
    } catch (e) { return false; }
  }
};