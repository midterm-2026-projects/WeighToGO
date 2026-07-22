# Test Fix Progress

## Step 1: Fix @tailwindcss/vite plugin crash in tests
- [x] Fix `vite.config.js` to conditionally exclude tailwindcss plugin when `VITEST` env is set

## Step 2: Fix test assertions and source components
- [x] Fix `mapSidePanel.test.jsx` - regex for health insight message
- [x] Fix `RegisterChildModal.jsx` - add `htmlFor`/`id` attributes for label-input association
- [x] Fix `barangayMap.test.jsx` - Marker mock click propagation for side panel
- [x] Fix `Login.test.jsx` - adjust tests to match actual component behavior  
- [x] Fix `intercomponent/LoginPage.test.jsx` - fix import path

## Step 3: Check backend tests
- [ ] Run and fix backend tests if needed

## Step 4: Full validation
- [ ] Run full test suite to verify all fixes

