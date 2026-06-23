# Objective 2: Web-Based Admin Dashboard for the Municipal Health Office

## Project Overview
This objective establishes the centralized monitoring system for tracking child growth metrics and medical supplement interventions at the barangay level. It encompasses building the secure administrator authentication portal, multi-tier dynamic tracking grids for the Barangay Masterlist, child individual profile overlays, and localized matrix distribution logs for Operation Timbang (OPT). This forms the core operational framework of the portal to ensure accurate monitoring and clear report dissemination.

---

## Project Metadata
* **Objective Number:** 2
* **Project Title:** Web-Based Admin Dashboard for the Municipal Health Office
* **Owners / Developers:**
    * Raniel Carl M. Lopez

---

## 📅 5-Week Implementation Roadmap

Each working week is structured around **exactly 2 working days** dedicated to specific milestones, deliverables, and automated/manual testing criteria.

### Week 1: Core Layout & Shell
#### Day 1: Build Log In Page and Side Navigation
* **Sub-Tasks:**
    * Develop the static Login UI.
    * Build the persistent Sidenav component.
* **Deliverables:**
    * Rendered responsive static login interface component.
    * Rendered sidebar navigation layout skeleton.
* **Instructor Acceptance Criteria (PR Check):**
    * The login UI provides an Administrator role dropdown, email field, password field, and an "Access Dashboard" button.
    * The sidenav displays active routing links strictly for the Masterlist and Health Reports tabs.

---

### Week 2: Authentication Backend & Masterlist Frontend
#### Day 1: Develop Login Backend
* **Sub-Tasks:**
    * Create the Authentication API endpoint.
    * Implement secure Session Management.
* **Deliverables:**
    * Functional authentication server-side API route.
    * Configured session handling module for logged-in users.
* **Instructor Acceptance Criteria (PR Check):**
    * The API successfully parses submitted credentials and validates them against administrator database records.
    * The system issues and verifies secure session tokens to restrict access to protected dashboard routes.

#### Day 2: Build Masterlist Page Frontend
* **Sub-Tasks:**
    * Build the Masterlist Data Table and Profile Modal.
    * Create the Masterlist Dropdown Filters.
* **Deliverables:**
    * Rendered Masterlist data table paired with a functional profile modal.
    * Interactive dropdown filter UI components populated with categories.
* **Instructor Acceptance Criteria (PR Check):**
    * The table renders child demographics, and clicking the "Profile" button triggers a popup modal showing the nutritional breakdown.
    * The UI provides fully interactive dropdowns for "All Barangays", "All Ages", and "Overall Status".

---

### Week 3: Health Reports Frontend & Database Integration
#### Day 1: Build Health Reports Frontend
* **Sub-Tasks:**
    * Build the Consolidated OPT Summary Matrix.
    * Implement the Report Filters and Print Action.
* **Deliverables:**
    * Rendered summary matrix table capable of displaying aggregated rows.
    * Rendered selection dropdown for targeted reporting and a print action button.
* **Instructor Acceptance Criteria (PR Check):**
    * The matrix table accurately categorizes column groupings for Weight for Age (WFA), Height for Age (HFA), and Weight for L/H (WFL/H).
    * The report interface provides a functional Barangay dropdown filter and a specifically styled "Print Report" action button.

#### Day 2: Masterlist Database Integration
* **Sub-Tasks:**
    * Execute Schema Migration and Data Seeding.
    * Integrate Backend Filter Queries.
* **Deliverables:**
    * Populated database tables containing the masterlist child records.
    * Operational dynamic API endpoint responding to combined filtering parameters.
* **Instructor Acceptance Criteria (PR Check):**
    * The database successfully stores and retrieves raw child records, including dimensions and calculated nutritional statuses.
    * The API dynamically filters and returns specific data subsets when the frontend Barangay, Age, or Status dropdowns update.

---

### Week 4: Analytics Integration & Security Auditing
#### Day 1: Filter Queries Integration
* **Sub-Tasks:**
    * Develop Data Aggregation Queries.
    * Connect Aggregated Data to the Frontend Matrix.
* **Deliverables:**
    * Executable backend statistical aggregation scripts.
    * Live-connected Health Reports matrix rendering real-time backend data.
* **Instructor Acceptance Criteria (PR Check):**
    * Database queries accurately calculate and group statistical totals (Normal, Underweight, Stunted, Obese) by location.
    * The frontend OPT matrix successfully fetches and displays real-time aggregated data from the backend database.

#### Day 2: Health Reports Database Integration
* **Sub-Tasks:**
    * Test the Login Routing Flow.
    * Verify Protected Route Security.
* **Deliverables:**
    * Documented authentication flow integration test report.
    * Security validation log confirming unauthorized API calls failed.
* **Instructor Acceptance Criteria (PR Check):**
    * Providing valid database credentials successfully grants a token and redirects the user directly to the Masterlist view.
    * The system blocks attempts to access the Masterlist or Health Reports without a valid token and redirects the user to the landing page.

---

### Week 5: Component Interconnectivity Testing
#### Day 1: Component Integration Testing
* **Sub-Tasks:**
    * Integrate the Dynamic Profile Modal.
    * Test Data State Synchronization.
* **Deliverables:**
    * Integrated patient profile pop-up wired to dynamic backend queries.
    * Data synchronization test summary proving frontend tables reflected the latest database state.
* **Instructor Acceptance Criteria (PR Check):**
    * Clicking a specific child record triggers a database fetch that populates the modal with that specific patient's live data.
    * Simulated updates made directly to a child's database record instantly reflect in the frontend matrix tallies upon refresh.

#### Day 2: Authentication and Routing Testing
* **Sub-Tasks:**
    * Automate the User Auth Journey.
    * Automate Sidenav Component Routing.
* **Deliverables:**
    * Passing E2E automation script for the login-to-dashboard workflow.
    * Executed E2E test report verifying flawless page routing via the sidenav.
* **Instructor Acceptance Criteria (PR Check):**
    * The automated script successfully inputs credentials, clicks the submit button, bypasses the landing page, and loads the portal.
    * The automated script navigates smoothly between the Masterlist view and the Health Reports view using only the sidebar links.

---

### Week 6: Comprehensive End-to-End (E2E) Testing
#### Day 1: Masterlist and Health Report E2E
* **Sub-Tasks:**
    * Automate Masterlist Filtering and Modal Interactions.
    * Automate Health Reports Matrix Filtering.
* **Deliverables:**
    * Exhaustive E2E validation report for complex Masterlist frontend data filtering and patient modal interactions.
    * Validated E2E test log for Health Reports dynamic data rendering and geographic filtering accuracy.
* **Instructor Acceptance Criteria (PR Check):**
    * The script applies overlapping filters (e.g., specific Barangay + specific Age) on the Masterlist, verifies the resulting rows, and successfully opens the profile modal without errors.
    * The script selects a specific Barangay in the Health Reports and verifies accurate matrix numerical adjustments matching the filtered location.