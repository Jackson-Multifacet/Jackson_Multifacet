import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, User, ArrowRight, Plus, Lock, Unlock, Loader2 } from 'lucide-react';
import { NewsPost } from '../types';
import SwipeHint from './SwipeHint';
import { DbService } from '../services/db';

const NewsSection: React.FC = () => {
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isAddingPost, setIsAddingPost] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Admin Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<NewsPost['category']>('Update');
  const [newExcerpt, setNewExcerpt] = useState('');

  // Subscribe to real-time data
  useEffect(() => {
    const unsubscribe = DbService.subscribeToNews((fetchedPosts) => {
      setPosts(fetchedPosts);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleAddPost = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const newPostData = {
      title: newTitle,
      category: newCategory,
      excerpt: newExcerpt,
      content: '',
      author: 'Admin',
      image: 'https://images.unsplash.com/photo-1642427749670-f20e2e76ed8c?auto=format&fit=crop&q=80&w=800'
    };
    
    const result = await DbService.addNewsPost(newPostData);
    
    setIsSubmitting(false);
    
    if (result) {
      // If we are in simulation mode, we manually update the list because we don't have a real listener
      if (!process.env.FIREBASE_API_KEY) {
         setPosts(prev => [result as NewsPost, ...prev]);
      }
      setIsAddingPost(false);
      setNewTitle('');
      setNewExcerpt('');
    } else {
      alert("Failed to add post. Please try again.");
    }
  };

  return (
    <section id="news" className="relative z-10 py-24 px-6">
       {/* Glassmorphic Container for the whole section */}
      <div className="absolute inset-0 bg-midnight/40 backdrop-blur-[100px] pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="text-4xl font-bold text-white mb-4 drop-shadow-[0_0_15px_rgba(0,212,255,0.3)]">
              Latest Intelligence
            </h2>
            <p className="text-slate-300 max-w-xl font-light">
              Updates, insights, and milestones from the Jackson Multifacet team.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {isAdminMode && (
              <button 
                onClick={() => setIsAddingPost(true)}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600/20 border border-indigo-500/50 rounded-lg text-indigo-400 hover:bg-indigo-600 hover:text-white transition-all text-sm backdrop-blur-md"
              >
                <Plus size={16} /> New Post
              </button>
            )}
            <button 
              onClick={() => setIsAdminMode(!isAdminMode)}
              className={`p-2 rounded-lg border transition-all backdrop-blur-md ${isAdminMode ? 'bg-red-500/20 border-red-500 text-red-400' : 'bg-white/5 border-white/10 text-slate-500 hover:text-white'}`}
              title={isAdminMode ? "Exit Admin Mode" : "Admin Login"}
            >
              {isAdminMode ? <Unlock size={18} /> : <Lock size={18} />}
            </button>
          </div>
        </div>

        {/* Admin Post Creator */}
        <AnimatePresence>
          {isAddingPost && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-12 overflow-hidden"
            >
              <div className="bg-indigo-900/10 border border-indigo-500/30 p-8 rounded-2xl backdrop-blur-md">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                  Compose New Update
                </h3>
                <form onSubmit={handleAddPost} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <input 
                        required
                        placeholder="Headline"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        className="w-full bg-midnight/50 border border-indigo-500/20 rounded-lg px-4 py-3 text-white focus:border-indigo-500 outline-none"
                      />
                    </div>
                    <div>
                      <select 
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value as any)}
                        className="w-full bg-midnight/50 border border-indigo-500/20 rounded-lg px-4 py-3 text-white focus:border-indigo-500 outline-none appearance-none"
                      >
                        <option value="Update">Update</option>
                        <option value="Insight">Insight</option>
                        <option value="Milestone">Milestone</option>
                      </select>
                    </div>
                  </div>
                  <textarea 
                    required
                    placeholder="Brief excerpt or summary..."
                    value={newExcerpt}
                    onChange={(e) => setNewExcerpt(e.target.value)}
                    rows={3}
                    className="w-full bg-midnight/50 border border-indigo-500/20 rounded-lg px-4 py-3 text-white focus:border-indigo-500 outline-none resize-none"
                  />
                  <div className="flex justify-end gap-3">
                    <button 
                      type="button" 
                      onClick={() => setIsAddingPost(false)}
                      className="px-4 py-2 text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium shadow-lg shadow-indigo-500/20 flex items-center gap-2 disabled:opacity-50"
                    >
                      {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                      Publish Post
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-20">
            <Loader2 size={40} className="text-cyan animate-spin" />
          </div>
        )}

        {/* Posts Grid */}
        {!loading && (
          <div className="relative">
            <SwipeHint />
            <div className="flex md:grid md:grid-cols-3 gap-8 overflow-x-auto md:overflow-visible snap-x snap-mandatory no-scrollbar pb-8 md:pb-0 -mx-6 px-6 md:mx-0 md:px-0">
              {posts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="min-w-[85vw] md:min-w-0 snap-center group relative rounded-3xl overflow-hidden border border-white/10 hover:border-cyan/50 transition-all duration-500 bg-white/[0.02] backdrop-blur-xl flex flex-col h-full"
                >
                  {/* Image Container */}
                  <div className="h-48 w-full overflow-hidden relative shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-t from-midnight to-transparent z-10 opacity-80" />
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4 z-20">
                       <span className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold border backdrop-blur-md ${
                        post.category === 'Milestone' ? 'border-amber-500/50 text-amber-300 bg-black/40' :
                        post.category === 'Insight' ? 'border-purple-500/50 text-purple-300 bg-black/40' :
                        'border-cyan/50 text-cyan bg-black/40'
                      }`}>
                        {post.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 relative z-20 -mt-10 flex flex-col flex-1">
                    <div className="absolute inset-0 bg-gradient-to-b from-midnight/90 to-midnight rounded-t-3xl backdrop-blur-sm -z-10" />
                    
                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
                      <Calendar size={12} /> {post.date}
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan transition-colors leading-tight">
                      {post.title}
                    </h3>
                    
                    <p className="text-slate-400 text-sm mb-6 line-clamp-2 flex-1">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
                      <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                        <User size={12} />
                        {post.author}
                      </div>
                      <button className="text-sm font-medium text-white group-hover:text-cyan flex items-center gap-1 transition-all group-hover:gap-2">
                        Read <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default NewsSection;