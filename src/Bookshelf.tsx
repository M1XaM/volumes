import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL, getHeaders } from "./api";
import { Link } from 'react-router-dom';
import { ArrowLeft, Book, Hash, User, CheckCircle2, Circle, PenLine, Loader2, ShoppingCart } from 'lucide-react';
import volumesData from '../docs/nodes.json';

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
  const [isbn, setIsbn] = useState<string | null>(null);
  const [isbns, setIsbns] = useState<string[]>([]);
  const [previewAvailable, setPreviewAvailable] = useState<boolean>(false);
  const [isFetchingIsbn, setIsFetchingIsbn] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const navigate = useNavigate();
  const [userProgress, setUserProgress] = useState<UserProgress>({});
  const [guestWarning, setGuestWarning] = useState<boolean>(false);

  
  const syncWithServer = async () => {
    try {
      const res = await fetch(`${API_URL}/data`, {
        headers: getHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        if (Object.keys(data.marks || {}).length > 0) {
          setUserProgress(data.marks);
        }
      } else if (res.status === 401) {
        navigate("/login");
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      syncWithServer();
    }
  }, []);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      fetch(`${API_URL}/data`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ marks: userProgress, read_list: [] })
      }).catch(console.error);
    }
  }, [userProgress]);


  useEffect(() => {
    if (!selectedWork) {
      setIsbn(null);
      setIsbns([]);
      setShowPreview(false);
      setIsFetchingIsbn(false);
      setPreviewAvailable(false);
      return;
    }
    const fetchIsbn = async () => {
      setIsFetchingIsbn(true);
      setPreviewAvailable(false);
      try {
        const title = selectedWork.label;
        const author = selectedWork.author || '';
        const res = await fetch(`https://openlibrary.org/search.json?title=${encodeURIComponent(title)}&author=${encodeURIComponent(author)}&fields=isbn`);
        const data = await res.json();
        
        let collectedIsbns: string[] = [];
        if (data && data.docs) {
          data.docs.slice(0, 3).forEach((doc: any) => {
            if (doc.isbn) {
              collectedIsbns.push(...doc.isbn.slice(0, 5));
            }
            });
        }
        
        const foundIsbn = collectedIsbns[0];
        if (foundIsbn) {
          setIsbn(foundIsbn);
          setIsbns(collectedIsbns);

          // Check against Google Books Dynamic Link API securely via JSONP
          const bibkeys = collectedIsbns.slice(0, 15).map(i => `ISBN:${i}`).join(',');
          if (bibkeys.length > 0) {
            await new Promise<void>((resolve) => {
              const callbackName = `gb_cb_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
              // @ts-ignore
              window[callbackName] = (gbObj: any) => {
                // Clean up global namespace
                // @ts-ignore
                delete window[callbackName];
                const scriptTag = document.getElementById(callbackName);
                if (scriptTag) scriptTag.remove();

                if (gbObj) {
                  const hasPreview = Object.values(gbObj).some((info: any) => info.embeddable);
                  setPreviewAvailable(hasPreview);
                }
                resolve();
              };

              const script = document.createElement('script');
              script.id = callbackName;
              script.src = `https://books.google.com/books?jscmd=viewapi&bibkeys=${bibkeys}&callback=${callbackName}`;
              script.onerror = () => {
                console.error("Failed to check Google Preview");
                resolve();
              };
              document.head.appendChild(script);
            });
          }
        } else {
          setIsbn(null);
          setIsbns([]);
        }
      } catch (err) {
        console.error("Failed to fetch ISBN:", err);
        setIsbn(null);
        setIsbns([]);
      } finally {
        setIsFetchingIsbn(false);
      }
    };
    fetchIsbn();
  }, [selectedWork]);

  useEffect(() => {
    if (!showPreview || !isbn || isbns.length === 0) return;

    let viewer: any = null;

    const initViewer = () => {
      // @ts-ignore
      if (window.google?.books?.DefaultViewer) {
        const container = document.getElementById('google-books-viewer');
        if (container) {
          // @ts-ignore
          viewer = new window.google.books.DefaultViewer(container);
          const identifiers = isbns.map(i => `ISBN:${i}`);
          viewer.load(identifiers, () => {
            container.innerHTML = '<div class="flex items-center justify-center p-8 text-slate-500 font-medium h-full">Preview not available for this book.</div>';
          }, () => {
            console.log('Google Books viewer loaded successfully');
            });
        }
      }
    };

    // @ts-ignore
    if (window.google?.books?.DefaultViewer) {
       // already loaded
       initViewer();
    // @ts-ignore
    } else if (window.google?.books) {
       // @ts-ignore
       window.google.books.setOnLoadCallback(initViewer);
    }
  }, [showPreview, isbn]);

  const toggleRead = (workId: string) => {
    if (!localStorage.getItem("token")) {
      setGuestWarning(true);
    }
    setUserProgress(prev => ({
      ...prev,
      [workId]: {
        ...prev[workId],
        isRead: !prev[workId]?.isRead
      }
    }));
  };

  const updateNotes = (workId: string, notes: string) => {
    if (!localStorage.getItem("token")) {
      setGuestWarning(true);
    }
    if (notes.length > 512) return;
    setUserProgress(prev => ({
      ...prev,
      [workId]: {
        ...prev[workId],
        notes
      }
    }));
  };

  const periods = volumesData.nodes.filter((n: any) => n.type === 'period') as any[];
  const works = volumesData.nodes.filter((n: any) => n.type === 'work') as Work[];
  const genres = volumesData.nodes.filter((n: any) => n.type === 'genre') as any[];
  const regions = volumesData.nodes.filter((n: any) => n.type === 'region') as any[];
  
  const getPeriodForWork = (workId: string) => {
    const genreEdge = volumesData.edges.find((e: any) => e.to === workId && e.type === 'includes');
    if (!genreEdge) return null;
    const periodEdge = volumesData.edges.find((e: any) => e.to === genreEdge.from && e.type === 'contains');
    return periodEdge ? periodEdge.from : null;
  };

  const getGenreForWork = (workId: string) => {
    const edge = volumesData.edges.find((e: any) => e.to === workId && e.type === 'includes');
    return edge ? genres.find((g: any) => g.id === edge.from) : null;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-slate-200">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="flex justify-between items-center mb-16">
          <Link to="/" className="inline-flex items-center space-x-2 text-slate-400 hover:text-slate-950 font-bold tracking-tight transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm uppercase tracking-widest">Volumes</span>
          </Link>
          <div className="space-x-4">
            {localStorage.getItem("token") ? (
              <button onClick={() => { localStorage.removeItem("token"); window.location.reload(); }} className="text-sm font-semibold text-slate-600 hover:text-slate-900">Logout</button>
            ) : (
              <>
                <Link to="/login" className="text-sm font-semibold text-slate-600 hover:text-slate-900">Login</Link>
                <Link to="/register" className="text-sm font-semibold text-slate-600 hover:text-slate-900">Register</Link>
              </>
            )}
          </div>
        </div>

        <header className="mb-16 md:mb-24 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-950 mb-4 md:mb-6">
            The Bookshelf
          </h2>
        </header>
        
        <div className="space-y-32">
          {periods.map(period => {
            const periodWorks = works.filter(work => {
              if (work.genre) {
                const periodEdge = volumesData.edges.find((e: any) => e.to === work.genre && e.from === period.id && e.type === 'contains');
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
                    <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight">{period.label}</h3>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-sm mt-2">{period.range}</p>
                  </div>
                  <div className="mt-4 md:mt-0 flex items-center space-x-4">
                    <Hash className="w-10 h-10 text-slate-800" />
                  </div>
                </div>
                
                <div className="space-y-16">
                  {Object.entries(worksByGenre).map(([genreLabel, genreWorks]) => (
                    <div key={genreLabel} className="bg-white rounded-3xl p-8 border border-slate-400 shadow-sm">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="md:col-span-1">
                          <div className="sticky top-24">
                            <h4 className="text-sm uppercase tracking-[0.2em] font-black text-slate-900 mb-2">
                              {genreLabel}
                            </h4>
                            <div className="w-8 h-1 bg-slate-200 mb-4 rounded-full"></div>
                            <p className="text-xs text-slate-400 font-medium">{genreWorks.length} {genreWorks.length === 1 ? 'Work' : 'Works'}</p>
                          </div>
                        </div>
                        <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-8">
                          {genreWorks.map(work => (
                            <div 
                              key={work.id} 
                              onClick={() => setSelectedWork(work)}
                              className="p-6 bg-slate-50/50 rounded-2xl hover:bg-slate-100/50 transition-all duration-300 border border-transparent hover:border-slate-400 group cursor-pointer"
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
                                  <div className="inline-block px-3 py-1 bg-white border border-slate-400 rounded-lg text-[10px] font-bold uppercase tracking-wider text-slate-400">
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
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-[2rem] shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-8 duration-500"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative p-8 sm:p-12">
              <div className="mb-10">
                <h3 className="text-3xl md:text-4xl font-black text-slate-950 leading-tight mb-4 mt-6">
                  {selectedWork.label}
                </h3>
                
                <div className="flex flex-col gap-y-3">
                  {/* Line 1: Author, Genres, and Region */}
                  <div className="flex items-center space-x-3 text-slate-600 flex-wrap gap-y-2">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-slate-400" />
                      <span className="text-lg font-bold">{selectedWork.author || 'Anonymous'}</span>
                    </div>
                    <div className="flex items-center space-x-2 px-3 border-l border-slate-300">
                      <div className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                        {getGenreForWork(selectedWork.id)?.label || 'Work'}
                      </div>
                      <div className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                        {selectedWork.region ? regions.find(r => r.id === selectedWork.region)?.label : 'Unknown Region'}
                      </div>
                    </div>
                  </div>

                  {/* Line 2: ISBN and External Links */}
                  {isbn && (
                    <div className="flex items-center space-x-4 text-slate-600 flex-wrap gap-y-2">
                      <div className="flex items-center space-x-2">
                        <Hash className="w-4 h-4 text-slate-400" />
                        <span className="text-sm font-semibold tracking-wide text-slate-500">ISBN: {isbn}</span>
                      </div>
                      <div className="flex items-center space-x-4 px-3 border-l border-slate-300">
                        <a href={`https://www.amazon.com/s?k=${isbn}`} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-1 text-sm font-semibold text-slate-500 hover:text-amber-600 transition-colors">
                          <ShoppingCart className="w-4 h-4" />
                          <span>Amazon</span>
                        </a>
                        <a href={`https://www.goodreads.com/search?q=${isbn}`} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-1 text-sm font-semibold text-slate-500 hover:text-amber-900 transition-colors">
                          <Book className="w-4 h-4" />
                          <span>Goodreads</span>
                        </a>
                      </div>
                    </div>
                  )}
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
                  <div className="pt-4 sm:pt-6">
                    <h4 className="flex items-center space-x-2 text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-4">
                      <User className="w-3.5 h-3.5" />
                      <span>About the Author</span>
                    </h4>
                    <p className="text-base text-slate-500 leading-relaxed">
                      {selectedWork.authorDescription || 'No description available for this author.'}
                    </p>
                  </div>
                )}

                {showPreview && isbn && (
                  <div className="pt-4 sm:pt-6 animate-in fade-in slide-in-from-top-4 duration-500">
                    <h4 className="flex items-center space-x-2 text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-4">
                      <Book className="w-3.5 h-3.5" />
                      <span>Google Books Preview</span>
                    </h4>
                    <div className="w-full h-[500px] rounded-xl overflow-hidden border border-slate-200 shadow-inner bg-slate-50">
                      <div id="google-books-viewer" className="w-full h-full bg-white"></div>
                    </div>
                  </div>
                )}

                <div className="pt-4 sm:pt-6">
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
                    className="w-full h-32 p-4 bg-slate-50 rounded-2xl border border-slate-300 focus:border-slate-300 focus:ring-4 focus:ring-slate-100 outline-none resize-none text-slate-600 font-medium placeholder:text-slate-300 transition-all duration-300"
                  />
                </div>
              </div>

              <div className="mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 xl:gap-8">
                <button
                  onClick={() => toggleRead(selectedWork.id)}
                  className={`w-full flex items-center justify-center space-x-2 px-2 sm:px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold uppercase tracking-widest transition-all duration-300 whitespace-nowrap overflow-hidden ${
                    userProgress[selectedWork.id]?.isRead 
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' 
                      : 'bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600'
                  }`}
                >
                  {userProgress[selectedWork.id]?.isRead ? (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Completed</span>
                    </>
                  ) : (
                    <>
                      <Circle className="w-5 h-5" />
                      <span>Mark as Read</span>
                    </>
                  )}
                </button>
                
                <div className="relative group w-full">
                  {!isFetchingIsbn && !previewAvailable && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-2 bg-slate-800 text-white text-xs font-bold rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 pointer-events-none shadow-xl">
                      Preview not available
                      <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-4 border-transparent border-t-slate-800"></div>
                    </div>
                  )}
                  <button
                    onClick={() => {
                      if (!isFetchingIsbn && previewAvailable) setShowPreview(!showPreview);
                    }}
                    disabled={isFetchingIsbn || (!isFetchingIsbn && !previewAvailable)}
                    className={`w-full flex items-center justify-center space-x-2 px-2 sm:px-4 py-3 rounded-2xl font-bold text-xs sm:text-sm tracking-widest uppercase transition-all duration-300 border shadow-sm whitespace-nowrap overflow-hidden ${
                      isFetchingIsbn 
                        ? 'bg-blue-50 text-blue-600 border-blue-200 opacity-60 cursor-wait' 
                        : !previewAvailable
                          ? 'bg-slate-100 text-slate-400 border-slate-200 !pointer-events-none'
                          : 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 hover:shadow-md'
                    }`}
                  >
                    {isFetchingIsbn ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Loading...</span>
                      </>
                    ) : (
                      <span>{showPreview ? 'Hide Preview' : 'See Preview'}</span>
                    )}
                  </button>
                  {/* Invisible overlay to catch mouse events for the tooltip since disabled buttons drop them */}
                  {!isFetchingIsbn && !previewAvailable && (
                    <div className="absolute inset-0 cursor-not-allowed z-10"></div>
                  )}
                </div>

                <button 
                  onClick={() => setSelectedWork(null)}
                  className="w-full flex items-center justify-center px-2 sm:px-4 py-3 bg-slate-900 text-white rounded-2xl font-bold text-xs sm:text-sm hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200 text-center uppercase tracking-widest whitespace-nowrap overflow-hidden"
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
