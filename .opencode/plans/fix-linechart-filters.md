# Fix LineChart Filters — One Unified Set

## Goal
Show ONE set of toggle buttons (all 9 statuses) at all times, regardless of Status Type dropdown selection. Backend checks all three columns when statuses are provided.

---

## 1. LineChart — unified toggle buttons

**File:** `frontend/src/components/dashboard/lineChart.jsx`

Changes:
- Remove `STATUS_FILTERS_BY_TYPE` (no longer needed)
- Keep `STATUS_DEFS` (single source of truth for all 9)
- Keep `DEFAULT_STATUSES_BY_TYPE` — still used for initial selected defaults when switching types
- Derive toggle buttons from all STATUS_DEFS:

```js
const statusFilters = Object.values(STATUS_DEFS);
```

(defaults still change per type, but buttons are always the same)

Full updated constants section:
```js
const STATUS_DEFS = {
  Normal: { label: 'Normal', value: 'Normal', color: '#10b981' },
  Underweight: { label: 'UW', value: 'Underweight', color: '#f59e0b' },
  'Severe Underweight': { label: 'SUW', value: 'Severe Underweight', color: '#ef4444' },
  Stunted: { label: 'ST', value: 'Stunted', color: '#f97316' },
  'Severe Stunted': { label: 'SST', value: 'Severe Stunted', color: '#dc2626' },
  Wasted: { label: 'MW', value: 'Wasted', color: '#eab308' },
  'Severely Wasted': { label: 'SW', value: 'Severely Wasted', color: '#b91c1c' },
  Overweight: { label: 'Ow', value: 'Overweight', color: '#3b82f6' },
  Obese: { label: 'OB', value: 'Obese', color: '#8b5cf6' },
};

const DEFAULT_STATUSES_BY_TYPE = {
  wfa: ['Normal', 'Underweight', 'Overweight', 'Obese'],
  hfa: ['Normal', 'Stunted'],
  wfhl: ['Normal', 'Wasted', 'Overweight', 'Obese'],
};
```

Component line change:
```js
const statusFilters = Object.values(STATUS_DEFS);
```

---

## 2. Backend — check all columns when statuses given

**File:** `backend/src/service/nutritionAssessment.service.js`

When `statuses` param is provided, check ALL three columns (`wfa_status`, `hfa_status`, `wfhl_status`) so any toggled status can match. The `statusType` is ignored for the line chart query (kept for other uses).

```js
const statusFieldMap = { wfa: 'wfa_status', hfa: 'hfa_status', wfhl: 'wfhl_status' };
const targetFields = Object.values(statusFieldMap);
```

This removes the `statusType`-based column filtering — the API will now look across all columns for the requested statuses.

---

## 3. Update plan file and exit plan mode

Once user confirms, exit plan mode and apply all 3 changes.
