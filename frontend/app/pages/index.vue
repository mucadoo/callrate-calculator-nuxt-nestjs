<template>
  <div>
    <a-typography-title :level="3">Provider Comparison Calculator</a-typography-title>
    <a-typography-paragraph>Compare international calling costs across different providers.</a-typography-paragraph>
    
    <a-row :gutter="24">
      <a-col :span="24">
        <RateMap :countries="countries" @select="handleMapSelect" />
      </a-col>
    </a-row>

    <CalculatorForm 
      ref="calcForm"
      :countries="countries" 
      :calculating="calculating" 
      @calculate="handleCalculate" 
    />
    <ComparisonResults :results="results" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { message } from 'ant-design-vue';

const countries = ref<any[]>([]);
const calculating = ref(false);
const results = ref<any[]>([]);
const calcForm = ref();

const config = useRuntimeConfig();
const apiBase = config.public.apiBase;

onMounted(async () => {
  try {
    countries.value = await $fetch(`${apiBase}/country`);
  } catch (error) {
    message.error('Failed to load initial data');
  }
});

const handleMapSelect = (countryId: number) => {
  if (calcForm.value) {
    calcForm.value.formState.destinationCountryId = countryId;
    message.info('Country selected from map');
  }
};

const handleCalculate = async (formState: any) => {
  calculating.value = true;
  try {
    results.value = await $fetch(`${apiBase}/calculation`, {
      query: {
        destinationCountryId: Number(formState.destinationCountryId),
        minutes: Number(formState.minutes),
      },
    });
    message.success('Comparison completed');
  } catch (error: any) {
    if (error.status === 404) {
      message.warning('No rates found for this country');
    } else {
      message.error('Comparison error');
    }
    results.value = [];
  } finally {
    calculating.value = false;
  }
};
</script>
