import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import BarGraph from '../components/dashboard/barGraph';

vi.mock('../../services/api', () => ({
  api: {
    analytics: {
      barGraph: () => Promise.resolve({
        data: {
          categories: ['Brgy. A', 'Brgy. B'],
          series: [
            { name: 'Normal', data: [3, 5], color: '#10b981' },
            { name: 'Stunted', data: [1, 2], color: '#f59e0b' },
            { name: 'Obese', data: [0, 1], color: '#ef4444' }
          ]
        }
      })
    }
  }
}));

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

  it('should have tooltip configurations to display data on hover', async () => {
    render(<BarGraph />);
    
    const barGraph = await screen.findByTestId('mock-bar-graph');
    const options = JSON.parse(barGraph.getAttribute('data-options'));
    
    expect(options.plugins.tooltip.enabled).toBe(true);
  });

  it('should display a level of 0 in the bar graph when there are no health issues', async () => {
    render(<BarGraph />);
    
    const barGraph = await screen.findByTestId('mock-bar-graph');
    const options = JSON.parse(barGraph.getAttribute('data-options'));
    
    expect(options.scales.y.beginAtZero).toBe(true);
  });

  it('should filter specific classifications in the bar graph when selected', async () => {
    const user = userEvent.setup();
    render(<BarGraph />);
    
    const normalBtn = screen.getByText('Normal');
    await user.click(normalBtn);
    
    await waitFor(() => {
      const barGraph = screen.getByTestId('mock-bar-graph');
      const datasets = JSON.parse(barGraph.getAttribute('data-datasets'));
      const activeLabels = datasets.map(d => d.label);
      
      expect(activeLabels).not.toContain('Normal');
    });
  });

  it('should only output the selected classifications in the bar graph', async () => {
    const user = userEvent.setup();
    render(<BarGraph />);
    
    const stuntedBtn = screen.getByText('Stunted');
    const obeseBtn = screen.getByText('Obese');
    
    if (stuntedBtn.className.includes('bg-emerald')) await user.click(stuntedBtn);
    if (!obeseBtn.className.includes('bg-emerald')) await user.click(obeseBtn);
    
    await waitFor(() => {
      const barGraph = screen.getByTestId('mock-bar-graph');
      const datasets = JSON.parse(barGraph.getAttribute('data-datasets'));
      const activeLabels = datasets.map(d => d.label);
      
      const onlySelected = activeLabels.every(l => l === 'Normal' || l === 'Obese');
      expect(onlySelected).toBe(true);
    });
  });
});