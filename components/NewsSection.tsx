import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, User, ArrowRight, Loader2, Heart, Share2, Twitter, Linkedin, Link as LinkIcon, Check } from 'lucide-react';
import { NewsPost } from '../types';
import SwipeHint from './SwipeHint';
import { DbService } from '../services/db';

const NewsSection: React.FC = () => {
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  
  // Track which card has the share menu open
  const [activeShareId, setActiveShareId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Subscribe to real-time data
  useEffect(() => {
    const unsubscribe = DbService.subscribeToNews((fetchedPosts) => {
      setPosts(fetchedPosts);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLike = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    if (likedPosts.has(id)) return; // Simple "vote once" per session implementation for UX

    // Optimistic UI update
    setLikedPosts(prev => new Set(prev).add(id));
    
    // Call DB
    await DbService.toggleNewsLike(id);
  };

  const toggleShare = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveShareId(activeShareId === id ? null : id);
    setCopiedId(null);
  };

  const handleSocialShare = (platform: 'twitter' | 'linkedin' | 'copy', post: NewsPost, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Construct URL (In a real app with routing, this would be a specific slug like /news/post-id)
    const url = window.location.href; 
    const text = encodeURIComponent(`Check out this update from Jackson Multifacet: ${post.title}`);
    const urlEnc = encodeURIComponent(url);

    if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${text}&url=${urlEnc}`, '_blank');
      setActiveShareId(null);
    } else if (platform === 'linkedin') {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${urlEnc}`, '_blank');
      setActiveShareId(null);
    } else if (platform === 'copy') {
      navigator.clipboard.writeText(`${post.title} - ${url}`);
      setCopiedId(post.id);
      setTimeout(() => {
        setCopiedId(null);
        setActiveShareId(null);
      }, 2000);
      // Don't close immediately for copy feedback
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
        </div>

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
            {posts.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-white/10 rounded-xl text-slate-500">
                No updates available at the moment.
              </div>
            ) : (
              <div className="flex md:grid md:grid-cols-3 gap-8 overflow-x-auto md:overflow-visible snap-x snap-mandatory no-scrollbar pb-8 md:pb-0 -mx-6 px-6 md:mx-0 md:px-0">
                {posts.map((post, index) => (
                  <motion.article
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="min-w-[85vw] md:min-w-0 snap-center group relative rounded-3xl overflow-hidden border border-white/10 hover:border-cyan/50 transition-all duration-500 bg-white/[0.02] backdrop-blur-xl flex flex-col h-full"
                    onClick={() => setActiveShareId(null)} // Close share menu if clicking elsewhere on card
                  >
                    {/* Image Container */}
                    <div className="h-48 w-full overflow-hidden relative shrink-0">
                      <div className="absolute inset-0 bg-gradient-to-t from-midnight to-transparent z-10 opacity-80" />
                      <img 
                        src={post.image || 'https://images.unsplash.com/photo-1642427749670-f20e2e76ed8c?auto=format&fit=crop&q=80&w=800'} 
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
                      
                      <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto relative">
                        <div className="flex items-center gap-4">
                           {/* Like Button */}
                           <button 
                             onClick={(e) => handleLike(post.id, e)}
                             className={`flex items-center gap-1.5 text-xs font-bold transition-all ${
                               likedPosts.has(post.id) ? 'text-red-500' : 'text-slate-500 hover:text-red-400'
                             }`}
                           >
                             <Heart size={14} fill={likedPosts.has(post.id) ? "currentColor" : "none"} className={likedPosts.has(post.id) ? "animate-pulse" : ""} />
                             {post.likes || 0}
                           </button>

                           {/* Share Button */}
                           <div className="relative">
                             <button
                               onClick={(e) => toggleShare(post.id, e)}
                               className={`flex items-center gap-1.5 text-xs font-bold transition-all ${
                                 activeShareId === post.id ? 'text-cyan' : 'text-slate-500 hover:text-cyan'
                               }`}
                             >
                               <Share2 size={14} />
                             </button>

                             {/* Share Popup Menu */}
                             <AnimatePresence>
                               {activeShareId === post.id && (
                                 <motion.div
                                   initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                   animate={{ opacity: 1, y: 0, scale: 1 }}
                                   exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                   className="absolute bottom-full left-0 mb-3 bg-midnight/90 border border-white/10 backdrop-blur-xl rounded-xl p-1.5 flex gap-1 shadow-xl z-30"
                                   onClick={(e) => e.stopPropagation()}
                                 >
                                   <button 
                                     onClick={(e) => handleSocialShare('twitter', post, e)}
                                     className="p-2 hover:bg-white/10 rounded-lg text-slate-300 hover:text-cyan transition-colors"
                                     title="Share on Twitter"
                                   >
                                     <Twitter size={14} />
                                   </button>
                                   <button 
                                     onClick={(e) => handleSocialShare('linkedin', post, e)}
                                     className="p-2 hover:bg-white/10 rounded-lg text-slate-300 hover:text-indigo-400 transition-colors"
                                     title="Share on LinkedIn"
                                   >
                                     <Linkedin size={14} />
                                   </button>
                                   <div className="w-px bg-white/10 my-1 mx-0.5" />
                                   <button 
                                     onClick={(e) => handleSocialShare('copy', post, e)}
                                     className="p-2 hover:bg-white/10 rounded-lg text-slate-300 hover:text-green-400 transition-colors"
                                     title="Copy Link"
                                   >
                                     {copiedId === post.id ? <Check size={14} /> : <LinkIcon size={14} />}
                                   </button>
                                   
                                   {/* Arrow */}
                                   <div className="absolute -bottom-1.5 left-2 w-3 h-3 bg-midnight/90 border-r border-b border-white/10 rotate-45" />
                                 </motion.div>
                               )}
                             </AnimatePresence>
                           </div>

                           <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                             <User size={12} />
                             {post.author}
                           </div>
                        </div>
                        <button className="text-sm font-medium text-white group-hover:text-cyan flex items-center gap-1 transition-all group-hover:gap-2">
                          Read <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default NewsSection;