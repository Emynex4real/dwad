import { useState, type FormEvent } from 'react';
import { createArtist } from '../../services/artists.service';
import { ApiError } from '../../services/httpClient';
import { PLAN_DEFINITIONS } from '../../services/subscriptions.service';
import type { ArtistProfile, UploadAccess, SubscriptionPlan, SubscriptionStatus } from '../../types/dashboard';

interface AddArtistFormProps {
  onCreated: (artist: ArtistProfile) => void;
  onCancel: () => void;
}

const oneYearFromToday = new Date(Date.now() + 365 * 86_400_000).toISOString().split('T')[0];

export default function AddArtistForm({ onCreated, onCancel }: AddArtistFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [genre, setGenre] = useState('');
  const [country, setCountry] = useState('');
  const [bio, setBio] = useState('');
  const [uploadAccess, setUploadAccess] = useState<UploadAccess>('granted');
  const [spotify, setSpotify] = useState('');
  const [instagram, setInstagram] = useState('');

  const [plan, setPlan] = useState<SubscriptionPlan>('plan-a');
  const [status, setStatus] = useState<SubscriptionStatus>('active');
  const [price, setPrice] = useState(String(PLAN_DEFINITIONS[0].price));
  const [expiryDate, setExpiryDate] = useState(oneYearFromToday);
  const [autoRenew, setAutoRenew] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  function handlePlanChange(next: SubscriptionPlan) {
    setPlan(next);
    const def = PLAN_DEFINITIONS.find((p) => p.id === next);
    if (def) setPrice(String(def.price));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Name, email, and password are required.');
      return;
    }

    setSubmitting(true);
    try {
      const artist = await createArtist({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        genre: genre.trim(),
        country: country.trim(),
        bio: bio.trim(),
        uploadAccess,
        password,
        socialLinks: {
          ...(spotify.trim() ? { spotify: spotify.trim() } : {}),
          ...(instagram.trim() ? { instagram: instagram.trim() } : {}),
        },
        subscription: {
          plan,
          status,
          startDate: new Date().toISOString().split('T')[0],
          expiryDate,
          autoRenew,
          price: parseFloat(price) || 0,
        },
      });
      onCreated(artist);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not create artist. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="dash-panel">
      <h2 className="text-sm font-semibold text-ink mb-4">Add Artist</h2>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-ink-2">Name</label>
            <input className="dash-input" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-ink-2">Email</label>
            <input type="email" className="dash-input" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-ink-2">Password</label>
            <input type="password" className="dash-input" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-ink-2">Phone</label>
            <input className="dash-input" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-ink-2">Genre</label>
            <input className="dash-input" value={genre} onChange={(e) => setGenre(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-ink-2">Country</label>
            <input className="dash-input" value={country} onChange={(e) => setCountry(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-ink-2">Spotify URL</label>
            <input className="dash-input" value={spotify} onChange={(e) => setSpotify(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-ink-2">Instagram URL</label>
            <input className="dash-input" value={instagram} onChange={(e) => setInstagram(e.target.value)} />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-ink-2">Bio</label>
          <textarea className="dash-input dash-textarea" rows={3} value={bio} onChange={(e) => setBio(e.target.value)} />
        </div>

        <div className="h-px bg-line" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-ink-2">Plan</label>
            <select className="dash-input select-field" value={plan} onChange={(e) => handlePlanChange(e.target.value as SubscriptionPlan)}>
              {PLAN_DEFINITIONS.map((p) => (
                <option key={p.id} value={p.id}>{p.name} — ${p.price}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-ink-2">Status</label>
            <select className="dash-input select-field" value={status} onChange={(e) => setStatus(e.target.value as SubscriptionStatus)}>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-ink-2">Price (USD)</label>
            <input type="number" className="dash-input" value={price} onChange={(e) => setPrice(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-ink-2">Expiry Date</label>
            <input type="date" className="dash-input" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-ink-2">Upload Access</label>
            <select className="dash-input select-field" value={uploadAccess} onChange={(e) => setUploadAccess(e.target.value as UploadAccess)}>
              <option value="granted">Granted</option>
              <option value="locked">Locked</option>
            </select>
          </div>
          <label className="flex items-center gap-3 cursor-pointer text-sm text-ink-2 self-end pb-2">
            <input type="checkbox" checked={autoRenew} onChange={(e) => setAutoRenew(e.target.checked)} className="accent-gold" />
            Auto Renew
          </label>
        </div>

        {error && <div className="text-xs text-red-400 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-lg">{error}</div>}

        <div className="flex justify-end gap-3 pt-2 border-t border-line">
          <button type="button" className="dash-btn dash-btn--ghost" onClick={onCancel}>Cancel</button>
          <button type="submit" className="dash-btn dash-btn--gold" disabled={submitting}>
            {submitting ? 'Creating…' : 'Create Artist'}
          </button>
        </div>
      </form>
    </div>
  );
}
