import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import BarGraph from '../components/dashboard/barGraph';

vi.mock('react-chartjs-2', () => ({
  Bar: (props) => (
    <div 
      data-testid="mock-bar-graph" 
      data-datasets={JSON.stringify(props.data.datasets)}
      data-options={JSON.stringify(props.options)}
    />
  )
}));

describe('Bar Graph - Health Issues Across Barangays', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should have tooltip configurations to display barangay name and total issues on hover', () => {
    render(<BarGraph />);
    
    const barGraph = screen.getByTestId('mock-bar-graph');
    const options = JSON.parse(barGraph.getAttribute('data-options'));
    
    expect(options.plugins.tooltip.enabled).toBe(true);
  });

  it('should display a level of 0 in the bar graph when there are no health issues', () => {
    render(<BarGraph />);
    
    const barGraph = screen.getByTestId('mock-bar-graph');
    const options = JSON.parse(barGraph.getAttribute('data-options'));
    
    expect(options.scales.y.beginAtZero).toBe(true);
  });

  it('should filter specific cases in the bar graph when selected', async () => {
    const user = userEvent.setup();
    render(<BarGraph />);
    
    const measlesCheckbox = screen.getByLabelText('Measles');
    await user.click(measlesCheckbox);
    
    await waitFor(() => {
      const barGraph = screen.getByTestId('mock-bar-graph');
      const datasets = JSON.parse(barGraph.getAttribute('data-datasets'));
      const activeLabels = datasets.map(d => d.label);
      
      expect(activeLabels).toContain('Measles');
    });
  });

  it('should only output the selected filters in the bar graph', async () => {
    const user = userEvent.setup();
    render(<BarGraph />);
    
    const dengueCheckbox = screen.getByLabelText('Dengue');
    const measlesCheckbox = screen.getByLabelText('Measles');
    
    // Ensure exact state: Dengue OFF, Measles ON
    if (dengueCheckbox.checked) await user.click(dengueCheckbox);
    if (!measlesCheckbox.checked) await user.click(measlesCheckbox);
    
    await waitFor(() => {
      const barGraph = screen.getByTestId('mock-bar-graph');
      const datasets = JSON.parse(barGraph.getAttribute('data-datasets'));
      
      expect(datasets).toHaveLength(1);
      expect(datasets[0].label).toBe('Measles');
    });
  });
});