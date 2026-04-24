import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import volumesMap from './assets/volumes.png';

const Why: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-slate-200">
      <div className="max-w-3xl mx-auto px-6 py-20">
        <Link to="/" className="inline-flex items-center space-x-2 text-slate-400 hover:text-slate-950 font-bold tracking-tight transition-colors mb-16">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm uppercase tracking-widest">Volumes</span>
        </Link>
        
        <article className="prose prose-slate lg:prose-lg mx-auto">
          <h1 className="text-4xl md:text-5xl font-black text-slate-950 tracking-tight mb-8 md:mb-12 text-center text-balance leading-tight">
            Why Literature Matters
          </h1>
          
          <div className="space-y-12 text-slate-700 leading-relaxed font-medium">
            <section>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-4" style={{ textIndent: '40px' }}>Introduction</h2>
              <p style={{ textIndent: '40px' }}>In this fast-changing world, where each one of us chooses to spend our free minutes, hours, days, on social networks, which are not that social anymore, and on streaming platforms, designed to capture your attention as long as possible, books remain one of the most meaningful choices, right after direct communication with other people to enjoy the company, or create something bigger. This short text is written with the scope to share my opinion on the importance of literature for a modern person.
</p> <p style={{ textIndent: '40px' }}>I've identified the most important aspects of the literature in our time and four categories that complete the picture I've formed of this topic from my small library. As Nassim Taleb argues in The Black Swan, an 'antilibrary' of unread books is actually more useful than a shelf of books you've already finished because it keeps you hungry for knowledge. So this will be my justification for such a small number of books I've read.
</p> <p style={{ textIndent: '40px' }}>I also want to mention that the Ideas and Timeless sections are mostly about classic books, which are just hundreds of them, and have little to do with the other 170 million books in the world, as of 2026. At the same time, the Mental Health and Hobby sections include a wider variety of literature. Books are not identical to each other in the sense of the value they provide. Some of them are a must-read, others… just be happy you didn't hear of them. As in any other topic, you should approach it carefully, especially the first time. So let's begin to convince you to read!
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-4" style={{ textIndent: '40px' }}>Ideas</h2>
              <p style={{ textIndent: '40px' }}>
The more complex the ideas, the more complex they should be preserved. 10 seconds of TikTok or Instagram Reel can at most introduce an idea, 10 requests to the model can explain that idea, but only books will allow us to internalize it. The raw idea can be shown on the screen and presented as valuable. But these ideas are already digested and presented as conclusions. How many people will actually understand them? Moreover, how many will decide to follow it? As Immanuel Kant argues in An Answer to the Question: What Is Enlightenment? (1784), people often remain in intellectual passivity, preferring ease over the effort required for independent thinking. Only through sustained reading and reflection are we able to fully understand the value of an idea, and so to follow it from an internal desire, not from an external statement of good habit. It may take you longer to grasp the essence and enjoy the pleasure of accomplishment than a short video does, but the satisfaction is greater and lasts longer.              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-4" style={{ textIndent: '40px' }}>Timeless</h2>
              <p style={{ textIndent: '40px' }}>
Books have long been one of the most reliable ways to preserve and transmit knowledge across generations. Many foundational ideas in fields such as philosophy, mathematics, and science were recorded and developed through written works. Even if now we have digitalized the information, and distributed it across digital systems, they have not replaced the structured and reflective nature of books, and the original context.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-4" style={{ textIndent: '40px' }}>Hobby</h2>
              <p style={{ textIndent: '40px' }}>
Books are also fun! There are so many of them, on so many topics, and so many worlds to explore. They allow us to live other lives, expanding not just knowledge, but also emotional intelligence. As mentioned before, you can choose to spend your free time on any of the 170 million pieces, so I'm sure you could find something to your taste, just use a bit of concentration to read it.              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-4" style={{ textIndent: '40px' }}>Conclusions</h2>
              <p style={{ textIndent: '40px' }}>
Literature is not just a source of information, nor a shield from the shame of not being productive, and it's not meant to be the mechanism of success in this world. Spending time with books is shifting your thinking into depth, appreciating the meaning and greatness. This doesn't mean that anything different from reading literature is a priori evil, but it is definitely misused by the majority, and not even by their own fault. I consider that in this life we should always try something new, and it'll be a pleasure if your next thing is a well-chosen book.              </p>

              <br/>

              <p>
P.S. I would like to mention that this is written for my laboratory work, and includes the Bookshelf page that contains all the classic books that are meant to be read by everyone in their lifetime. This bookshelf was originally a literature map, where the relations between works, genres, and epochs are shown. This map can be found at the end of this text, and remains the source of truth. Would be happy for any feedback (in the form of PRs).              </p>
              
              <div className="mt-8 mb-4">
                <a href={volumesMap} target="_blank" rel="noopener noreferrer">
                  <img src={volumesMap} alt="Literature Map" className="w-full h-auto rounded-lg shadow-sm cursor-pointer hover:opacity-95 transition-opacity" />
                </a>
              </div>
            </section>

          </div>
        </article>
      </div>
    </div>
  );
};

export default Why;
