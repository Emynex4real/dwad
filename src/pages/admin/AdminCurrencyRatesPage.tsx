import { useState, useEffect } from 'react';
import { getAdminCurrencyRates, updateCurrencyRate, clearCurrencyRate } from '../../services/pricing.service';
import { ApiError } from '../../services/httpClient';
import type { CurrencyRate } from '../../types/content';

function formatCountries(countries: string[]): string {
  if (countries.length <= 3) return countries.join(', ');
  return `${countries.slice(0, 3).join(', ')} +${countries.length - 3} more`;
}

export default function AdminCurrencyRatesPage() {
  const [rates, setRates] = useState<CurrencyRate[]>([]);
  const [search, setSearch] = useState('');
  const [editingCode, setEditingCode] = useState<string | null>(null);
  const [editRateInput, setEditRateInput] = useState('');
  const [error, setError] = useState('');

  function describeError(err: unknown, fallback: string): string {
    return err instanceof ApiError ? err.message : fallback;
  }

  async function refresh() {
    try {
      setRates(await getAdminCurrencyRates());
      setError('');
    } catch (err) {
      setError(describeError(err, 'Could not load currency rates. Please try again.'));
    }
  }

  useEffect(() => {
    getAdminCurrencyRates()
      .then((data) => { setRates(data); setError(''); })
      .catch((err: unknown) => setError(describeError(err, 'Could not load currency rates. Please try again.')));
  }, []);

  function startEdit(r: CurrencyRate) {
    setEditingCode(r.currencyCode);
    setEditRateInput(r.rate != null ? String(r.rate) : '');
  }

  function cancelEdit() {
    setEditingCode(null);
  }

  async function saveEdit(code: string) {
    const parsed = parseFloat(editRateInput);
    if (isNaN(parsed) || parsed <= 0) return;
    try {
      await updateCurrencyRate(code, parsed);
      setEditingCode(null);
      await refresh();
    } catch (err) {
      setError(describeError(err, `Could not save the rate for ${code}. Please try again.`));
    }
  }

  async function handleClear(code: string) {
    if (!window.confirm(`Clear the rate for ${code}? Visitors in ${code} will see the original base-currency price until a new rate is set.`)) return;
    try {
      await clearCurrencyRate(code);
      await refresh();
    } catch (err) {
      setError(describeError(err, `Could not clear the rate for ${code}. Please try again.`));
    }
  }

  const filtered = rates.filter((r) => {
    const term = search.trim().toLowerCase();
    if (term === '') return true;
    return r.currencyCode.toLowerCase().includes(term) || r.countries.some((c) => c.toLowerCase().includes(term));
  });

  return (
    <div className="flex flex-col gap-5 max-w-300">

      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-normal text-ink">Currency Rates</h1>
        <p className="text-sm text-muted mt-1">Set what 1 USD is worth in each currency. Visitors from that currency's countries see marketing prices converted using this rate; unset currencies show the original price unchanged.</p>
      </div>

      {error && <div className="text-xs text-red-400 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-lg">{error}</div>}

      {/* Search */}
      <input
        className="dash-input max-w-96"
        placeholder="Search by currency or country…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Mobile card list */}
      <div className="sm:hidden flex flex-col gap-3">
        {filtered.map((r) => (
          <div key={r.currencyCode} className="dash-panel flex flex-col gap-3 py-3 px-4">
            {editingCode === r.currencyCode ? (
              <div className="flex flex-col gap-2">
                <div className="text-sm font-medium text-ink">{r.currencyCode}</div>
                <input
                  type="number"
                  step="0.000001"
                  min="0"
                  className="dash-input"
                  value={editRateInput}
                  onChange={(e) => setEditRateInput(e.target.value)}
                  placeholder="e.g. 1450.5"
                  autoFocus
                />
                <div className="flex justify-end gap-2">
                  <button className="dash-btn dash-btn--ghost text-xs py-1.5 px-3" onClick={cancelEdit}>Cancel</button>
                  <button className="dash-btn dash-btn--gold text-xs py-1.5 px-3" onClick={() => void saveEdit(r.currencyCode)}>Save</button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-ink truncate">{r.currencyCode}</div>
                  <div className="text-xs text-muted truncate">{formatCountries(r.countries)}</div>
                  <div className="text-xs mt-1">
                    {r.rate != null ? <span className="text-gold">1 USD = {r.rate}</span> : <span className="text-muted">Not configured</span>}
                  </div>
                </div>
                <button className="dash-action-btn shrink-0" onClick={() => startEdit(r)}>Edit</button>
                {r.rate != null && (
                  <button className="dash-action-btn dash-action-btn--reject shrink-0" onClick={() => void handleClear(r.currencyCode)}>Clear</button>
                )}
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && <p className="text-sm text-muted py-4">No currencies match your search.</p>}
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block dash-panel p-0!">
        <div className="overflow-x-auto">
          <table className="dash-table dash-table--hover">
            <thead>
              <tr>
                <th>Currency</th>
                <th>Countries</th>
                <th>Rate (1 USD =)</th>
                <th>Last Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.currencyCode}>
                  {editingCode === r.currencyCode ? (
                    <>
                      <td className="font-medium">{r.currencyCode}</td>
                      <td className="text-muted">{formatCountries(r.countries)}</td>
                      <td>
                        <input
                          type="number"
                          step="0.000001"
                          min="0"
                          className="dash-input w-40"
                          value={editRateInput}
                          onChange={(e) => setEditRateInput(e.target.value)}
                          placeholder="e.g. 1450.5"
                          autoFocus
                        />
                      </td>
                      <td className="text-muted">—</td>
                      <td>
                        <div className="flex gap-2">
                          <button className="dash-action-btn" onClick={cancelEdit}>Cancel</button>
                          <button className="dash-action-btn dash-action-btn--approve" onClick={() => void saveEdit(r.currencyCode)}>Save</button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="font-medium">{r.currencyCode}</td>
                      <td className="text-muted">{formatCountries(r.countries)}</td>
                      <td>
                        {r.rate != null ? r.rate : <span className="text-muted text-sm">Not configured</span>}
                      </td>
                      <td className="text-muted text-sm">{r.updatedAt ?? '—'}</td>
                      <td>
                        <div className="flex gap-2">
                          <button className="dash-action-btn" onClick={() => startEdit(r)}>Edit</button>
                          {r.rate != null && (
                            <button className="dash-action-btn dash-action-btn--reject" onClick={() => void handleClear(r.currencyCode)}>Clear</button>
                          )}
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <p className="dash-empty px-5">No currencies match your search.</p>}
      </div>

    </div>
  );
}
