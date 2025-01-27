<template>
  <div id="map"></div>
</template>

<script setup lang="ts">
import { fetchSensorDetections } from '@/services/api';
import type { SensorLocation } from '@/types/SensorLocation';
import leaflet from 'leaflet';
import { onMounted, watch } from 'vue';
import type { PropType } from 'vue';
import {
  CategoryScale,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Chart,
} from 'chart.js';

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

onMounted(() => {
  map = leaflet.map('map').setView([44.5, 10.9], 8); //center position on emilia-romagna

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
});

const formatDate = (timestamp: string) => {
  const date = new Date(timestamp);
  return date.toLocaleString();
};

async function markerOnClick(sensorId: string, e: { latlng: leaflet.LatLngExpression }) {
  const detections = await fetchSensorDetections(sensorType, sensorId);

  if (!detections || detections.length === 0) {
    leaflet.popup().setLatLng(e.latlng).setContent('No detections available').openOn(map);
    return;
  }

  const labels = detections.map((d) => formatDate(d.timestamp));
  const values = detections.map((d) => d.value);

  const canvas = document.createElement('canvas');
  leaflet.popup().setLatLng(e.latlng).setContent(canvas).openOn(map);

  new Chart(canvas, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Detection Values',
          data: values,
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1,
        },
      ],
    },
    options: {
      scales: {
        x: {
          type: 'category',
          title: {
            display: true,
            text: 'Timestamp',
          },
        },
        y: {
          title: {
            display: true,
            text: 'Value',
          },
        },
      },
    },
  });
}

const addMarkers = (locations: SensorLocation[]) => {
  locations.forEach((location) => {
    const marker = leaflet.marker([location.latitude, location.longitude]);

    marker.on('click', (e) => markerOnClick(location._id, e));
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
  width: 80vh;
  height: 60vh;
}
</style>
