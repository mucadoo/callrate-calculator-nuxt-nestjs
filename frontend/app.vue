<template>
  <a-layout class="layout">
    <a-layout-header>
      <div class="logo">VxTel</div>
      <a-menu
        v-model:selectedKeys="selectedKeys"
        theme="dark"
        mode="horizontal"
        :style="{ lineHeight: '64px' }"
      >
        <a-menu-item key="1">Calculator</a-menu-item>
        <a-menu-item key="2">Rates & Plans</a-menu-item>
      </a-menu>
    </a-layout-header>
    <a-layout-content style="padding: 0 50px">
      <a-breadcrumb style="margin: 16px 0">
        <a-breadcrumb-item>Home</a-breadcrumb-item>
        <a-breadcrumb-item>{{ selectedKeys[0] === '1' ? 'Calculator' : 'Rates & Plans' }}</a-breadcrumb-item>
      </a-breadcrumb>
      <div :style="{ background: '#fff', padding: '24px', minHeight: '280px' }">
        
        <!-- Calculator Section -->
        <div v-if="selectedKeys[0] === '1'">
          <a-typography-title :level="2">Compare and Save</a-typography-title>
          <a-typography-paragraph>
            Enter your call details below to see how much you can save with our FaleMais plans.
          </a-typography-paragraph>

          <a-form :model="formState" @finish="handleCalculate" layout="vertical">
            <a-row :gutter="24">
              <a-col :xs="24" :sm="12" :md="6">
                <a-form-item label="Origin DDD" name="originDDDId" :rules="[{ required: true, message: 'Required' }]">
                  <a-select v-model:value="formState.originDDDId" placeholder="Select Origin" show-search>
                    <a-select-option v-for="ddd in ddds" :key="ddd.id" :value="ddd.id">
                      DDD {{ ddd.code }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :xs="24" :sm="12" :md="6">
                <a-form-item label="Destination DDD" name="destinationDDDId" :rules="[{ required: true, message: 'Required' }]">
                  <a-select v-model:value="formState.destinationDDDId" placeholder="Select Destination" show-search>
                    <a-select-option v-for="ddd in ddds" :key="ddd.id" :value="ddd.id">
                      DDD {{ ddd.code }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :xs="24" :sm="12" :md="6">
                <a-form-item label="Duration (minutes)" name="minutes" :rules="[{ required: true, message: 'Required' }]">
                  <a-input-number v-model:value="formState.minutes" :min="1" style="width: 100%" />
                </a-form-item>
              </a-col>
              <a-col :xs="24" :sm="12" :md="6">
                <a-form-item label="Calling Plan" name="callingPlanId" :rules="[{ required: true, message: 'Required' }]">
                  <a-select v-model:value="formState.callingPlanId" placeholder="Select Plan">
                    <a-select-option v-for="plan in plans" :key="plan.id" :value="plan.id">
                      {{ plan.name }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
            <a-form-item>
              <a-button type="primary" html-type="submit" :loading="calculating" size="large">
                Calculate Savings
              </a-button>
            </a-form-item>
          </a-form>

          <div v-if="result" style="margin-top: 40px">
            <a-row :gutter="24">
              <a-col :xs="24" :md="12">
                <a-card hoverable class="result-card">
                  <template #title>
                    <span style="color: #52c41a"><check-circle-outlined /> With {{ result.callingPlan }}</span>
                  </template>
                  <div class="price-display">
                    <span class="currency">$</span>
                    <span class="amount">{{ result.costWithPlan }}</span>
                  </div>
                  <a-typography-text type="secondary">Total cost using the plan</a-typography-text>
                </a-card>
              </a-col>
              <a-col :xs="24" :md="12">
                <a-card hoverable class="result-card">
                  <template #title>
                    <span style="color: #ff4d4f"><close-circle-outlined /> Without Plan</span>
                  </template>
                  <div class="price-display">
                    <span class="currency">$</span>
                    <span class="amount">{{ result.costWithoutPlan }}</span>
                  </div>
                  <a-typography-text type="secondary">Standard rate applied</a-typography-text>
                </a-card>
              </a-col>
            </a-row>
            
            <div v-if="savings > 0" style="text-align: center; margin-top: 24px">
              <a-alert
                :message="'You save $' + savings.toFixed(2) + ' with this plan!'"
                type="success"
                show-icon
              />
            </div>
          </div>
        </div>

        <!-- Info Section -->
        <div v-else>
          <a-row :gutter="24">
            <a-col :span="12">
              <a-card title="Available Calling Plans">
                <a-list :data-source="plans">
                  <template #renderItem="{ item }">
                    <a-list-item>
                      <a-list-item-meta :title="item.name" :description="item.minutes + ' free minutes included'">
                      </a-list-item-meta>
                      <div>{{ item.exceededMinutesPercent }}% extra fee on exceeded minutes</div>
                    </a-list-item>
                  </template>
                </a-list>
              </a-card>
            </a-col>
            <a-col :span="12">
              <a-card title="Current Rates">
                <a-table :data-source="rates" :columns="rateColumns" size="small" :pagination="false" />
              </a-card>
            </a-col>
          </a-row>
        </div>

      </div>
    </a-layout-content>
    <a-layout-footer style="text-align: center">
      VxTel ©2026 Refactored by Gemini CLI
    </a-layout-footer>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, computed } from 'vue';
import { message } from 'ant-design-vue';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons-vue';

const selectedKeys = ref<string[]>(['1']);
const ddds = ref<any[]>([]);
const plans = ref<any[]>([]);
const rates = ref<any[]>([]);
const calculating = ref(false);
const result = ref<any>(null);

const formState = reactive({
  originDDDId: null,
  destinationDDDId: null,
  minutes: 0,
  callingPlanId: null,
});

const config = useRuntimeConfig();
const apiBase = config.public.apiBase;

const rateColumns = [
  { title: 'From', dataIndex: ['originDDD', 'code'], key: 'from' },
  { title: 'To', dataIndex: ['destinationDDD', 'code'], key: 'to' },
  { title: '$/Min', dataIndex: 'ratePerMin', key: 'rate' },
];

const savings = computed(() => {
  if (!result.value) return 0;
  return result.value.costWithoutPlan - result.value.costWithPlan;
});

onMounted(async () => {
  try {
    const [dddsRes, plansRes, ratesRes] = await Promise.all([
      $fetch(`${apiBase}/ddd`),
      $fetch(`${apiBase}/calling-plan`),
      $fetch(`${apiBase}/calling-rate`),
    ]);
    ddds.value = dddsRes as any[];
    plans.value = plansRes as any[];
    rates.value = ratesRes as any[];
  } catch (error) {
    message.error('Failed to connect to the backend API');
    console.error('Data load error:', error);
  }
});

const handleCalculate = async () => {
  calculating.value = true;
  try {
    const res = await $fetch(`${apiBase}/calculation`, {
      query: {
        originDDDId: formState.originDDDId,
        destinationDDDId: formState.destinationDDDId,
        minutes: formState.minutes,
        callingPlanId: formState.callingPlanId,
      },
    });
    result.value = res;
    message.success('Calculation updated');
  } catch (error: any) {
    if (error.status === 404) {
      message.warning('No rate found for this destination');
    } else {
      message.error('An error occurred during calculation');
    }
    result.value = null;
  } finally {
    calculating.value = false;
  }
};
</script>

<style scoped>
.layout {
  min-height: 100vh;
}
.logo {
  float: left;
  width: 120px;
  height: 31px;
  margin: 16px 24px 16px 0;
  background: rgba(255, 255, 255, 0.3);
  color: white;
  text-align: center;
  line-height: 31px;
  font-weight: bold;
  font-size: 1.2rem;
  border-radius: 4px;
}
.result-card {
  text-align: center;
  margin-bottom: 24px;
}
.price-display {
  margin: 16px 0;
}
.currency {
  font-size: 1.5rem;
  vertical-align: top;
  margin-right: 4px;
}
.amount {
  font-size: 3rem;
  font-weight: bold;
}
</style>
