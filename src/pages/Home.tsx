import { Link } from 'react-router-dom';

const features = [
  {
    emoji: '🎉',
    title: 'One-link invites',
    description: 'Share a single link. No app downloads, no account needed for guests.'
  },
  {
    emoji: '📋',
    title: 'Live guest list',
    description: 'See who\'s going, who\'s maybe, and who can\'t make it — all in real time.'
  },
  {
    emoji: '✨',
    title: 'Beautiful by default',
    description: 'Every invitation looks stunning without any design work from you.'
  },
  {
    emoji: '🔔',
    title: 'RSVP notifications',
    description: 'Get notified the moment someone responds to your invite.'
  }
];

export default function Home() {
  return (
    <main>
      <section className="bg-ink text-paper py-20 md:py-32 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="font-mono text-primary text-sm tracking-widest uppercase mb-4">Event invitations, reimagined</p>
          <h1 className="font-serif text-5xl md:text-7xl font-800 mb-6">Throw parties people<br />actually show up to</h1>
          <p className="font-mono text-lg text-[#c8c4bc] max-w-xl mx-auto mb-10">
            Create a beautiful invitation, share one link, and watch your guest list fill up. No app downloads. No friction.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/signup"
              className="font-mono min-h-[44px] inline-flex items-center px-8 py-3 bg-primary text-white rounded-lg text-lg hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-ink"
            >
              Create your first event
            </Link>
            <Link
              to="/login"
              className="font-mono min-h-[44px] inline-flex items-center px-8 py-3 border-2 border-primary-dark text-primary-dark rounded-lg text-lg hover:bg-ink/50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-ink"
            >
              Sign in
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-paper py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl font-600 text-ink text-center mb-4">Everything you need to host</h2>
          <p className="font-mono text-[#6b6862] text-center max-w-lg mx-auto mb-16">
            From casual dinners to big celebrations — Confetti handles the logistics so you can focus on the fun.
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((f) => (
              <div key={f.title} className="bg-white rounded-2xl p-8 border border-ink/10">
                <span className="text-4xl mb-4 block" role="img" aria-label={f.title}>{f.emoji}</span>
                <h3 className="font-serif text-xl font-600 text-ink mb-2">{f.title}</h3>
                <p className="font-mono text-sm text-[#6b6862] leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ink text-paper py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-600 mb-4">Ready to plan your next event?</h2>
          <p className="font-mono text-[#c8c4bc] mb-8">Free to start. No credit card required.</p>
          <Link
            to="/signup"
            className="font-mono min-h-[44px] inline-flex items-center px-8 py-3 bg-primary text-white rounded-lg text-lg hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary"
          >
            Get started free
          </Link>
        </div>
      </section>
    </main>
  );
}