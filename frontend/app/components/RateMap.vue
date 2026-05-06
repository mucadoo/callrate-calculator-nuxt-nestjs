<template>
  <div ref="container" class="map-container" @mousemove="handleMouseMove" @mouseleave="handleMouseLeave">
    <div class="zoom-controls">
      <button @click="zoomIn" title="Zoom In">+</button>
      <button @click="zoomOut" title="Zoom Out">−</button>
      <button @click="resetZoom" title="Reset">⟲</button>
    </div>

    <!-- Optimized Tooltip -->
    <div 
      v-show="hoveredCountry" 
      class="map-tooltip" 
      :style="{ transform: `translate3d(${tooltipX}px, ${tooltipY}px, 0)` }"
    >
      {{ hoveredCountry }}
    </div>
    
    <svg 
      ref="svgRef" 
      :viewBox="`0 0 ${width} ${height}`" 
      preserveAspectRatio="xMidYMid meet"
      class="map-svg"
    >
      <rect width="100%" height="100%" fill="#e6f3ff" />
      <g ref="gRef">
        <!-- Render from pre-calculated paths for performance -->
        <path
          v-for="item in renderedCountries"
          :key="item.id"
          :d="item.path"
          class="country"
          :class="{ selected: selectedCountry === item.name }"
          :data-name="item.name"
          @click="handleCountryClick(item.name)"
        />
      </g>
    </svg>
    <div v-if="loading" class="loading-overlay">Optimizing Map Performance...</div>
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
const rawCountries = ref<any[]>([]);
const selectedCountry = ref<string | null>(null);
const hoveredCountry = ref<string | null>(null);
const loading = ref(true);

const tooltipX = ref(0);
const tooltipY = ref(0);

// Current projection
const projection = computed(() => {
  return d3.geoMercator()
    .scale(width.value / 6.5)
    .translate([width.value / 2, height.value / 1.45]);
});

// PRE-CALCULATE PATHS: This is the key to hover performance
const renderedCountries = computed(() => {
  const pathGen = d3.geoPath().projection(projection.value);
  return rawCountries.value.map(f => ({
    id: f.properties?.ADM0_A3 || f.properties?.NAME || Math.random(),
    name: f.properties?.NAME,
    path: pathGen(f) || ''
  }));
});

const handleCountryClick = (name: string) => {
  selectedCountry.value = name;
  if (name === 'United States of America' || name === 'United States') emit('select', 2);
  else if (name === 'Brazil') emit('select', 1);
};

const handleMouseMove = (e: MouseEvent) => {
  // Update tooltip position using translate3d (faster)
  if (container.value) {
    const rect = container.value.getBoundingClientRect();
    tooltipX.value = e.clientX - rect.left + 15;
    tooltipY.value = e.clientY - rect.top + 15;
  }

  // Use event target to find country name (more efficient than 200+ mouseenter listeners)
  const target = e.target as SVGElement;
  if (target && target.classList.contains('country')) {
    hoveredCountry.value = target.getAttribute('data-name');
  } else {
    hoveredCountry.value = null;
  }
};

const handleMouseLeave = () => {
  hoveredCountry.value = null;
};

const updateSize = () => {
  if (container.value) {
    width.value = container.value.clientWidth;
    height.value = container.value.clientHeight || 500;
  }
};

let zoomBehavior: d3.ZoomBehavior<SVGSVGElement, unknown> | null = null;

const zoomIn = () => {
  if (svgRef.value && zoomBehavior) {
    d3.select(svgRef.value).transition().duration(400).call(zoomBehavior.scaleBy, 2);
  }
};

const zoomOut = () => {
  if (svgRef.value && zoomBehavior) {
    d3.select(svgRef.value).transition().duration(400).call(zoomBehavior.scaleBy, 0.5);
  }
};

const resetZoom = () => {
  if (svgRef.value && zoomBehavior) {
    d3.select(svgRef.value).transition().duration(750).ease(d3.easeCubicInOut).call(zoomBehavior.transform, d3.zoomIdentity);
  }
};

onMounted(async () => {
  try {
    updateSize();
    window.addEventListener('resize', updateSize);

    const worldJson = await d3.json('/data/world.json') as any;
    if (worldJson && worldJson.features) {
      rawCountries.value = worldJson.features;
    }
    loading.value = false;

    await nextTick();

    if (svgRef.value && gRef.value) {
      const svg = d3.select(svgRef.value);
      const g = d3.select(gRef.value);

      zoomBehavior = d3.zoom<SVGSVGElement, unknown>()
        .scaleExtent([1, 50])
        .translateExtent([[0, 0], [width.value, height.value]])
        .on('zoom', (event) => {
          g.attr('transform', event.transform);
        });

      svg.call(zoomBehavior);
    }
  } catch (err) {
    console.error('Map Load Error:', err);
    loading.value = false;
  }
});

onUnmounted(() => {
  window.removeEventListener('resize', updateSize);
});
</script>

<style scoped>
.map-container {
  height: 500px;
  width: 100%;
  border-radius: 12px;
  background-color: #e6f3ff;
  overflow: hidden;
  position: relative;
  border: 2px solid #d1e9ff;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  cursor: crosshair;
}

.map-svg {
  width: 100%;
  height: 100%;
}

.country {
  fill: #fffdfa;
  stroke: #8b9eb0;
  stroke-width: 0.5px;
  vector-effect: non-scaling-stroke;
  transition: fill 0.15s;
  cursor: pointer;
}

.country:hover {
  fill: #fff1d6;
  stroke: #ff9c33;
  stroke-width: 1.5px;
}

.country.selected {
  fill: #ff9c33;
  stroke: #e67e22;
  stroke-width: 1.5px;
}

.map-tooltip {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0,0,0,0.25);
  white-space: nowrap;
  will-change: transform; /* Hint to browser for GPU acceleration */
}

.zoom-controls {
  position: absolute;
  top: 15px;
  right: 15px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 10;
}

.zoom-controls button {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: 1px solid #d1e9ff;
  background: white;
  color: #1890ff;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 6px rgba(0,0,0,0.08);
}

.zoom-controls button:hover {
  background: #f0f7ff;
  border-color: #1890ff;
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(0,0,0,0.12);
}

.zoom-controls button:active {
  transform: scale(0.95);
}

.loading-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255,255,255,0.95);
  padding: 15px 30px;
  border-radius: 40px;
  font-weight: 600;
  color: #1890ff;
  box-shadow: 0 8px 30px rgba(0,0,0,0.15);
}
</style>
