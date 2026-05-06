<template>
  <div ref="container" class="map-container">
    <svg 
      ref="svgRef" 
      :viewBox="`0 0 ${width} ${height}`" 
      preserveAspectRatio="xMidYMid meet"
      class="map-svg"
    >
      <rect width="100%" height="100%" fill="#f9f9f9" />
      <g ref="gRef">
        <path
          v-for="feature in countries"
          :key="feature.id || feature.properties?.name"
          :d="pathGenerator(feature) || ''"
          class="country"
          :class="{ selected: selectedCountry === (feature.properties?.name || feature.properties?.NAME) }"
          @click="handleCountryClick(feature)"
        >
          <title>{{ feature.properties?.name || feature.properties?.NAME }}</title>
        </path>
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import * as d3 from 'd3';

const emit = defineEmits(['select']);

const container = ref<HTMLElement | null>(null);
const svgRef = ref<SVGSVGElement | null>(null);
const gRef = ref<SVGGElement | null>(null);

const width = ref(800);
const height = ref(450);
const countries = ref<any[]>([]);
const selectedCountry = ref<string | null>(null);

const projection = computed(() => {
  return d3.geoMercator()
    .scale(width.value / 6.5)
    .translate([width.value / 2, height.value / 1.5]);
});

const pathGenerator = computed(() => d3.geoPath().projection(projection.value));

const handleCountryClick = (feature: any) => {
  const name = feature.properties?.name || feature.properties?.NAME;
  selectedCountry.value = name;

  if (name === 'United States' || name === 'United States of America') emit('select', 2);
  else if (name === 'Brazil') emit('select', 1);
};

const updateSize = () => {
  if (container.value) {
    width.value = container.value.clientWidth;
    height.value = container.value.clientHeight || 450;
  }
};

onMounted(async () => {
  try {
    updateSize();
    window.addEventListener('resize', updateSize);

    const worldJson = await d3.json('/data/world.json') as any;
    if (worldJson && worldJson.features) {
      countries.value = worldJson.features;
    }

    await nextTick();

    if (svgRef.value && gRef.value) {
      const svg = d3.select(svgRef.value);
      const g = d3.select(gRef.value);

      const zoom = d3.zoom<SVGSVGElement, unknown>()
        .scaleExtent([1, 12])
        .on('zoom', (event) => {
          g.attr('transform', event.transform);
        });

      svg.call(zoom);
    }
  } catch (err) {
    console.error('Map Load Error:', err);
  }
});

onUnmounted(() => {
  window.removeEventListener('resize', updateSize);
});
</script>

<style scoped>
.map-container {
  height: 450px;
  width: 100%;
  border-radius: 8px;
  background-color: #f9f9f9;
  overflow: hidden;
  position: relative;
  border: 1px solid #e8e8e8;
}

.map-svg {
  width: 100%;
  height: 100%;
}

.country {
  fill: #e0e0e0;
  stroke: #b0b0b0;
  stroke-width: 0.5px;
  transition: fill 0.2s, stroke 0.2s;
  cursor: pointer;
}

.country:hover {
  fill: #d1d1d1;
  stroke: #1890ff;
  stroke-width: 1px;
}

.country.selected {
  fill: #1890ff;
  stroke: #096dd9;
  stroke-width: 1px;
}
</style>
