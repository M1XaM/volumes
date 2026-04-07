import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-900 px-6 font-sans">
      <main className="max-w-3xl w-full text-center space-y-10 animate-fade-in">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-200">
            <BookOpen className="w-10 h-10 text-slate-800" />
          </div>
        </div>
        
        <header className="space-y-4">
          <h1 className="text-6xl md:text-7xl font-bold tracking-tight text-slate-950">
            Volumes
          </h1>
          <p className="text-xl md:text-2xl font-medium text-slate-600 max-w-xl mx-auto leading-relaxed">
            A definitive guide to the essential works that have shaped human civilization.
          </p>
        </header>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm max-w-lg mx-auto">
          <p className="text-lg font-normal text-slate-700 italic leading-relaxed">
            "The classics are those books which come to us bearing the aura of previous interpretations."
          </p>
          <p className="mt-4 text-sm font-bold uppercase tracking-widest text-slate-400">— Italo Calvino</p>
        </div>

        <div className="pt-4">
          <Link
            to="/bookshelf"
            className="inline-flex items-center px-10 py-4 bg-slate-900 text-white rounded-full hover:bg-slate-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 font-semibold text-lg"
          >
            Explore Volumes
          </Link>
        </div>
      </main>

      <footer className="mt-20 py-10 text-sm font-semibold tracking-widest uppercase text-slate-400">
        Curated Wisdom Through the Ages
      </footer>
    </div>
  );
};

export default Landing;
