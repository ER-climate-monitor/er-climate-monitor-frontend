/* eslint-disable @typescript-eslint/no-explicit-any */
import { shallowMount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import MapComponent from '@/components/Map/MapComponent.vue'
import leaflet from 'leaflet'
import { io } from 'socket.io-client'
import { config } from '@/config/config'

// Mock leaflet default export
vi.mock('leaflet', () => {
  class MarkerClass {
    on = vi.fn()
    addTo = vi.fn()
  }
  class PopupClass {
    setLatLng = vi.fn().mockReturnThis()
    setContent = vi.fn().mockReturnThis()
    openOn = vi.fn().mockReturnThis()
  }
  const mapInstance = {
    setView: vi.fn().mockReturnThis(),
    addLayer: vi.fn(),
    eachLayer: vi.fn(),
    removeLayer: vi.fn(),
  }
  const tileLayerInstance = { addTo: vi.fn() }
  const geoJsonLayer = { addTo: vi.fn() }

  const mocked = {
    map: vi.fn(() => mapInstance),
    tileLayer: vi.fn(() => tileLayerInstance),
    geoJSON: vi.fn(() => geoJsonLayer),
    marker: vi.fn(() => new MarkerClass()),
    popup: vi.fn(() => new PopupClass()),
    Marker: MarkerClass,
    Popup: PopupClass,
  }
  return { default: mocked }
})

// Mock socket.io-client
vi.mock('socket.io-client', () => ({
  io: vi.fn(() => ({ emit: vi.fn(), on: vi.fn(), disconnect: vi.fn() })),
}))

// Mock global.fetch for GeoJSON
global.fetch = vi.fn(() =>
  Promise.resolve({ json: () => Promise.resolve({ type: 'FeatureCollection', features: [] }) })
)

// Mock user store
vi.mock('@/stores/userStore', () => ({
  useUserStore: vi.fn(() => ({ token: { value: 'token' } })),
}))

// Mock detection API
vi.mock('@/apis/detectionApi', () => ({
  fetchSensorDetections: vi.fn(),
}))

describe('MapComponent.vue', () => {
  const locations = [
    { sensorId: 's1', latitude: 4450000, longitude: 1090000 },
    { sensorId: 's2', latitude: 4460000, longitude: 1080000 },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('initializes map, tileLayer and geoJSON on mount', async () => {
    shallowMount(MapComponent, {
      props: { sensorType: 'temp', locations },
    })

    const mod = (leaflet as any)
    const mapInstance = mod.map.mock.results[0].value

    // map initialization
    expect(mod.map).toHaveBeenCalledWith('map')
    expect(mapInstance.setView).toHaveBeenCalledWith([44.5, 10.9], 8)

    // tile layer
    expect(mod.tileLayer).toHaveBeenCalledWith(
      'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      expect.objectContaining({ maxZoom: 19 })
    )
    const tileLayerInstance = mod.tileLayer.mock.results[0].value
    expect(tileLayerInstance.addTo).toHaveBeenCalledWith(mapInstance)

    // geoJSON after fetch
    // wait for fetch and json promise chain
    await new Promise((r) => setTimeout(r, 0))
    await new Promise((r) => setTimeout(r, 0))
    expect(global.fetch).toHaveBeenCalledWith('/er.geojson')
    expect(mod.geoJSON).toHaveBeenCalledWith(expect.any(Object), expect.any(Object))
    const geoJsonInstance = mod.geoJSON.mock.results[0].value
    expect(geoJsonInstance.addTo).toHaveBeenCalledWith(mapInstance)
  })

  it('adds markers for each location', () => {
    shallowMount(MapComponent, {
      props: { sensorType: 'temp', locations },
    })
    const mod = (leaflet as any)
    const mapInstance = mod.map.mock.results[0].value
    const markerResults = mod.marker.mock.results

    expect(mod.marker).toHaveBeenCalledTimes(locations.length)
    locations.forEach((loc, idx) => {
      const [lat, lng] = [loc.latitude / 100000, loc.longitude / 100000]
      expect(mod.marker).toHaveBeenCalledWith([lat, lng])
      const markerInstance = markerResults[idx].value
      expect(mapInstance.addLayer).toHaveBeenCalledWith(markerInstance)
    })
  })

  it('updates markers when locations prop changes', async () => {
    const wrapper = shallowMount(MapComponent, {
      props: { sensorType: 'temp', locations },
    })
    const mod = (leaflet as any)
    const mapInstance = mod.map.mock.results[0].value
    const originalMarker = mod.marker.mock.results[0].value

    mapInstance.eachLayer.mockImplementation((cb: any) => cb(originalMarker))

    const newLocs = [{ sensorId: 's3', latitude: 4470000, longitude: 1070000 }]
    await wrapper.setProps({ locations: newLocs })
    await nextTick()

    expect(mapInstance.removeLayer).toHaveBeenCalledWith(originalMarker)

    expect(mod.marker).toHaveBeenCalledWith([newLocs[0].latitude / 100000, newLocs[0].longitude / 100000])
    const newMarker = mod.marker.mock.results.slice(-1)[0].value
    expect(mapInstance.addLayer).toHaveBeenCalledWith(newMarker)
  })

  it('connects to socket.io on mount and disconnects on unmount', () => {
    const wrapper = shallowMount(MapComponent, {
      props: { sensorType: 'temp', locations },
    })
    expect(io).toHaveBeenCalledWith(config.apiBaseUrl)

    const socket = (io as any).mock.results[0].value
    wrapper.unmount()
    expect(socket.disconnect).toHaveBeenCalled()
  })
})
