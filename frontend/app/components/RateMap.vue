<template>
  <div ref="mapContainer" style="height: 400px; width: 100%; border-radius: 8px"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps<{ countries: any[] }>();
const emit = defineEmits(['select']);

const mapContainer = ref(null);
let map: any = null;

// Approximated rough polygons
const countryPolygons: Record<string, any> = {
  'Brazil': {
    "type": "Polygon",
    "coordinates": [[
        [-34.8, -7.1], [-46.0, -23.5], [-54.0, -25.0], [-60.0, -10.0], 
        [-70.0, -8.0], [-68.0, 0.0], [-55.0, 2.0], [-48.0, -1.0], [-34.8, -7.1]
    ]]
  },
  'USA': {
    "type": "Polygon",
    "coordinates": [[
        [-124.7, 49.0], [-124.7, 32.5], [-114.0, 32.5], [-105.0, 25.0], 
        [-90.0, 28.0], [-80.0, 25.0], [-70.0, 40.0], [-70.0, 45.0], [-124.7, 49.0]
    ]]
  }
};

onMounted(async () => {
  const L = await import('leaflet');
  await import('leaflet/dist/leaflet.css');

  map = L.map(mapContainer.value!).setView([20, -50], 2);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
  }).addTo(map);

  props.countries.forEach(country => {
    const geo = countryPolygons[country.name];
    if (geo) {
      L.geoJSON(geo, {
        style: { color: 'blue', weight: 2, fillOpacity: 0.3 }
      }).addTo(map!).on('click', () => {
        emit('select', country.id);
      }).bindPopup(country.name);
    }
  });
});

onUnmounted(() => {
  if (map) map.remove();
});
</script>
