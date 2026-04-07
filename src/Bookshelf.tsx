import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Book, Hash, X, User, CheckCircle2, Circle, PenLine } from 'lucide-react';
import volumesData from '../volumes.json';

interface Work {
  id: string;
  type: string;
  label: string;
  author?: string;
  authorDescription?: string;
  region?: string;
  genre: string;
  description?: string;
}

interface UserProgress {
  [workId: string]: {
    isRead: boolean;
    notes: string;
  };
}

const Bookshelf: React.FC = () => {
  const [selectedWork, setSelectedWork] = useState<Work | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem('volumes-user-progress');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('volumes-user-progress', JSON.stringify(userProgress));
  }, [userProgress]);

  const toggleRead = (workId: string) => {
    setUserProgress(prev => ({
      ...prev,
      [workId]: {
        ...prev[workId],
        isRead: !prev[workId]?.isRead
      }
    }));
  };

  const updateNotes = (workId: string, notes: string) => {
    if (notes.length > 512) return;
    setUserProgress(prev => ({
      ...prev,
      [workId]: {
        ...prev[workId],
        notes
      }
    }));
  };

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
                            <div 
                              key={work.id} 
                              onClick={() => setSelectedWork(work)}
                              className="p-6 bg-slate-50/50 rounded-2xl hover:bg-slate-100/50 transition-all duration-300 border border-transparent hover:border-slate-200 group cursor-pointer"
                            >
                              <div className="flex items-start space-x-4">
                                <Book className="w-5 h-5 text-slate-400 mt-1" />
                                <div>
                                  <div className="flex items-center space-x-2">
                                    <h5 className="text-lg font-extrabold text-slate-900 group-hover:text-slate-700 leading-tight">
                                      {work.label}
                                    </h5>
                                    {userProgress[work.id]?.isRead && (
                                      <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-50" />
                                    )}
                                  </div>
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

      {/* Book Detail Modal */}
      {selectedWork && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div 
            className="w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-500"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative p-8 sm:p-12">
              <button 
                onClick={() => setSelectedWork(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-10">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                    {getGenreForWork(selectedWork.id)?.label || 'Work'}
                  </div>
                  <div className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                    {selectedWork.region ? regions.find(r => r.id === selectedWork.region)?.label : 'Unknown Region'}
                  </div>
                  <button
                    onClick={() => toggleRead(selectedWork.id)}
                    className={`ml-auto flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                      userProgress[selectedWork.id]?.isRead 
                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' 
                        : 'bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600'
                    }`}
                  >
                    {userProgress[selectedWork.id]?.isRead ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Completed</span>
                      </>
                    ) : (
                      <>
                        <Circle className="w-4 h-4" />
                        <span>Mark as Read</span>
                      </>
                    )}
                  </button>
                </div>
                <h3 className="text-4xl font-black text-slate-950 leading-tight mb-4">
                  {selectedWork.label}
                </h3>
                <div className="flex items-center space-x-2 text-slate-600">
                  <User className="w-4 h-4 text-slate-400" />
                  <span className="text-lg font-bold">{selectedWork.author || 'Anonymous'}</span>
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <h4 className="flex items-center space-x-2 text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-4">
                    <Book className="w-3.5 h-3.5" />
                    <span>About the Volume</span>
                  </h4>
                  <p className="text-lg text-slate-600 leading-relaxed font-medium">
                    {selectedWork.description || 'No description available for this work.'}
                  </p>
                </div>

                {selectedWork.author && (
                  <div className="pt-8 border-t border-slate-100">
                    <h4 className="flex items-center space-x-2 text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-4">
                      <User className="w-3.5 h-3.5" />
                      <span>About the Author</span>
                    </h4>
                    <p className="text-base text-slate-500 leading-relaxed">
                      {selectedWork.authorDescription || 'No description available for this author.'}
                    </p>
                  </div>
                )}

                <div className="pt-8 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="flex items-center space-x-2 text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                      <PenLine className="w-3.5 h-3.5" />
                      <span>My Personal Notes</span>
                    </h4>
                    <span className={`text-[10px] font-bold ${
                      (userProgress[selectedWork.id]?.notes?.length || 0) >= 500 ? 'text-rose-500' : 'text-slate-300'
                    }`}>
                      {userProgress[selectedWork.id]?.notes?.length || 0} / 512
                    </span>
                  </div>
                  <textarea
                    value={userProgress[selectedWork.id]?.notes || ''}
                    onChange={(e) => updateNotes(selectedWork.id, e.target.value.slice(0, 512))}
                    placeholder="Reflect on this work..."
                    className="w-full h-32 p-4 bg-slate-50 rounded-2xl border border-slate-100 focus:border-slate-300 focus:ring-4 focus:ring-slate-100 outline-none resize-none text-slate-600 font-medium placeholder:text-slate-300 transition-all duration-300"
                  />
                </div>
              </div>

              <div className="mt-12 flex justify-end">
                <button 
                  onClick={() => setSelectedWork(null)}
                  className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
          {/* Overlay click to close */}
          <div className="fixed inset-0 -z-10" onClick={() => setSelectedWork(null)}></div>
        </div>
      )}
    </div>
  );
};

export default Bookshelf;
