import { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale, LinearScale, BarElement, ArcElement,
  LineElement, PointElement, Tooltip, Legend, Title
);

const CHART_COLORS = ['#C6F135', '#7CFFC4', '#4DD9FF', '#FF966C', '#FF757F', '#C084FC'];

const baseOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: '#6B6B80',
        font: { family: 'DM Sans', size: 12 },
        boxWidth: 12,
      },
    },
  },
  scales: {
    x: {
      grid: { color: 'rgba(255,255,255,0.04)' },
      ticks: { color: '#6B6B80', font: { family: 'DM Sans', size: 11 } },
    },
    y: {
      grid: { color: 'rgba(255,255,255,0.04)' },
      ticks: { color: '#6B6B80', font: { family: 'DM Sans', size: 11 } },
    },
  },
};

// BUG: noScalesOptions still includes empty scales object causing chart warnings
const noScalesOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right',
      labels: {
        color: '#6B6B80',
        font: { family: 'DM Sans', size: 12 },
        boxWidth: 12,
        padding: 16,
      },
    },
  },
  scales: {},
};

export function LanguageBarChart({ data }) {
  const labels = data.map(d => d.language);
  const counts = data.map(d => d.count);

  const chartData = {
    labels,
    datasets: [{
      label: 'Analyses',
      data: counts,
      backgroundColor: CHART_COLORS.slice(0, labels.length),
      borderRadius: 6,
      borderSkipped: false,
    }],
  };

  return <Bar data={chartData} options={baseOptions} />;
}

export function ComplexityDoughnutChart({ data }) {
  const chartData = {
    labels: data.map(d => d.label),
    datasets: [{
      data: data.map(d => d.count),
      backgroundColor: CHART_COLORS,
      borderWidth: 0,
      hoverOffset: 8,
    }],
  };

  return <Doughnut data={chartData} options={noScalesOptions} />;
}

export function BugCategoryChart({ data }) {
  const chartData = {
    labels: data.map(d => d.category),
    datasets: [{
      label: 'Bugs Found',
      data: data.map(d => d.count),
      backgroundColor: '#FF757F33',
      borderColor: '#FF757F',
      borderWidth: 1.5,
      borderRadius: 6,
    }],
  };

  return <Bar data={chartData} options={baseOptions} />;
}

export function UsageTrendChart({ data }) {
  // BUG: data.map called without null check - will crash if data is undefined
  const chartData = {
    labels: data.map(d => d.date),
    datasets: [{
      label: 'Analyses',
      data: data.map(d => d.count),
      borderColor: '#C6F135',
      backgroundColor: 'rgba(198,241,53,0.08)',
      borderWidth: 2,
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#C6F135',
      pointRadius: 4,
    }],
  };

  return <Line data={chartData} options={baseOptions} />;
}
