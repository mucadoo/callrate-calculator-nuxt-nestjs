<template>
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
</template>

<script setup lang="ts">
defineProps<{ results: any[] }>();
</script>
