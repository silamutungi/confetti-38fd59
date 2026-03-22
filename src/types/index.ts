export type RsvpStatus = 'going' | 'maybe' | 'cant_go';

export interface Event {
  id: string;
  user_id: string;
  title: string;
  description: string;
  location: string;
  event_date: string;
  cover_emoji: string;
  invite_code: string;
  created_at: string;
  deleted_at: string | null;
}

export interface Rsvp {
  id: string;
  event_id: string;
  guest_name: string;
  guest_email: string;
  status: RsvpStatus;
  note: string;
  created_at: string;
  deleted_at: string | null;
}

export interface UserProfile {
  id: string;
  user_id: string;
  display_name: string;
  created_at: string;
}