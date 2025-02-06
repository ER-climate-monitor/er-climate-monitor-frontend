<template>
    <div id="map"></div>
</template>

<script setup lang="ts">
import type { SensorLocation } from '@/types/SensorLocation';
import leaflet from 'leaflet';
import { onMounted, onUnmounted, watch } from 'vue';
import type { PropType } from 'vue';
import { CategoryScale, LineController, LineElement, PointElement, LinearScale, Title, Chart } from 'chart.js';
import { io, Socket } from 'socket.io-client';
import { createSensorChart, formatShortDate } from '@/utils/mapUtils';
import type { Detection } from '@/types/SensorDetection';
import { fetchSensorDetections } from '@/apis/detectionApi';
import { useUserStore } from '@/stores/userStore';

Chart.register(CategoryScale, LineController, LineElement, PointElement, LinearScale, Title);
const { sensorType, locations } = defineProps({
    sensorType: {
        type: String,
        required: true,
    },
    locations: {
        type: Array as PropType<SensorLocation[]>,
        required: true,
    },
});

let map: leaflet.Map;
let socket: Socket | null = null;
const userStore = useUserStore();

onMounted(() => {
    map = leaflet.map('map').setView([44.5, 10.9], 8); // center position on Emilia-Romagna

    leaflet
        .tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        })
        .addTo(map);

    addMarkers(locations);

    fetch('/er.geojson')
        .then((res) => res.json())
        .then((data) => {
            leaflet
                .geoJSON(data, {
                    style: {
                        color: '#FF6347', // border color
                        weight: 3, // line thickness
                        opacity: 1,
                        fillColor: '#FF6347', // fill color
                        fillOpacity: 0.2, // fill opacity
                    },
                })
                .addTo(map);
        });

    socket = io('http://localhost:3000');
});

onUnmounted(() => {
    if (socket) {
        socket.disconnect();
    }
});

async function markerOnClick(sensorId: string, e: { latlng: leaflet.LatLngExpression }) {
    const token = userStore.token.value;
    socket?.emit('subscribe', sensorId);

    const detections = await fetchSensorDetections(sensorType, sensorId, token);

    if (!detections || detections.length === 0) {
        leaflet.popup().setLatLng(e.latlng).setContent('No detections available').openOn(map);
        return;
    }

    const labels = detections.map((d) => formatShortDate(d.timestamp));
    const values = detections.map((d) => d.value);

    const canvas = document.createElement('canvas');
    const popup = leaflet.popup().setLatLng(e.latlng).setContent(canvas).openOn(map);

    const chart = createSensorChart(canvas, labels, values);

    socket?.on('new-detection', (detection: Detection) => {
        detections.push(detection);

        chart.data.labels?.push(formatShortDate(detection.timestamp));
        chart.data.datasets.forEach((dataset) => {
            dataset.data.push(detection.value);

            if (dataset.data.length > 5) {
                dataset.data.shift();
            }
        });

        if (chart.data.labels && chart.data.labels.length > 5) {
            chart.data.labels.shift();
        }

        chart.update();
    });

    popup.on('remove', function () {
        unsubscribeSensor(sensorId);
    });
}

const unsubscribeSensor = (sensorId: string) => {
    if (socket) {
        socket.emit('unsubscribe', sensorId);
    }
};

const addMarkers = (locations: SensorLocation[]) => {
    locations.forEach((location) => {
        const lat = location.latitude / 100000;
        const lng = location.longitude / 100000;
        const marker = leaflet.marker([lat, lng]);
        marker.on('click', (e) => markerOnClick(location.sensorId, e));
        map.addLayer(marker);
    });
};

watch(
    () => locations,
    (newLocations) => {
        if (map) {
            map.eachLayer((layer) => {
                if (layer instanceof leaflet.Marker || layer instanceof leaflet.Popup) {
                    map.removeLayer(layer);
                }
            });

            addMarkers(newLocations);
        }
    },
    { deep: true },
);
</script>

<style scoped>
#map {
    width: 100vh;
    height: 80vh;
    border-radius: 16px;
    overflow: hidden;
}
</style>
