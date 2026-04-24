import React from 'react';
import { Link } from 'react-router-dom';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-900 px-6 font-sans">
      <main className="max-w-3xl w-full text-center space-y-10 animate-fade-in">
        <header className="space-y-4">
          <h1 className="text-6xl md:text-7xl font-bold tracking-tight text-slate-950">
            Volumes
          </h1>
        </header>

        <div className="bg-white p-8 rounded-3xl border border-slate-400 shadow-sm max-w-lg mx-auto">
          <p className="text-lg font-normal text-slate-700 italic leading-relaxed">
            "The classics are those books which come to us bearing the aura of previous interpretations."
          </p>
          <p className="mt-4 text-sm font-bold uppercase tracking-widest text-slate-400">— Italo Calvino</p>
        </div>

        <div className="pt-4 flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4">
          <Link
            to="/bookshelf"
            className="w-full md:w-auto inline-flex items-center justify-center min-w-[280px] px-10 py-4 bg-slate-900 text-white rounded-full hover:bg-slate-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 font-semibold text-lg"
          >
            Explore The Bookshelf
          </Link>
          <Link
            to="/why"
            className="w-full md:w-auto inline-flex items-center justify-center min-w-[280px] px-10 py-4 bg-slate-900 text-white rounded-full hover:bg-slate-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 font-semibold text-lg"
          >
            Explore The Why
          </Link>
        </div>
      </main>

    </div>
  );
};

export default Landing;
