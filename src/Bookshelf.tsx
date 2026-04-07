import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Book, Hash } from 'lucide-react';
import volumesData from '../volumes.json';

interface Work {
  id: string;
  type: string;
  label: string;
  author?: string;
  region?: string;
  genre: string;
}

const Bookshelf: React.FC = () => {
  const periods = volumesData.nodes.filter(n => n.type === 'period');
  const works = volumesData.nodes.filter(n => n.type === 'work');
  const genres = volumesData.nodes.filter(n => n.type === 'genre');
  const regions = volumesData.nodes.filter(n => n.type === 'region');
  
  const getPeriodForWork = (workId: string) => {
    const genreEdge = volumesData.edges.find(e => e.to === workId && e.type === 'includes');
    if (!genreEdge) return null;
    const periodEdge = volumesData.edges.find(e => e.to === genreEdge.from && e.type === 'contains');
    return periodEdge ? periodEdge.from : null;
  };

  const getGenreForWork = (workId: string) => {
    const edge = volumesData.edges.find(e => e.to === workId && e.type === 'includes');
    return edge ? genres.find(g => g.id === edge.from) : null;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-slate-200">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="inline-flex items-center space-x-2 text-slate-600 hover:text-slate-950 font-bold tracking-tight transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm uppercase tracking-widest">Volumes</span>
          </Link>
          <div className="flex items-center space-x-6">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Total: {works.length} Works</span>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-20">
        <header className="mb-24 text-center">
          <h2 className="text-5xl font-extrabold tracking-tight text-slate-950 mb-6">
            The Digital Bookshelf
          </h2>
          <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto">
            Organized by Epoch and Genre.
          </p>
        </header>
        
        <div className="space-y-32">
          {periods.map(period => {
            const periodWorks = works.filter(work => {
              if (work.genre) {
                const periodEdge = volumesData.edges.find(e => e.to === work.genre && e.from === period.id && e.type === 'contains');
                if (periodEdge) return true;
              }
              return getPeriodForWork(work.id) === period.id;
            });
            
            if (periodWorks.length === 0) return null;

            const worksByGenre: { [key: string]: typeof works } = {};
            periodWorks.forEach(work => {
              const genre = getGenreForWork(work.id) || (work.genre ? genres.find(g => g.id === work.genre) : null);
              const genreLabel = genre ? genre.label : 'Other';
              if (!worksByGenre[genreLabel]) worksByGenre[genreLabel] = [];
              worksByGenre[genreLabel].push(work);
            });

            return (
              <section key={period.id} className="animate-fade-in">
                <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center md:justify-between mb-12 transform -rotate-1">
                  <div>
                    <h3 className="text-4xl font-extrabold tracking-tight">{period.label}</h3>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-sm mt-2">{period.range}</p>
                  </div>
                  <div className="mt-4 md:mt-0 flex items-center space-x-4">
                    <Hash className="w-10 h-10 text-slate-800" />
                  </div>
                </div>
                
                <div className="space-y-16">
                  {Object.entries(worksByGenre).map(([genreLabel, genreWorks]) => (
                    <div key={genreLabel} className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="md:col-span-1">
                          <div className="sticky top-24">
                            <h4 className="text-sm uppercase tracking-[0.2em] font-black text-slate-900 mb-2">
                              {genreLabel}
                            </h4>
                            <div className="w-8 h-1 bg-slate-200 mb-4 rounded-full"></div>
                            <p className="text-xs text-slate-400 font-medium">{genreWorks.length} Essential {genreWorks.length === 1 ? 'Work' : 'Works'}</p>
                          </div>
                        </div>
                        <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-8">
                          {genreWorks.map(work => (
                            <div key={work.id} className="p-6 bg-slate-50/50 rounded-2xl hover:bg-slate-100/50 transition-all duration-300 border border-transparent hover:border-slate-200 group">
                              <div className="flex items-start space-x-4">
                                <Book className="w-5 h-5 text-slate-400 mt-1" />
                                <div>
                                  <h5 className="text-lg font-extrabold text-slate-900 group-hover:text-slate-700 leading-tight mb-2">
                                    {work.label}
                                  </h5>
                                  <p className="text-slate-600 font-semibold mb-3">
                                    {work.author || 'Anonymous'}
                                  </p>
                                  <div className="inline-block px-3 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                    {work.region ? regions.find(r => r.id === work.region)?.label : 'Unknown Region'}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Bookshelf;
