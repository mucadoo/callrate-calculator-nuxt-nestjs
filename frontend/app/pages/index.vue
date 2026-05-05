<template>
  <div>
    <a-typography-title :level="3">Provider Comparison Calculator</a-typography-title>
    <a-typography-paragraph>
      Compare international calling costs across different providers.
    </a-typography-paragraph>

    <a-card style="margin-bottom: 24px">
      <a-form :model="formState" @finish="handleCalculate" layout="vertical">
        <a-row :gutter="24">
          <a-col :xs="24" :sm="12">
            <a-form-item label="Destination Country" name="destinationCountryId" :rules="[{ required: true, message: 'Select country' }]">
              <a-select v-model:value="formState.destinationCountryId" placeholder="Select" show-search>
                <a-select-option v-for="country in countries" :key="country.id" :value="country.id">
                  {{ country.name }} (+{{ country.phoneCode }})
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="12">
            <a-form-item label="Duration (minutes)" name="minutes" :rules="[{ required: true, message: 'Enter minutes' }]">
              <a-input-number v-model:value="formState.minutes" :min="1" style="width: 100%" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item style="margin-bottom: 0">
          <a-button type="primary" html-type="submit" :loading="calculating" size="large" block>
            Compare Rates
          </a-button>
        </a-form-item>
      </a-form>
    </a-card>

    <div v-if="results.length > 0" class="result-container">
      <a-row :gutter="24">
        <a-col :span="24" v-for="res in results" :key="res.planName" style="margin-bottom: 16px">
          <a-card :title="res.planName">
            <template #extra>
              <a-tag color="blue">{{ res.provider }}</a-tag>
            </template>
            <p><strong>Standard Rate:</strong> ${{ res.standardRate }}/min</p>
            <p><strong>Standard Cost:</strong> ${{ res.standardCost }}</p>
            <p><strong>Cost with Plan:</strong> <strong style="color: #52c41a">${{ res.costWithPlan }}</strong></p>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import { message } from 'ant-design-vue';

const countries = ref<any[]>([]);
const calculating = ref(false);
const results = ref<any[]>([]);

const formState = reactive({
  destinationCountryId: null,
  minutes: 0,
});

const config = useRuntimeConfig();
const apiBase = config.public.apiBase;

onMounted(async () => {
  try {
    countries.value = await $fetch(`${apiBase}/country`);
  } catch (error) {
    message.error('Failed to load initial data');
  }
});

const handleCalculate = async () => {
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

<style scoped>
.result-container {
  margin-top: 32px;
  animation: fadeIn 0.5s ease;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
