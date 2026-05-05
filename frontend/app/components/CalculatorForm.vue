<template>
  <a-card style="margin-bottom: 24px">
    <a-form :model="formState" @finish="$emit('calculate', formState)" layout="vertical">
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
</template>

<script setup lang="ts">
import { reactive } from 'vue';

defineProps<{ countries: any[], calculating: boolean }>();
const formState = reactive({
  destinationCountryId: null,
  minutes: 0,
});
</script>
