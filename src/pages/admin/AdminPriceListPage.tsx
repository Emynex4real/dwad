import { useState, useEffect } from 'react';
import { getPricingPlans, updatePricingPlan } from '../../services/pricing.service';
import { ApiError } from '../../services/httpClient';
import type { PricingPlan } from '../../types/content';

const GROUPS: { heading: string; prefix: string }[] = [
  { heading: 'Distribution', prefix: 'distro-' },
  { heading: 'Studio', prefix: 'studio-' },
  { heading: 'Akiib Studio', prefix: 'akiib-' },
];

export default function AdminPriceListPage() {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPriceInput, setEditPriceInput] = useState('');
  const [error, setError] = useState('');

  function describeError(err: unknown, fallback: string): string {
    return err instanceof ApiError ? err.message : fallback;
  }

  async function refresh() {
    try {
      setPlans(await getPricingPlans());
      setError('');
    } catch (err) {
      setError(describeError(err, 'Could not load the price list. Please try again.'));
    }
  }

  useEffect(() => {
    getPricingPlans()
      .then((data) => { setPlans(data); setError(''); })
      .catch((err: unknown) => setError(describeError(err, 'Could not load the price list. Please try again.')));
  }, []);

  function startEdit(plan: PricingPlan) {
    setEditingId(plan.id);
    setEditPriceInput(String(plan.price));
  }

  function cancelEdit() {
    setEditingId(null);
  }

  async function saveEdit(id: string) {
    const parsed = parseFloat(editPriceInput);
    if (isNaN(parsed) || parsed <= 0) return;
    try {
      await updatePricingPlan(id, parsed);
      setEditingId(null);
      await refresh();
    } catch (err) {
      setError(describeError(err, 'Could not save this price. Please try again.'));
    }
  }

  return (
    <div className="flex flex-col gap-5 max-w-300">

      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-normal text-ink">Price List</h1>
        <p className="text-sm text-muted mt-1">Set the USD price for each plan. Visitors see it converted to their own currency using the current exchange rate.</p>
      </div>

      {error && <div className="text-xs text-red-400 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-lg">{error}</div>}

      {GROUPS.map((group) => {
        const groupPlans = plans.filter((p) => p.id.startsWith(group.prefix));
        if (groupPlans.length === 0) return null;

        return (
          <div key={group.prefix} className="dash-panel p-0!">
            <h2 className="text-sm font-semibold text-ink px-5 pt-4 pb-2">{group.heading}</h2>
            <div className="overflow-x-auto">
              <table className="dash-table dash-table--hover">
                <thead>
                  <tr>
                    <th>Plan</th>
                    <th>Price (USD)</th>
                    <th>Last Updated</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {groupPlans.map((plan) => (
                    <tr key={plan.id}>
                      {editingId === plan.id ? (
                        <>
                          <td className="font-medium">{plan.label}</td>
                          <td>
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              className="dash-input w-32"
                              value={editPriceInput}
                              onChange={(e) => setEditPriceInput(e.target.value)}
                              autoFocus
                            />
                          </td>
                          <td className="text-muted">—</td>
                          <td>
                            <div className="flex gap-2">
                              <button className="dash-action-btn" onClick={cancelEdit}>Cancel</button>
                              <button className="dash-action-btn dash-action-btn--approve" onClick={() => void saveEdit(plan.id)}>Save</button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="font-medium">{plan.label}</td>
                          <td>${plan.price.toFixed(2)}</td>
                          <td className="text-muted text-sm">{plan.updatedAt}</td>
                          <td>
                            <button className="dash-action-btn" onClick={() => startEdit(plan)}>Edit</button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}

      {plans.length === 0 && !error && <p className="dash-empty">No pricing plans found.</p>}
    </div>
  );
}
