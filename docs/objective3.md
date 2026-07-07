```markdown

# Owner : Ron Andrew I. Arizala
# Objective 3: Business Analytics and Integrate Feature 

# Health Trends Dashboard Development Plan

## Week 1

### Day 1: Build Health Trends KPI Cards and Filter Controls

#### Task Description
Develop KPI card components and dropdown filter controls for the Health Trends Dashboard.

#### Sub-Tasks
- Create KPI card components for:
  - Healthy Status
  - Deficit Status
  - Excess Status
- Implement dropdown filter controls for:
  - Barangay
  - Age
  - Nutritional Indicator

#### Deliverables
- KPI card components for Healthy, Deficit, and Excess statuses.
- Dropdown filter controls for Barangay, Age, and Nutritional Indicator.

#### Acceptance Criteria
- should have dropdown filter controls for Barangay, Age, and Nutritional Indicator
- should calls onChange handler when a new option is selected
- should render correctly when BOTH title and value are provided
- should display a fallback of "0" when ONLY the title is provided
- should display a warning text and color when ONLY the value is provided
- should display fallbacks for both when NEITHER title nor value is provided


---

## Week 2

### Day 1: Develop Line Chart and Bar Graph for Health Trends Dashboard

#### Task Description
Create visualizations to monitor nutritional trends and compare health issues across barangays.

#### Sub-Tasks
- Initialize a line chart to visualize monthly nutritional cases.
- Construct a bar graph to compare health issues across barangays.
- Implement dropdown filters for:
  - Age Group
  - Status

#### Deliverables
- Line chart visualizing monthly nutritional cases.
- Bar graph comparing health issues across barangays .

#### Acceptance Criteria
- should have tooltip configurations to display barangay name and total issues on hover
- should display a level of 0 in the bar graph when there are no health issues
- should filter specific cases in the bar graph when selected
- should only output the selected filters in the bar graph
- should filter health cases in the line chart depending on the selected filter
- should function correctly based on the actual number of cases
- should display no lines in the chart when no filters are selected
- should only display the exact filters selected in the line chart
- should display the line at level 0 when there are no cases
---

### Day 2: Integrate Interactive Barangay Map

#### Task Description
Develop an interactive map for visualizing barangay nutritional risk levels.

#### Sub-Tasks
-  map viewport centered on the target municipality.
- Implement dynamic color-coded map markers based on nutritional risk levels:
  - Red (High Risk)
  - Yellow (Moderate Risk)
  - Green (Low Risk)

#### Deliverables
- map viewport centered on the target municipality.
- Dynamic color-coded map markers.

#### Acceptance Criteria
- The map displays the target municipality correctly.
- Map markers dynamically change color according to nutritional risk levels.

---

## Week 3

### Day 1: Develop API Endpoint for KPI Metrics and Filter Controls

#### Task Description
Create backend services for KPI metrics and filter options.

#### Sub-Tasks
- Create a backend route and controller to fetch aggregated counts for:
  - Healthy
  - Deficit
  - Excess
- Write database queries to:
  - Calculate KPI totals dynamically
  - Retrieve available dropdown filter options

#### Deliverables
- Backend route and controller for KPI metrics.
- Database query for KPI totals and filter options.

#### Acceptance Criteria
- The API returns a successful status code and aggregated KPI counts.
- Database queries accurately calculate KPI totals.
- Dropdown filter options are returned correctly.

### Day 2: Build Insight Side Panel UI

#### Task Description
Create a side panel that displays detailed health insights when a barangay marker is selected.

#### Sub-Tasks
- Create a slide-out side panel that opens when a barangay map marker is clicked.
- Design layout sections for:
  - Health data summaries
  - Action indicators

#### Deliverables
- Slide-out side panel UI.
- Structured layout zones for health insights.

#### Acceptance Criteria
- Clicking a barangay marker opens the side panel.
- The side panel displays health summaries and action indicators.

---



---

## Week 4

### Day 1: Develop API Endpoint for Nutritional Trends Data Aggregation

#### Task Description
Create backend services to provide historical nutritional trend data.

#### Sub-Tasks
- Create a backend route and controller to fetch historical nutritional records.
- Write database queries to:
  - Aggregate health statuses
  - Group records by month

#### Deliverables
- Backend route and controller for historical nutritional records.
- Database query for monthly aggregation.

#### Acceptance Criteria
- The API returns a successful status code and historical records.
- Health status data is correctly grouped by month.

---

### Day 2: Develop API Endpoint for Barangay Health Comparison Data

#### Task Description
Provide barangay-based health comparison data for dashboard visualizations.

#### Sub-Tasks
- Create a backend route and controller to fetch health records grouped by barangay.
- Write database queries to:
  - Retrieve nutritional case records
  - Calculate total cases per barangay

#### Deliverables
- Backend route and controller for barangay comparison data.
- Database query for barangay case aggregation.

#### Acceptance Criteria
- The API returns a successful status code and barangay-grouped records.
- Total nutritional cases per barangay are calculated accurately.
- Hovering over the graph displays the correct total case count.

---

## Week 5

### Day 1: Develop API Endpoint for Barangay Map Coordinate and Status Data

#### Task Description
Provide map coordinates and nutritional risk data for each barangay.

#### Sub-Tasks
- Create a backend route and controller to fetch:
  - Barangay geographical coordinates
  - Aggregated nutritional status
- Write database queries to:
  - Calculate overall nutritional risk levels
  - Determine marker colors

#### Deliverables
- Backend route and controller for map data.
- Database query for nutritional risk calculations.

#### Acceptance Criteria
- The API returns a successful status code with barangay coordinates and status data.
- Nutritional risk levels are calculated accurately.
- Marker colors correspond to the correct risk levels.

---

### Day 2: Develop API Endpoint for Health Insights

#### Task Description
Provide detailed health statistics for a selected barangay.

#### Sub-Tasks
- Create a backend route and controller that accepts a barangay identifier.
- Retrieve detailed health statistics from the database.

#### Deliverables
- Backend route and controller for barangay health insights.

#### Acceptance Criteria
- The API returns a successful status code and nutritional status data for the selected barangay.
- If no records exist, the API returns an empty dataset without errors.

---

## Week 6

### Day 1: Develop API Endpoint for Intervention Planning

#### Task Description
Generate automated intervention recommendations based on health statistics.

#### Sub-Tasks
- Implement server-side logic to:
  - Analyze health statistics
  - Generate intervention recommendations

#### Deliverables
- Server-side recommendation engine.

#### Acceptance Criteria
- The system accurately analyzes health statistics.
- Appropriate intervention recommendations are generated.
- Results are returned in a valid JSON structure.
```
