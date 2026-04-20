import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Why: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-slate-200">
      <div className="max-w-3xl mx-auto px-6 py-20">
        <Link to="/" className="inline-flex items-center space-x-2 text-slate-400 hover:text-slate-950 font-bold tracking-tight transition-colors mb-16">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm uppercase tracking-widest">Volumes</span>
        </Link>
        
        <article className="prose prose-slate lg:prose-lg mx-auto">
          <h1 className="text-5xl font-black text-slate-950 tracking-tight mb-12 text-center text-balance leading-tight">
            Why Literature Matters
          </h1>
          
          <div className="space-y-12 text-slate-700 leading-relaxed font-medium">
            <section>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-4">A Window Into Other Minds</h2>
              <p>
                Reading is the closest we can come to true telepathy. When we read a compelling narrative, we step entirely outside of our own consciousness and inhabit the thoughts, struggles, and triumphs of another. This radical empathy breaks down walls of prejudice and misunderstanding, cultivating a deeper connection to the broader human family.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-4">The Archive of Human Experience</h2>
              <p>
                Books are the collective memory of our species. They capture the philosophical breakthroughs of antiquity, the scientific awakenings of the Enlightenment, and the complex social evolutions of modernity. By engaging with this archive, we avoid repeating the errors of the past and build upon the profound insights of those who came before us.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-4">Refining Our Own Thought</h2>
              <p>
                The structure of literature demands focus, contemplation, and deep analysis. In an era structured around ephemeral clips and infinite scrolling, the slow decoding of a complex text acts as a counterweight. It trains our minds to hold multiple perspectives simultaneously, grapple with ambiguity, and articulate our own beliefs with greater clarity.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-4">Building The Future</h2>
              <p>
                In storytelling, we experiment with futures that do not yet exist. We simulate civilizations, play out technological advancements, and warn ourselves of authoritarian drifts. It is the rehearsal space for humanity's next chapter where we decide who we want to be.
              </p>
            </section>
          </div>
        </article>
      </div>
    </div>
  );
};

export default Why;
