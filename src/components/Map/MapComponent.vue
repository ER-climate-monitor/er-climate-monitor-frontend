<template>
    <div id="map"></div>
  </template>
  
  <script setup lang="ts">
  import leaflet from "leaflet";

  import { onMounted } from "vue";
  
  import { userMarker } from "@/stores/mapStore";
  
  
  let map: leaflet.Map;
  
  onMounted(() => {
    map = leaflet
      .map("map")
      .setView([userMarker.value.latitude, userMarker.value.longitude], 13);
  
    leaflet
      .tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      })
      .addTo(map);
  
  
  });
  </script>
  
  <style scoped>
  #map {
    width: 100%;
    height: 100vh;
  }
  </style>