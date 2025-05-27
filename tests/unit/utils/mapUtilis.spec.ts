import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest'
import { Chart } from 'chart.js'
import { createSensorChart, formatShortDate } from '@/utils/mapUtils'

describe('createSensorChart', () => {
  let canvas: HTMLCanvasElement

  beforeAll(() => {
    // jsdom provides a minimal canvas element
    canvas = document.createElement('canvas')
    // stub getContext so Chart.js doesn't blow up
    canvas.getContext = () => ({ 
      // @ts-expect-error: minimal stub for CanvasRenderingContext2D methods
      fillRect: () => {},
      clearRect: () => {},
      getImageData: (_x: number, _y: number, w: number, h: number) => ({ data: new Array(w * h * 4) }),
      putImageData: () => {},
      createImageData: () => ([]),
      setTransform: () => {},
      drawImage: () => {},
      save: () => {},
      fillText: () => {},
      restore: () => {},
      beginPath: () => {},
      moveTo: () => {},
      lineTo: () => {},
      closePath: () => {},
      stroke: () => {},
      translate: () => {},
      scale: () => {},
      rotate: () => {},
      arc: () => {},
      fill: () => {},
      measureText: () => ({ width: 0 }),
      transform: () => {},
      rect: () => {},
      clip: () => {},
    })
  })

  it('returns a Chart instance with correct type and data', () => {
    const labels = ['2025-05-20', '2025-05-21']
    const values = [10, 20]
    const chart = createSensorChart('Test Sensor', canvas, labels, values)

    expect(chart).toBeInstanceOf(Chart)
    expect(chart.config.type).toBe('line')
    expect(chart.data.labels).toEqual(labels)
    expect(chart.data.datasets).toHaveLength(1)
    expect(chart.data.datasets[0].label).toBe('Test Sensor')
    expect(chart.data.datasets[0].data).toEqual(values)

    // @ts-expect-error: accessing scales on chart.options
    const xScale = chart.options.scales.x
    // @ts-expect-error: scales property not typed on ChartOptions type
    const yScale = chart.options.scales.y
    expect(xScale.title.display).toBe(true)
    expect(xScale.title.text).toBe('Timestamp')
    expect(yScale.title.display).toBe(true)
    expect(yScale.title.text).toBe('Value')
  })

  afterAll(() => {
    Chart.getChart(canvas)?.destroy()
  })
})

describe('formatShortDate', () => {
  it('formats a valid ISO date string into Italian short format', () => {
    const formatted = formatShortDate('2025-05-20T14:30:00')
    // should look like "20/5/2025, 14:30"
    expect(formatted).toMatch(/^\d{1,2}\/\d{1,2}\/\d{4}, \d{1,2}:\d{2}$/)
  })

  it('logs an error and returns current date when given an invalid string', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const result = formatShortDate('not-a-date')
    expect(spy).toHaveBeenCalledWith('Invalid date format:', 'not-a-date')
    expect(result).toMatch(/^\d{1,2}\/\d{1,2}\/\d{4}, \d{1,2}:\d{2}$/)
    spy.mockRestore()
  })
})
