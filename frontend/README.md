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