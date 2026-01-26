import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { DbService } from '../../services/db';
import { NewsPost } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Check, X, Loader2, Image as ImageIcon, Layout, Clock, Send, Heart } from 'lucide-react';

const DashboardNews: React.FC = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'published'>('all');

  // Form State
  const [newPost, setNewPost] = useState({
    title: '',
    category: 'Update' as 'Update' | 'Insight' | 'Milestone',
    excerpt: '',
    content: '',
    image: ''
  });

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    fetchNews();
  }, [user]);

  const fetchNews = async () => {
    if (!user) return;
    setLoading(true);
    const data = await DbService.getDashboardNews(user.uid, user.role || '');
    setPosts(data);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSubmitting(true);

    const success = await DbService.submitNewsPost({
      ...newPost,
      author: user.name,
      authorId: user.uid,
    }, isAdmin);

    setIsSubmitting(false);

    if (success) {
      setIsCreating(false);
      setNewPost({ title: '', category: 'Update', excerpt: '', content: '', image: '' });
      fetchNews(); // Refresh list
    } else {
      alert("Failed to submit news. Please try again.");
    }
  };

  const handleStatusChange = async (id: string, status: 'published' | 'rejected') => {
    const success = await DbService.updateNewsStatus(id, status);
    if (success) {
      setPosts(prev => prev.map(p => p.id === id ? { ...p, status } : p));
    }
  };

  const filteredPosts = posts.filter(p => {
    if (activeTab === 'all') return true;
    return p.status === activeTab;
  });

  // Calculate pending count for admins to show on tab
  const pendingCount = posts.filter(p => p.status === 'pending').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">
            {isAdmin ? 'News Management' : 'Project Updates'}
          </h2>
          <p className="text-slate-400 text-sm">
            {isAdmin 
              ? 'Approve updates from partners and publish company news.' 
              : 'Share milestones and updates about your projects.'}
          </p>
        </div>
        
        <button 
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors text-sm font-bold shadow-lg shadow-indigo-900/20"
        >
           <Plus size={16} /> {isAdmin ? 'Write Article' : 'Submit Update'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10 space-x-6">
        <button 
          onClick={() => setActiveTab('all')}
          className={`pb-3 text-sm font-medium transition-colors relative ${activeTab === 'all' ? 'text-cyan' : 'text-slate-400 hover:text-white'}`}
        >
          All Posts
          {activeTab === 'all' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan" />}
        </button>
        <button 
          onClick={() => setActiveTab('pending')}
          className={`pb-3 text-sm font-medium transition-colors relative flex items-center gap-2 ${activeTab === 'pending' ? 'text-cyan' : 'text-slate-400 hover:text-white'}`}
        >
          Pending
          {isAdmin && pendingCount > 0 && <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{pendingCount}</span>}
          {activeTab === 'pending' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan" />}
        </button>
        <button 
          onClick={() => setActiveTab('published')}
          className={`pb-3 text-sm font-medium transition-colors relative ${activeTab === 'published' ? 'text-cyan' : 'text-slate-400 hover:text-white'}`}
        >
          Published
          {activeTab === 'published' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan" />}
        </button>
      </div>

      {/* CREATE FORM */}
      <AnimatePresence>
        {isCreating && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
               <h3 className="text-lg font-bold text-white mb-4">Compose New Update</h3>
               <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     <div className="md:col-span-2 space-y-1.5">
                        <label className="text-xs text-slate-400">Headline</label>
                        <input 
                          required
                          value={newPost.title}
                          onChange={e => setNewPost({...newPost, title: e.target.value})}
                          className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-cyan outline-none"
                          placeholder="e.g. Project Phase 1 Completed"
                        />
                     </div>
                     <div className="space-y-1.5">
                        <label className="text-xs text-slate-400">Category</label>
                        <select 
                          value={newPost.category}
                          onChange={e => setNewPost({...newPost, category: e.target.value as any})}
                          className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-cyan outline-none appearance-none"
                        >
                          <option className="bg-midnight" value="Update">Update</option>
                          <option className="bg-midnight" value="Milestone">Milestone</option>
                          <option className="bg-midnight" value="Insight">Insight</option>
                        </select>
                     </div>
                  </div>

                  <div className="space-y-1.5">
                     <label className="text-xs text-slate-400">Short Summary</label>
                     <textarea 
                        required
                        value={newPost.excerpt}
                        onChange={e => setNewPost({...newPost, excerpt: e.target.value})}
                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-cyan outline-none h-20 resize-none"
                        placeholder="Brief description of the update..."
                     />
                  </div>

                  <div className="flex gap-4 pt-2">
                     <button 
                       type="button" 
                       onClick={() => setIsCreating(false)}
                       className="px-4 py-2 rounded-lg border border-white/10 text-slate-400 hover:text-white transition-colors"
                     >
                       Cancel
                     </button>
                     <button 
                       type="submit"
                       disabled={isSubmitting}
                       className="px-6 py-2 rounded-lg bg-cyan text-midnight font-bold hover:bg-white transition-colors flex items-center gap-2 disabled:opacity-50"
                     >
                       {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                       {isAdmin ? 'Publish Now' : 'Submit for Review'}
                     </button>
                  </div>
               </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* POSTS LIST */}
      {loading ? (
        <div className="flex justify-center py-20">
           <Loader2 className="text-cyan animate-spin" size={32} />
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-white/5 rounded-2xl">
           <Layout size={32} className="mx-auto text-slate-600 mb-4" />
           <p className="text-slate-500">No posts found in this category.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          <AnimatePresence>
            {filteredPosts.map(post => (
              <motion.div
                key={post.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white/5 border border-white/10 rounded-xl p-5 flex flex-col md:flex-row gap-6 hover:border-white/20 transition-colors"
              >
                 {/* Status Indicator */}
                 <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3 mb-2">
                       <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${
                         post.status === 'published' ? 'bg-green-500/20 text-green-400' :
                         post.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                         'bg-amber-500/20 text-amber-400'
                       }`}>
                         {post.status}
                       </span>
                       <span className="text-xs text-slate-500 flex items-center gap-1">
                         <Clock size={12} /> {post.date}
                       </span>
                       {post.likes > 0 && (
                         <span className="text-xs text-red-400 flex items-center gap-1 font-bold">
                           <Heart size={12} fill="currentColor" /> {post.likes}
                         </span>
                       )}
                    </div>
                    <h3 className="text-lg font-bold text-white">{post.title}</h3>
                    <p className="text-sm text-slate-400">{post.excerpt}</p>
                    <div className="text-xs text-slate-500 pt-2">Posted by: {post.author}</div>
                 </div>

                 {/* Admin Actions */}
                 {isAdmin && post.status === 'pending' && (
                    <div className="flex flex-row md:flex-col gap-2 justify-center border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6 min-w-[140px]">
                       <button 
                         onClick={() => handleStatusChange(post.id, 'published')}
                         className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-xs font-bold rounded-lg transition-colors w-full"
                       >
                         <Check size={14} /> Approve
                       </button>
                       <button 
                         onClick={() => handleStatusChange(post.id, 'rejected')}
                         className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold rounded-lg transition-colors w-full"
                       >
                         <X size={14} /> Reject
                       </button>
                    </div>
                 )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default DashboardNews;