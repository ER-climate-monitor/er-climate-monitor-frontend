<template>
  <div id="map"></div>
</template>

<script setup lang="ts">
import leaflet from 'leaflet';
import { onMounted, watch } from 'vue';
import type { PropType } from 'vue';

const { locations } = defineProps({
  locations: {
    type: Array as PropType<{ latitude: number; longitude: number }[]>,
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
const addMarkers = (locations: { latitude: number; longitude: number }[]) => {
  locations.forEach((location) => {
    leaflet
      .marker([location.latitude, location.longitude])
      .addTo(map)
      .bindPopup(`Latitude: ${location.latitude}, Longitude: ${location.longitude}`);
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
