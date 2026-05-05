<template>
  <a-layout style="min-height: 100vh">
    <a-layout-sider v-model:collapsed="collapsed" collapsible>
      <div class="logo">CallRate</div>
      <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline">
        <a-menu-item key="index">
          <template #icon>
            <calculator-outlined />
          </template>
          <nuxt-link to="/">Calculator</nuxt-link>
        </a-menu-item>
        <a-menu-item key="countries">
          <template #icon>
            <global-outlined />
          </template>
          <nuxt-link to="/countries">Countries</nuxt-link>
        </a-menu-item>
        <a-menu-item key="providers">
          <template #icon>
            <apartment-outlined />
          </template>
          <nuxt-link to="/providers">Providers</nuxt-link>
        </a-menu-item>
        <a-menu-item key="plans">
          <template #icon>
            <file-protect-outlined />
          </template>
          <nuxt-link to="/plans">Calling Plans</nuxt-link>
        </a-menu-item>
        <a-menu-item key="rates">
          <template #icon>
            <percentage-outlined />
          </template>
          <nuxt-link to="/rates">Calling Rates</nuxt-link>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0 24px">
        <a-typography-title :level="4" style="line-height: 64px; margin: 0">
          {{ pageTitle }}
        </a-typography-title>
      </a-layout-header>
      <a-layout-content style="margin: 24px 16px; padding: 24px; background: #fff; min-height: 280px">
        <slot />
      </a-layout-content>
      <a-layout-footer style="text-align: center">
        CallRate ©2026 Admin Dashboard
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import {
  CalculatorOutlined,
  EnvironmentOutlined,
  FileProtectOutlined,
  PercentageOutlined,
  GlobalOutlined,
  ApartmentOutlined,
} from '@ant-design/icons-vue';

const collapsed = ref(false);
const route = useRoute();
const selectedKeys = ref<string[]>([]);

// Sync selectedKeys with current route
watch(() => route.name, (newName) => {
  if (newName) {
    selectedKeys.value = [newName.toString()];
  }
}, { immediate: true });

const pageTitle = computed(() => {
  switch (route.name) {
    case 'index': return 'Calculator';
    case 'area-codes': return 'Manage Area Codes';
    case 'countries': return 'Manage Countries';
    case 'providers': return 'Manage Providers';
    case 'plans': return 'Manage Calling Plans';
    case 'rates': return 'Manage Calling Rates';
    default: return 'CallRate';
  }
});
</script>

<style scoped>
.logo {
  height: 32px;
  margin: 16px;
  background: rgba(255, 255, 255, 0.3);
  color: white;
  text-align: center;
  line-height: 32px;
  font-weight: bold;
  font-size: 1.1rem;
  border-radius: 4px;
}
</style>
