# Objective 2: Web-Based Admin Dashboard for the Municipal Health Office

## Project Overview
This objective establishes the centralized monitoring system for tracking child growth metrics and medical supplement interventions at the barangay level. It encompasses building the secure administrator authentication portal, multi-tier dynamic tracking grids for the Barangay Masterlist, child individual profile overlays, and localized matrix distribution logs for Operation Timbang (OPT). This forms the core operational framework of the portal to ensure accurate monitoring and clear report dissemination

---

## Project Metadata
* **Objective Number:** 2
* **Project Title:** Web-Based Admin Dashboard for the Municipal Health Office
* **Owners / Developers:**
    * Raniel Carl Mercado Lopez

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
=======
# Web-Based Health Monitoring for Barangay Nutrition Scholars (BNS)

## 📋 Project Overview
* **Objective #:** 1
* **Owner:** Cielo A. Tadas
* **Description:** This objective establishes the centralized health record lifecycle and automated analytics pipeline for tracking early childhood development at the barangay level. It encompasses building the persistent primary layout shell, multi-variable filtering headers for the Masterlist, dynamic tabbed management modals for individual child profiles, and backend database aggregation logic for monthly nutritional dashboards.

---

## 🗓️ 5-Week Implementation Roadmap

### ⏳ Week 1: Foundation & Navigation
#### Day 1: Build Side Navigation and Child Masterlist Page
* **Sub-Tasks:**
  * Build Main Side Navigation UI.
  * Implement Masterlist Header Controls.
* **Deliverables:**
  * A functional, styled side navigation bar rendering correctly on the main layout.
  * Interactive search, filter dropdowns, and a primary action button ready for state management.
* **PR Acceptance Criteria:**
  * The navigation component renders correctly and ensures seamless routing between Kids Masterlist, Monthly Report, and Logout views.
  * The header includes a functional search bar, Purok dropdown, Checkup Status dropdown, and an "Add New Child" button ready for state management.

---

### ⏳ Week 2: User Interface & Component Building
#### Day 1: Registration Module UI
* **Sub-Tasks:**
  * Create "Register New Child" Modal.
  * Develop Registration Form Interface.
* **Deliverables:**
  * A toggleable modal component that opens and closes smoothly over the masterlist.
  * A complete frontend registration form capable of capturing and holding local user input.
* **PR Acceptance Criteria:**
  * The modal toggle functionality works smoothly over the masterlist when triggered by the header button.
  * The internal form successfully captures Full Name, Gender, Birthdate, Parents/Guardian, and Purok inputs upon the save action.

#### Day 2: Masterlist Rendering and Management Interface
* **Sub-Tasks:**
  * Construct Masterlist Data Table.
  * Build "Manage" Profile Modal.
* **Deliverables:**
  * A fully formatted UI table displaying static or mocked child records.
  * A multi-tab modal component that successfully switches views between profile details, assessment inputs, and past data tables.
* **PR Acceptance Criteria:**
  * The table correctly maps and displays columns for Name, Parent, Gender, Age, Purok, Status, and Action using static/mock data.
  * The modal dynamically switches views between Personal Info, Monthly Assessment, and Checkup History tabs without layout breakage.

---

### ⏳ Week 3: Dashboard Layout & Core API
#### Day 1: Monthly Barangay Report Dashboard
* **Sub-Tasks:**
  * Develop Summary Metric Cards.
  * Create Masterlist Report Data Table.
* **Deliverables:**
  * Four styled top-level summary cards ready to display aggregated data.
  * A detailed, wide-format report table component structured to display the month's specific assessment data.
* **PR Acceptance Criteria:**
  * Four top-level cards are styled and positioned to display Total Registered, Normal, Malnourished/Stunted, and Obese metrics.
  * The wide-format table successfully structures columns specifically tailored for expanded nutritional metrics (WFA, HFA, WFL/H).

#### Day 2: API Controllers & Data Persistence
* **Sub-Tasks:**
  * Implement Child Registration API Endpoint.
  * Connect Masterlist to Data Fetch API.
* **Deliverables:**
  * Successful database write operations confirmed when submitting a new child profile.
  * The Masterlist table dynamically rendering the actual records retrieved from your backend API.
* **PR Acceptance Criteria:**
  * The Express route controller receives the form payload, validates data against the schema, and successfully persists the document in the database.
  * The frontend table successfully fetches and iterates over dynamic JSON data arrays retrieved from the backend API.

---

### ⏳ Week 4: Search, Filters & Data Flow
#### Day 1: Querying & Filtering Logic
* **Sub-Tasks:**
  * Build Search Query Logic.
  * Implement Dropdown Filter API Logic.
* **Deliverables:**
  * A functional search bar that accurately narrows down the displayed Masterlist data in real-time.
  * Dropdown filters that successfully query the database and return strictly matching datasets to the UI.
* **PR Acceptance Criteria:**
  * Backend database queries accurately filter and return records matching the child name search parameter.
  * Database controllers successfully apply filtering logic for Purok and Checkup Status, returning the strictly matching datasets to the UI.

#### Day 2: Assessment Data Flow & History
* **Sub-Tasks:**
  * Create Monthly Assessment Update Controller.
  * Implement Checkup History Fetch Logic.
* **Deliverables:**
  * Successful backend updates of height, weight, and nutritional status for individual records.
  * The history tab dynamically populating with the correct historical data rows pulled from the database.
* **PR Acceptance Criteria:**
  * The controller successfully processes assessment form submissions and updates the specific child's document with new height, weight, and nutritional status.
  * The "Checkup History" tab successfully queries and displays an array of past assessment sub-documents strictly tied to the selected child.

---

### ⏳ Week 5: Aggregation & E2E Testing
#### Day 1: Data Aggregation & Report Generation
* **Sub-Tasks:**
  * Build Database Aggregation Pipelines.
  * Connect Monthly Report Table Endpoint.
* **Deliverables:**
  * The dashboard summary cards actively displaying accurate, dynamically calculated totals.
  * The Monthly Report table accurately listing all assessed children and their derived statuses directly from your backend logic.
* **PR Acceptance Criteria:**
  * Database aggregation pipelines accurately calculate Total Registered, Normal, Stunted, and Obese counts for the requested month.
  * The detailed Monthly Report table correctly fetches and displays the fully aggregated dataset for the selected month via API request.

#### Day 2: Masterlist E2E Testing
* **Sub-Tasks:**
  * Automate Registration Flow E2E Test.
  * Automate Assessment Flow E2E Test.
* **Deliverables:**
  * A passing test confirmation for the child profile creation journey.
  * A passing test confirmation for the monthly assessment submission journey.
* **PR Acceptance Criteria:**
  * The test suite successfully executes clicking "Add New Child", filling the form, submitting, and verifying the persisted record appears on the Masterlist.
  * The test suite verified the flow of searching a child, opening the manage modal, and successfully submitting a new weight/height entry.

---

### ⏳ Week 6: Edge Cases & Validation
#### Day 1: Data Cascading & Edge Cases
* **Sub-Tasks:**
  * Test Monthly Report Data Aggregation Cascading.
  * Validate Edge Cases and Error Handling.
* **Deliverables:**
  * Verified testing proof that data flows correctly from an individual update to the aggregated monthly report.
  * Confirmed stability with robust error handling and validation messaging working properly across the application.
* **PR Acceptance Criteria:**
  * Automated tests confirmed that a newly submitted assessment in the Masterlist correctly cascaded to update both the summary cards and table in the Monthly Report view.
  * The test suite passed validations for boundary constraints, including submitting empty forms, searching for missing records, or filtering with zero results.

