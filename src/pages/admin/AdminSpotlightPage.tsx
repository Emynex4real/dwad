import { useState, useEffect } from 'react';
import { API_BASE_URL, ApiError } from '../../services/httpClient';
import { getSpotlightContent, updateSpotlightSettings } from '../../services/spotlight.service';
import SpotlightItemsSection, { type SpotlightSectionConfig } from '../../components/admin/SpotlightItemsSection';
import type { SpotlightContent } from '../../types/content';

const SECTION_CONFIGS: SpotlightSectionConfig[] = [
  { section: 'roster', title: 'Our Roster', description: 'Shown at the top of the Spotlight page.', primaryLabel: 'Name', secondaryLabel: 'Role (e.g. Afro Soul · NG)', showImage: true, imageRequired: true },
  { section: 'topTalents', title: 'Top Talents', description: 'This month\'s featured talents.', primaryLabel: 'Name', secondaryLabel: 'Role', showImage: true, showExternalUrl: true },
  { section: 'topHits', title: 'Top Hits of the Month', description: 'Ranked list — use the arrows to reorder.', primaryLabel: 'Song Title', secondaryLabel: 'Artist', showImage: true, showExternalUrl: true },
  { section: 'videos', title: 'Hot New Videos', description: 'Embedded YouTube videos.', primaryLabel: 'Artist', secondaryLabel: 'Video Title', showImage: false, showVideoId: true },
  { section: 'topClassics', title: 'Top Classics of the Month', description: 'Ranked list — use the arrows to reorder.', primaryLabel: 'Song Title', secondaryLabel: 'Artist', showImage: true, showExternalUrl: true },
  { section: 'coverWall', title: 'Cover Art Wall', description: 'Grid of release covers at the bottom of the page.', primaryLabel: '', showImage: true, imageRequired: true },
];

interface SettingsFormState {
  artistOfMonthName: string;
  artistOfMonthGenre: string;
  artistOfMonthCountry: string;
  photo: File | null;
}

export default function AdminSpotlightPage() {
  const [content, setContent] = useState<SpotlightContent | null>(null);
  const [settingsForm, setSettingsForm] = useState<SettingsFormState | null>(null);
  const [savingSettings, setSavingSettings] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getSpotlightContent()
      .then((data) => {
        setContent(data);
        setSettingsForm({
          artistOfMonthName: data.settings.artistOfMonth.name,
          artistOfMonthGenre: data.settings.artistOfMonth.genre ?? '',
          artistOfMonthCountry: data.settings.artistOfMonth.country ?? '',
          photo: null,
        });
      })
      .catch((err: unknown) => setError(err instanceof ApiError ? err.message : 'Could not load Spotlight content.'));
  }, []);

  async function handleSaveSettings() {
    if (!settingsForm) return;
    setError('');
    setSavingSettings(true);
    try {
      const updated = await updateSpotlightSettings(
        {
          artistOfMonthName: settingsForm.artistOfMonthName.trim(),
          artistOfMonthGenre: settingsForm.artistOfMonthGenre.trim(),
          artistOfMonthCountry: settingsForm.artistOfMonthCountry.trim(),
        },
        settingsForm.photo,
      );
      setContent((prev) => (prev ? { ...prev, settings: updated } : prev));
      setSettingsForm((prev) => (prev ? { ...prev, photo: null } : prev));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not save these settings. Please try again.');
    } finally {
      setSavingSettings(false);
    }
  }

  if (!content || !settingsForm) {
    return (
      <div className="flex flex-col gap-5 max-w-300">
        <h1 className="font-serif text-2xl sm:text-3xl font-normal text-ink">Spotlight Page</h1>
        {error ? <p className="text-sm text-red-400">{error}</p> : <p className="text-sm text-muted">Loading…</p>}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 max-w-300">

      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-normal text-ink">Spotlight Page</h1>
        <p className="text-sm text-muted mt-1">Manage the content shown on the public Artist Spotlight page.</p>
      </div>

      {error && <div className="text-xs text-red-400 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-lg">{error}</div>}

      {/* Artist of the Month settings */}
      <div className="dash-panel flex flex-col gap-4">
        <h2 className="text-sm font-semibold text-ink">Artist of the Month</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-ink-2">Artist of the Month — Name</label>
            <input className="dash-input" value={settingsForm.artistOfMonthName} onChange={(e) => setSettingsForm({ ...settingsForm, artistOfMonthName: e.target.value })} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-ink-2">Artist of the Month — Photo</label>
            <input type="file" accept=".jpg,.jpeg,.png,.webp" className="dash-input" onChange={(e) => setSettingsForm({ ...settingsForm, photo: e.target.files?.[0] ?? null })} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-ink-2">Artist of the Month — Genre</label>
            <input className="dash-input" value={settingsForm.artistOfMonthGenre} onChange={(e) => setSettingsForm({ ...settingsForm, artistOfMonthGenre: e.target.value })} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-ink-2">Artist of the Month — Country</label>
            <input className="dash-input" value={settingsForm.artistOfMonthCountry} onChange={(e) => setSettingsForm({ ...settingsForm, artistOfMonthCountry: e.target.value })} />
          </div>
        </div>
        {content.settings.artistOfMonth.photoUrl && (
          <img src={`${API_BASE_URL}/storage/${content.settings.artistOfMonth.photoUrl}`} alt="" className="w-16 h-16 rounded-lg object-cover" />
        )}
        <div className="flex justify-end">
          <button className="dash-btn dash-btn--gold text-xs py-1.5 px-3" disabled={savingSettings} onClick={() => void handleSaveSettings()}>
            {savingSettings ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>

      {SECTION_CONFIGS.map((config) => (
        <SpotlightItemsSection key={config.section} config={config} initialItems={content.items[config.section]} />
      ))}

    </div>
  );
}
