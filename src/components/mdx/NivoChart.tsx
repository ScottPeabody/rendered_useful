import { useState, useRef, useEffect } from 'react'

// Bar charts
import { ResponsiveBar } from '@nivo/bar'
// Line charts
import { ResponsiveLine } from '@nivo/line'
// Pie charts
import { ResponsivePie } from '@nivo/pie'
// Radar charts
import { ResponsiveRadar } from '@nivo/radar'
// Scatter plots
import { ResponsiveScatterPlot } from '@nivo/scatterplot'
// Heatmaps
import { ResponsiveHeatMap } from '@nivo/heatmap'
// Stream charts
import { ResponsiveStream } from '@nivo/stream'
// Bump charts
import { ResponsiveBump, ResponsiveAreaBump } from '@nivo/bump'
// Chord diagrams
import { ResponsiveChord } from '@nivo/chord'
// Funnel charts
import { ResponsiveFunnel } from '@nivo/funnel'
// Tree maps
import { ResponsiveTreeMap } from '@nivo/treemap'
// Sunburst charts
import { ResponsiveSunburst } from '@nivo/sunburst'
// Sankey diagrams
import { ResponsiveSankey } from '@nivo/sankey'
// Network graphs
import { ResponsiveNetwork } from '@nivo/network'
// Swarm plots
import { ResponsiveSwarmPlot } from '@nivo/swarmplot'
// Waffle charts
import { ResponsiveWaffle } from '@nivo/waffle'
// Calendar heatmaps
import { ResponsiveCalendar } from '@nivo/calendar'
// Marimekko charts
import { ResponsiveMarimekko } from '@nivo/marimekko'
// Radial bar charts
import { ResponsiveRadialBar } from '@nivo/radial-bar'
// Circle packing
import { ResponsiveCirclePacking } from '@nivo/circle-packing'
// Bullet charts
import { ResponsiveBullet } from '@nivo/bullet'

// Import theme and colors from separate file
import { darkTheme, colorSchemes } from './nivo-themes'

// Chart type mapping
const CHART_COMPONENTS = {
  bar: ResponsiveBar,
  line: ResponsiveLine,
  pie: ResponsivePie,
  radar: ResponsiveRadar,
  scatterplot: ResponsiveScatterPlot,
  heatmap: ResponsiveHeatMap,
  stream: ResponsiveStream,
  bump: ResponsiveBump,
  areabump: ResponsiveAreaBump,
  chord: ResponsiveChord,
  funnel: ResponsiveFunnel,
  treemap: ResponsiveTreeMap,
  sunburst: ResponsiveSunburst,
  sankey: ResponsiveSankey,
  network: ResponsiveNetwork,
  swarmplot: ResponsiveSwarmPlot,
  waffle: ResponsiveWaffle,
  calendar: ResponsiveCalendar,
  marimekko: ResponsiveMarimekko,
  radialbar: ResponsiveRadialBar,
  circlepacking: ResponsiveCirclePacking,
  bullet: ResponsiveBullet,
} as const

export type NivoChartType = keyof typeof CHART_COMPONENTS

interface NivoChartProps {
  type: NivoChartType
  data?: unknown
  title?: string
  height?: number
  colors?: keyof typeof colorSchemes | string[]
  // All other props passed to the chart
  [key: string]: unknown
}

export function NivoChart({
  type,
  data,
  title,
  height = 400,
  colors = 'cosmic',
  ...chartProps
}: NivoChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Resolve color scheme
  const colorArray = Array.isArray(colors) ? colors : colorSchemes[colors] || colorSchemes.cosmic

  // Get the chart component
  const ChartComponent = CHART_COMPONENTS[type]

  // Charts that use continuous color scales instead of categorical
  const continuousColorCharts = ['heatmap', 'calendar']
  const usesContinuousColors = continuousColorCharts.includes(type)

  // Build color props based on chart type
  const colorProps = usesContinuousColors
    ? {} // Let these charts use their default color scales, or pass via chartProps
    : { colors: colorArray }

  // Handle fullscreen toggle
  const toggleFullscreen = () => setIsFullscreen(!isFullscreen)

  // Handle escape key - must be called unconditionally (before any returns)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isFullscreen])

  // Error state for unknown chart type
  if (!ChartComponent) {
    return (
      <div className="my-6 rounded-xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
        <div className="text-red-400">
          Unknown chart type: <code>{type}</code>
          <br />
          <span className="text-sm text-slate-400">
            Available types: {Object.keys(CHART_COMPONENTS).join(', ')}
          </span>
        </div>
      </div>
    )
  }

  const containerClasses = isFullscreen
    ? 'fixed inset-0 z-50 bg-slate-900 p-6 overflow-auto'
    : 'my-6 rounded-xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden'

  const chartHeight = isFullscreen ? 'calc(100vh - 120px)' : height

  return (
    <div ref={containerRef} className={containerClasses}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
        <div className="flex items-center gap-3">
          {title && <span className="text-white font-semibold">{title}</span>}
          <span className="text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
            nivo/{type}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleFullscreen}
            className="text-xs px-2 py-1 rounded bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors"
            title={isFullscreen ? 'Exit Fullscreen (Esc)' : 'Fullscreen'}
          >
            {isFullscreen ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Chart Container */}
      <div className="p-4" style={{ height: chartHeight }}>
        {/* @ts-expect-error - Dynamic chart component with varying prop types */}
        <ChartComponent
          {...(data !== undefined ? { data } : {})}
          theme={darkTheme}
          {...colorProps}
          animate={true}
          motionConfig="gentle"
          {...chartProps}
        />
      </div>
    </div>
  )
}
