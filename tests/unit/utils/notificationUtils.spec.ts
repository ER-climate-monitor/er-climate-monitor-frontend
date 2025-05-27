import { describe, it, expect } from 'vitest'
import type { Topic } from '@/stores/notificationStore'
import { parseTopicAddress, fromTopicToTopicAddress } from '@/utils/notificationUtils'

describe('parseTopicAddress', () => {
  it('strips default prefix and parses “topic.#” into topic only', () => {
    const result = parseTopicAddress('notification.weather.#')
    expect(result).toEqual<Topic>({ topic: 'weather' })
  })

  it('parses wildcard query “*.Q” into query only', () => {
    const result = parseTopicAddress('notification.alerts.*.high')
    expect(result).toEqual<Topic>({ topic: 'alerts', query: 'high' })
  })

  it('parses sensor wildcard “sensor.#” into sensorName only', () => {
    const result = parseTopicAddress('notification.sensors.temperature.#')
    expect(result).toEqual<Topic>({ topic: 'sensors', sensorName: 'temperature' })
  })

  it('parses full address “sensor.query” into sensorName and query', () => {
    const result = parseTopicAddress('notification.devices.humidity.low')
    expect(result).toEqual<Topic>({
      topic: 'devices',
      sensorName: 'humidity',
      query: 'low',
    })
  })

  it('respects null prefix and does not strip anything', () => {
    const result = parseTopicAddress('foo.bar.baz', null)
    expect(result).toEqual<Topic>({
      topic: 'foo',
      sensorName: 'bar',
      query: 'baz',
    })
  })

  it('ignores non‐matching custom prefix and returns topic only', () => {
    const result = parseTopicAddress('notification.foo.*.x', 'notif')
    // "notif." doesn't match start of "notification.", so no strip, parts=4 => fallback
    expect(result).toEqual<Topic>({ topic: 'notification' })
  })
})

describe('fromTopicToTopicAddress', () => {
  it('formats topic only into “topic.#”', () => {
    const sub: Topic = { topic: 'weather' }
    expect(fromTopicToTopicAddress(sub)).toBe('weather.#')
  })

  it('formats topic+query into “topic.*.query”', () => {
    const sub: Topic = { topic: 'alerts', query: 'high' }
    expect(fromTopicToTopicAddress(sub)).toBe('alerts.*.high')
  })

  it('formats topic+sensorName into “topic.sensorName.#”', () => {
    const sub: Topic = { topic: 'sensors', sensorName: 'temperature' }
    expect(fromTopicToTopicAddress(sub)).toBe('sensors.temperature.#')
  })

  it('formats full subscription into “topic.sensorName.query”', () => {
    const sub: Topic = {
      topic: 'devices',
      sensorName: 'humidity',
      query: 'low',
    }
    expect(fromTopicToTopicAddress(sub)).toBe('devices.humidity.low')
  })

  it('round-trips parseTopicAddress and fromTopicToTopicAddress for various cases', () => {
    const addresses = [
      'notification.weather.#',
      'notification.alerts.*.high',
      'notification.sensors.temperature.#',
      'notification.devices.humidity.low',
    ]
    for (const addr of addresses) {
      const parsed = parseTopicAddress(addr)
      const rebuilt = fromTopicToTopicAddress(parsed)
      // all rebuilt addresses should start without the prefix
      const expected = addr.replace(/^notification\./, '')
      expect(rebuilt).toBe(expected)
    }
  })
})
