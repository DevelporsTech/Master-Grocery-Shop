import React from 'react';
import { useStore } from '../context/StoreContext';
import { BLOG_POSTS } from '../data/mockData';
import { BookOpen, Calendar, User, Clock, ArrowRight } from 'lucide-react';

export const BlogView: React.FC = () => {
  const { navigateTo } = useStore();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="bg-gradient-to-r from-emerald-900 to-emerald-950 text-white p-8 rounded-3xl shadow-xl space-y-2">
        <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
          Health, Wellness & Culinary Guides
        </span>
        <h1 className="text-2xl md:text-3xl font-extrabold font-serif">
          Pakistani Dry Fruits & Kitchen Wisdom Blog
        </h1>
        <p className="text-xs text-emerald-200">
          Scientifically backed nutritional insights and traditional Pakistani kitchen storage guidelines.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {BLOG_POSTS.map((post) => (
          <div
            key={post.id}
            onClick={() => navigateTo('blog-detail', { blogSlug: post.slug })}
            className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-xl transition-all cursor-pointer flex flex-col group"
          >
            <div className="h-56 overflow-hidden bg-gray-100">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full uppercase">
                  {post.category}
                </span>
                <h2 className="text-lg font-bold font-serif text-gray-900 group-hover:text-emerald-700 transition-colors mt-3">
                  {post.title}
                </h2>
                {post.titleUrdu && (
                  <p className="text-sm font-serif text-emerald-800 font-bold mt-1">{post.titleUrdu}</p>
                )}
                <p className="text-xs text-gray-500 mt-2 line-clamp-3 leading-relaxed">{post.excerpt}</p>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                <span className="font-bold text-gray-700">By {post.author}</span>
                <span>{post.readTime}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
