import React from 'react';
import { useStore } from '../context/StoreContext';
import { BLOG_POSTS } from '../data/mockData';
import { User, Calendar, Clock, ArrowLeft, Share2, Sparkles } from 'lucide-react';

export const BlogDetailView: React.FC = () => {
  const { selectedBlogSlug, navigateTo, showToast } = useStore();

  const post = BLOG_POSTS.find((b) => b.slug === selectedBlogSlug) || BLOG_POSTS[0];

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: post.title, url: window.location.href });
    } else {
      showToast('Article link copied to clipboard!', 'info');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <button
        onClick={() => navigateTo('blog')}
        className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Blog List
      </button>

      {/* Header */}
      <div className="space-y-3">
        <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full uppercase">
          {post.category}
        </span>
        <h1 className="text-2xl md:text-4xl font-extrabold font-serif text-gray-900 leading-tight">
          {post.title}
        </h1>
        {post.titleUrdu && (
          <p className="text-lg font-serif text-emerald-800 font-bold">{post.titleUrdu}</p>
        )}

        <div className="flex flex-wrap items-center justify-between gap-4 py-3 border-y border-gray-200 text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <span className="font-bold text-gray-900">By {post.author}</span>
            <span>Published: {post.date}</span>
            <span>{post.readTime}</span>
          </div>

          <button
            onClick={handleShare}
            className="flex items-center gap-1 text-emerald-700 font-bold hover:underline"
          >
            <Share2 className="w-4 h-4" /> Share Article
          </button>
        </div>
      </div>

      {/* Cover Image */}
      <div className="h-80 md:h-96 rounded-3xl overflow-hidden border border-gray-200">
        <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
      </div>

      {/* Content */}
      <div className="bg-white p-6 md:p-10 rounded-3xl border border-gray-200 shadow-xs prose prose-emerald max-w-none text-xs md:text-sm text-gray-700 leading-relaxed whitespace-pre-line font-sans">
        {post.content}
      </div>
    </div>
  );
};
