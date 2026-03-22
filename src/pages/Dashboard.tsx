import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Event, Rsvp } from '../types';

const EMOJIS = ['🎉', '🎂', '🍕', '🎸', '🌮', '🏖️', '🎃', '🥂', '🎊', '🪩'];

function generateInviteCode(): string {
  return Math.random().toString(36).substring(2, 10);
}

export default function Dashboard() {
  const [events, setEvents] = useState<Event[]>([]);
  const [rsvps, setRsvps] = useState<Record<string, Rsvp[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [coverEmoji, setCoverEmoji] = useState('🎉');
  const [creating, setCreating] = useState(false);

  const fetchEvents = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data, error: fetchErr } = await supabase
      .from('events')
      .select('*')
      .eq('user_id', user.id)
      .is('deleted_at', null)
      .order('event_date', { ascending: true });
    if (fetchErr) {
      setError('Could not load your events. Please refresh.');
      return;
    }
    setEvents(data || []);
  }, []);

  const fetchRsvps = useCallback(async (eventId: string) => {
    const { data } = await supabase
      .from('rsvps')
      .select('*')
      .eq('event_id', eventId)
      .is('deleted_at', null)
      .order('created_at', { ascending: true });
    setRsvps((prev) => ({ ...prev, [eventId]: data || [] }));
  }, []);

  useEffect(() => {
    fetchEvents().finally(() => setLoading(false));
  }, [fetchEvents]);

  useEffect(() => {
    if (selectedEvent) fetchRsvps(selectedEvent);
  }, [selectedEvent, fetchRsvps]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !eventDate) return;
    setCreating(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error: insertErr } = await supabase.from('events').insert({
      user_id: user.id,
      title: title.trim().substring(0, 100),
      description: description.trim().substring(0, 500),
      location: location.trim().substring(0, 200),
      event_date: eventDate,
      cover_emoji: coverEmoji,
      invite_code: generateInviteCode()
    });
    setCreating(false);
    if (insertErr) {
      setError('Could not create event. Please try again.');
      return;
    }
    setTitle('');
    setDescription('');
    setLocation('');
    setEventDate('');
    setCoverEmoji('🎉');
    setShowCreate(false);
    fetchEvents();
  };

  const handleDelete = async (eventId: string) => {
    if (!window.confirm('Are you sure you want to delete this event? This cannot be undone from your dashboard.')) return;
    await supabase.from('events').update({ deleted_at: new Date().toISOString() }).eq('id', eventId);
    setSelectedEvent(null);
    fetchEvents();
  };

  const statusCounts = (eventId: string) => {
    const list = rsvps[eventId] || [];
    return {
      going: list.filter((r) => r.status === 'going').length,
      maybe: list.filter((r) => r.status === 'maybe').length,
      cant_go: list.filter((r) => r.status === 'cant_go').length
    };
  };

  const selected = events.find((ev) => ev.id === selectedEvent);

  if (loading) {
    return (
      <main className="min-h-screen bg-paper flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" role="status" aria-label="Loading" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-paper px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <h1 className="font-serif text-3xl font-800 text-ink">Your events</h1>
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="min-h-[44px] font-mono px-6 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            {showCreate ? 'Cancel' : 'New event'}
          </button>
        </div>

        {error && <p className="font-mono text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3 mb-6" role="alert">{error}</p>}

        {showCreate && (
          <form onSubmit={handleCreate} className="bg-white rounded-2xl border border-ink/10 p-6 mb-8 space-y-4">
            <div>
              <label htmlFor="title" className="font-mono text-sm text-ink block mb-1">Event name</label>
              <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={100} required className="w-full min-h-[44px] px-4 py-2 font-mono text-ink bg-paper border border-ink/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Birthday Bash" />
            </div>
            <div>
              <label htmlFor="desc" className="font-mono text-sm text-ink block mb-1">Description</label>
              <textarea id="desc" value={description} onChange={(e) => setDescription(e.target.value)} maxLength={500} rows={3} className="w-full px-4 py-2 font-mono text-ink bg-paper border border-ink/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Tell your guests what to expect" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="location" className="font-mono text-sm text-ink block mb-1">Location</label>
                <input id="location" type="text" value={location} onChange={(e) => setLocation(e.target.value)} maxLength={200} className="w-full min-h-[44px] px-4 py-2 font-mono text-ink bg-paper border border-ink/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="123 Party St" />
              </div>
              <div>
                <label htmlFor="date" className="font-mono text-sm text-ink block mb-1">Date &amp; time</label>
                <input id="date" type="datetime-local" value={eventDate} onChange={(e) => setEventDate(e.target.value)} required className="w-full min-h-[44px] px-4 py-2 font-mono text-ink bg-paper border border-ink/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
            </div>
            <div>
              <span className="font-mono text-sm text-ink block mb-2">Cover emoji</span>
              <div className="flex flex-wrap gap-2">
                {EMOJIS.map((em) => (
                  <button key={em} type="button" onClick={() => setCoverEmoji(em)} className={`min-w-[44px] min-h-[44px] text-2xl rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${coverEmoji === em ? 'border-primary bg-primary/10' : 'border-ink/10 bg-white'}`}>
                    {em}
                  </button>
                ))}
              </div>
            </div>
            <button type="submit" disabled={creating} className="min-h-[44px] font-mono px-8 py-3 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
              {creating ? 'Creating…' : 'Create event'}
            </button>
          </form>
        )}

        {!showCreate && events.length === 0 && (
          <div className="text-center py-20">
            <p className="text-6xl mb-4">🎈</p>
            <h2 className="font-serif text-2xl font-600 text-ink mb-2">No events yet</h2>
            <p className="font-mono text-[#6b6862] mb-6">Create your first event and start inviting guests.</p>
            <button onClick={() => setShowCreate(true)} className="min-h-[44px] font-mono px-8 py-3 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
              Create your first event
            </button>
          </div>
        )}

        {!showCreate && events.length > 0 && !selected && (
          <div className="grid sm:grid-cols-2 gap-4">
            {events.map((ev) => (
              <button key={ev.id} onClick={() => setSelectedEvent(ev.id)} className="text-left bg-white rounded-2xl border border-ink/10 p-6 hover:border-primary/40 transition-colors focus:outline-none focus:ring-2 focus:ring-primary">
                <span className="text-4xl block mb-3">{ev.cover_emoji}</span>
                <h3 className="font-serif text-xl font-600 text-ink mb-1">{ev.title}</h3>
                <p className="font-mono text-sm text-[#6b6862]">
                  {new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(ev.event_date))}
                </p>
                {ev.location && <p className="font-mono text-sm text-[#6b6862] mt-1">{ev.location}</p>}
              </button>
            ))}
          </div>
        )}

        {selected && (
          <div>
            <button onClick={() => setSelectedEvent(null)} className="min-h-[44px] font-mono text-sm text-primary-dark mb-4 underline focus:outline-none focus:ring-2 focus:ring-primary">
              ← Back to all events
            </button>
            <div className="bg-white rounded-2xl border border-ink/10 p-6 mb-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-5xl block mb-3">{selected.cover_emoji}</span>
                  <h2 className="font-serif text-2xl font-600 text-ink mb-1">{selected.title}</h2>
                  <p className="font-mono text-sm text-[#6b6862] mb-1">
                    {new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'short' }).format(new Date(selected.event_date))}
                  </p>
                  {selected.location && <p className="font-mono text-sm text-[#6b6862]">{selected.location}</p>}
                  {selected.description && <p className="font-mono text-sm text-ink/80 mt-3">{selected.description}</p>}
                </div>
                <button onClick={() => handleDelete(selected.id)} className="min-h-[44px] min-w-[44px] font-mono text-sm text-red-600 border border-red-200 rounded-lg px-3 py-2 hover:bg-red-50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400">
                  Delete
                </button>
              </div>
              <div className="mt-4 p-4 bg-paper rounded-lg">
                <p className="font-mono text-sm text-ink mb-1">Invite link</p>
                <p className="font-mono text-sm text-primary-dark break-all">
                  {window.location.origin}/invite/{selected.invite_code}
                </p>
              </div>
            </div>

            <div className="flex gap-4 mb-4">
              {(['going', 'maybe', 'cant_go'] as const).map((s) => (
                <div key={s} className="bg-white rounded-xl border border-ink/10 px-4 py-3 flex-1 text-center">
                  <p className="font-serif text-2xl font-800 text-ink">{statusCounts(selected.id)[s]}</p>
                  <p className="font-mono text-xs text-[#6b6862]">{s === 'cant_go' ? "Can't go" : s.charAt(0).toUpperCase() + s.slice(1)}</p>
                </div>
              ))}
            </div>

            {(!rsvps[selected.id] || rsvps[selected.id].length === 0) && (
              <div className="text-center py-12 bg-white rounded-2xl border border-ink/10">
                <p className="text-4xl mb-3">📭</p>
                <p className="font-mono text-[#6b6862]">No RSVPs yet. Share your invite link to get started.</p>
              </div>
            )}

            {rsvps[selected.id] && rsvps[selected.id].length > 0 && (
              <div className="bg-white rounded-2xl border border-ink/10 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-ink/10">
                        <th className="font-mono text-xs text-[#6b6862] text-left px-4 py-3">Guest</th>
                        <th className="font-mono text-xs text-[#6b6862] text-left px-4 py-3">Status</th>
                        <th className="font-mono text-xs text-[#6b6862] text-left px-4 py-3">Note</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rsvps[selected.id].map((r) => (
                        <tr key={r.id} className="border-b border-ink/5 last:border-0">
                          <td className="font-mono text-sm text-ink px-4 py-3">
                            <span className="block">{r.guest_name}</span>
                            <span className="text-xs text-[#6b6862]">{r.guest_email}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`font-mono text-xs px-2 py-1 rounded-full ${r.status === 'going' ? 'bg-green-100 text-green-800' : r.status === 'maybe' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                              {r.status === 'cant_go' ? "Can't go" : r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                            </span>
                          </td>
                          <td className="font-mono text-sm text-[#6b6862] px-4 py-3">{r.note || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}