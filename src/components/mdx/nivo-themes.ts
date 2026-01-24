// Dark theme for all Nivo charts
export const darkTheme = {
  background: 'transparent',
  text: {
    fontSize: 12,
    fill: '#cbd5e1',
    outlineWidth: 0,
    outlineColor: 'transparent',
  },
  axis: {
    domain: {
      line: {
        stroke: '#475569',
        strokeWidth: 1,
      },
    },
    legend: {
      text: {
        fontSize: 12,
        fill: '#e2e8f0',
        outlineWidth: 0,
        outlineColor: 'transparent',
      },
    },
    ticks: {
      line: {
        stroke: '#475569',
        strokeWidth: 1,
      },
      text: {
        fontSize: 11,
        fill: '#94a3b8',
        outlineWidth: 0,
        outlineColor: 'transparent',
      },
    },
  },
  grid: {
    line: {
      stroke: '#334155',
      strokeWidth: 1,
    },
  },
  legends: {
    title: {
      text: {
        fontSize: 12,
        fill: '#e2e8f0',
        outlineWidth: 0,
        outlineColor: 'transparent',
      },
    },
    text: {
      fontSize: 11,
      fill: '#cbd5e1',
      outlineWidth: 0,
      outlineColor: 'transparent',
    },
    ticks: {
      line: {},
      text: {
        fontSize: 10,
        fill: '#94a3b8',
        outlineWidth: 0,
        outlineColor: 'transparent',
      },
    },
  },
  annotations: {
    text: {
      fontSize: 13,
      fill: '#e2e8f0',
      outlineWidth: 2,
      outlineColor: '#1e293b',
      outlineOpacity: 1,
    },
    link: {
      stroke: '#64748b',
      strokeWidth: 1,
      outlineWidth: 2,
      outlineColor: '#1e293b',
      outlineOpacity: 1,
    },
    outline: {
      stroke: '#64748b',
      strokeWidth: 2,
      outlineWidth: 2,
      outlineColor: '#1e293b',
      outlineOpacity: 1,
    },
    symbol: {
      fill: '#8b5cf6',
      outlineWidth: 2,
      outlineColor: '#1e293b',
      outlineOpacity: 1,
    },
  },
  tooltip: {
    wrapper: {},
    container: {
      background: '#1e293b',
      color: '#e2e8f0',
      fontSize: 12,
      borderRadius: '8px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
      padding: '8px 12px',
    },
    basic: {},
    chip: {},
    table: {},
    tableCell: {},
    tableCellValue: {},
  },
}

// Space-themed color schemes
export const colorSchemes = {
  // Default cosmic palette
  cosmic: ['#06b6d4', '#8b5cf6', '#f59e0b', '#22c55e', '#ef4444', '#ec4899', '#3b82f6', '#14b8a6'],
  // Nebula colors
  nebula: ['#a855f7', '#ec4899', '#f43f5e', '#fb923c', '#facc15', '#a3e635', '#22d3ee', '#818cf8'],
  // Deep space
  deepspace: ['#1e3a8a', '#3730a3', '#5b21b6', '#7c3aed', '#a78bfa', '#c4b5fd', '#ddd6fe', '#ede9fe'],
  // Solar system
  solar: ['#fcd34d', '#f97316', '#dc2626', '#991b1b', '#78350f', '#365314', '#164e63', '#1e3a8a'],
  // Aurora
  aurora: ['#22d3ee', '#06b6d4', '#0891b2', '#0e7490', '#155e75', '#164e63', '#134e4a', '#115e59'],
  // Stellar
  stellar: ['#fef3c7', '#fde68a', '#fcd34d', '#fbbf24', '#f59e0b', '#d97706', '#b45309', '#92400e'],
}
