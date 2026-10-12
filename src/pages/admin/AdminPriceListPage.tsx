import { useState, useEffect } from 'react';
import { getPricingPlans, updatePricingPlan, createPricingPlan, deletePricingPlan } from '../../services/pricing.service';
import { ApiError } from '../../services/httpClient';
import { PricingGroup } from '../../types/content';
import type { PricingPlan } from '../../types/content';

const GROUPS: { key: PricingGroup; heading: string }[] = [
  { key: PricingGroup.DistroBasic, heading: 'Distribution' },
  { key: PricingGroup.DistroBundle, heading: 'Distribution + Promotion' },
  { key: PricingGroup.Studio, heading: 'Studio' },
  { key: PricingGroup.Akiib, heading: 'Akiib Studio' },
];

interface NewPlanDraft {
  label: string;
  price: string;
  features: string;
  featured: boolean;
}

const BLANK_DRAFT: NewPlanDraft = { label: '', price: '', features: '', featured: false };

export default function AdminPriceListPage() {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLabelInput, setEditLabelInput] = useState('');
  const [editPriceInput, setEditPriceInput] = useState('');
  const [editFeaturesInput, setEditFeaturesInput] = useState('');
  const [editFeaturedInput, setEditFeaturedInput] = useState(false);
  const [addingGroup, setAddingGroup] = useState<PricingGroup | null>(null);
  const [draft, setDraft] = useState<NewPlanDraft>(BLANK_DRAFT);
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
    setAddingGroup(null);
    setEditingId(plan.id);
    setEditLabelInput(plan.label);
    setEditPriceInput(String(plan.price));
    setEditFeaturesInput(plan.features.join('\n'));
    setEditFeaturedInput(plan.featured);
  }

  function cancelEdit() {
    setEditingId(null);
  }

  async function saveEdit(id: string) {
    const label = editLabelInput.trim();
    const parsed = parseFloat(editPriceInput);
    if (label === '' || isNaN(parsed) || parsed <= 0) return;
    const features = editFeaturesInput.split('\n').map((f) => f.trim()).filter((f) => f !== '');
    try {
      await updatePricingPlan(id, { label, price: parsed, features, featured: editFeaturedInput });
      setEditingId(null);
      await refresh();
    } catch (err) {
      setError(describeError(err, 'Could not save this plan. Please try again.'));
    }
  }

  async function handleDelete(plan: PricingPlan) {
    if (!window.confirm(`Delete "${plan.label}"? This removes it from the live site immediately and cannot be undone.`)) return;
    try {
      await deletePricingPlan(plan.id);
      await refresh();
    } catch (err) {
      setError(describeError(err, 'Could not delete this plan. Please try again.'));
    }
  }

  function startAdd(groupKey: PricingGroup) {
    setEditingId(null);
    setAddingGroup(groupKey);
    setDraft(BLANK_DRAFT);
  }

  function cancelAdd() {
    setAddingGroup(null);
  }

  async function saveAdd(groupKey: PricingGroup) {
    const label = draft.label.trim();
    const parsed = parseFloat(draft.price);
    if (label === '' || isNaN(parsed) || parsed <= 0) return;
    const features = draft.features.split('\n').map((f) => f.trim()).filter((f) => f !== '');
    try {
      await createPricingPlan({ label, price: parsed, features, groupKey, featured: draft.featured });
      setAddingGroup(null);
      await refresh();
    } catch (err) {
      setError(describeError(err, 'Could not add this plan. Please try again.'));
    }
  }

  return (
    <div className="flex flex-col gap-5 max-w-300">

      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-normal text-ink">Price List</h1>
        <p className="text-sm text-muted mt-1">Add, edit, or delete plans for each pricing section. Visitors see the price converted to their own currency using the current exchange rate.</p>
      </div>

      {error && <div className="text-xs text-red-400 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-lg">{error}</div>}

      {GROUPS.map((group) => {
        const groupPlans = plans.filter((p) => p.groupKey === group.key).sort((a, b) => a.sortOrder - b.sortOrder);
        const isAdding = addingGroup === group.key;

        return (
          <div key={group.key} className="dash-panel p-0!">
            <div className="flex items-center justify-between px-5 pt-4 pb-2">
              <h2 className="text-sm font-semibold text-ink">{group.heading}</h2>
              {!isAdding && (
                <button className="dash-action-btn dash-action-btn--approve" onClick={() => startAdd(group.key)}>+ Add Plan</button>
              )}
            </div>
            <div className="overflow-x-auto">
              <table className="dash-table dash-table--hover">
                <thead>
                  <tr>
                    <th>Plan</th>
                    <th>Price (USD)</th>
                    <th>What's Included</th>
                    <th>Featured</th>
                    <th>Last Updated</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {groupPlans.map((plan) => (
                    <tr key={plan.id}>
                      {editingId === plan.id ? (
                        <>
                          <td className="align-top">
                            <input
                              className="dash-input w-40"
                              value={editLabelInput}
                              onChange={(e) => setEditLabelInput(e.target.value)}
                              autoFocus
                            />
                          </td>
                          <td className="align-top">
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              className="dash-input w-32"
                              value={editPriceInput}
                              onChange={(e) => setEditPriceInput(e.target.value)}
                            />
                          </td>
                          <td className="align-top">
                            <textarea
                              className="dash-input dash-textarea w-64"
                              placeholder="One item per line"
                              value={editFeaturesInput}
                              onChange={(e) => setEditFeaturesInput(e.target.value)}
                            />
                          </td>
                          <td className="align-top">
                            <input
                              type="checkbox"
                              checked={editFeaturedInput}
                              onChange={(e) => setEditFeaturedInput(e.target.checked)}
                              className="w-4 h-4 accent-gold cursor-pointer"
                            />
                          </td>
                          <td className="text-muted align-top">—</td>
                          <td className="align-top">
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
                          <td className="text-muted text-sm">{plan.features.length} item{plan.features.length === 1 ? '' : 's'}</td>
                          <td className="text-muted text-sm">{plan.featured ? 'Most Popular' : '—'}</td>
                          <td className="text-muted text-sm">{plan.updatedAt}</td>
                          <td>
                            <div className="flex gap-2">
                              <button className="dash-action-btn" onClick={() => startEdit(plan)}>Edit</button>
                              <button className="dash-action-btn dash-action-btn--reject" onClick={() => void handleDelete(plan)}>Delete</button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                  {isAdding && (
                    <tr>
                      <td className="align-top">
                        <input
                          className="dash-input w-40"
                          placeholder="e.g. Silver"
                          value={draft.label}
                          onChange={(e) => setDraft((d) => ({ ...d, label: e.target.value }))}
                          autoFocus
                        />
                      </td>
                      <td className="align-top">
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          className="dash-input w-32"
                          placeholder="0.00"
                          value={draft.price}
                          onChange={(e) => setDraft((d) => ({ ...d, price: e.target.value }))}
                        />
                      </td>
                      <td className="align-top">
                        <textarea
                          className="dash-input dash-textarea w-64"
                          placeholder="One item per line"
                          value={draft.features}
                          onChange={(e) => setDraft((d) => ({ ...d, features: e.target.value }))}
                        />
                      </td>
                      <td className="align-top">
                        <input
                          type="checkbox"
                          checked={draft.featured}
                          onChange={(e) => setDraft((d) => ({ ...d, featured: e.target.checked }))}
                          className="w-4 h-4 accent-gold cursor-pointer"
                        />
                      </td>
                      <td className="text-muted align-top">—</td>
                      <td className="align-top">
                        <div className="flex gap-2">
                          <button className="dash-action-btn" onClick={cancelAdd}>Cancel</button>
                          <button className="dash-action-btn dash-action-btn--approve" onClick={() => void saveAdd(group.key)}>Add</button>
                        </div>
                      </td>
                    </tr>
                  )}
                  {groupPlans.length === 0 && !isAdding && (
                    <tr>
                      <td colSpan={6} className="text-muted text-sm text-center py-4">No plans in this section yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
}
