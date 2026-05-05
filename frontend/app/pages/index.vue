<template>
  <div>
    <a-typography-title :level="3">Plan Comparison Calculator</a-typography-title>
    <a-typography-paragraph>
      Select the call details to compare standard rates with our FaleMais plans.
    </a-typography-paragraph>

    <a-card style="margin-bottom: 24px">
      <a-form :model="formState" @finish="handleCalculate" layout="vertical">
        <a-row :gutter="24">
          <a-col :xs="24" :sm="12" :md="6">
            <a-form-item label="Origin Area Code" name="originAreaId" :rules="[{ required: true, message: 'Select origin' }]">
              <a-select v-model:value="formState.originAreaId" placeholder="Select" show-search>
                <a-select-option v-for="area in areaCodes" :key="area.id" :value="area.id">
                  Area {{ area.code }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="12" :md="6">
            <a-form-item label="Destination Area Code" name="destinationAreaId" :rules="[{ required: true, message: 'Select destination' }]">
              <a-select v-model:value="formState.destinationAreaId" placeholder="Select" show-search>
                <a-select-option v-for="area in areaCodes" :key="area.id" :value="area.id">
                  Area {{ area.code }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="12" :md="6">
            <a-form-item label="Duration (minutes)" name="minutes" :rules="[{ required: true, message: 'Enter minutes' }]">
              <a-input-number v-model:value="formState.minutes" :min="1" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="12" :md="6">
            <a-form-item label="Calling Plan" name="callingPlanId" :rules="[{ required: true, message: 'Select plan' }]">
              <a-select v-model:value="formState.callingPlanId" placeholder="Select">
                <a-select-option v-for="plan in plans" :key="plan.id" :value="plan.id">
                  {{ plan.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item style="margin-bottom: 0">
          <a-button type="primary" html-type="submit" :loading="calculating" size="large" block>
            Calculate
          </a-button>
        </a-form-item>
      </a-form>
    </a-card>

    <div v-if="result" class="result-container">
      <a-row :gutter="24">
        <a-col :xs="24" :md="12">
          <a-card class="result-card highlight">
            <a-statistic
              title="Cost with Plan"
              :value="result.costWithPlan"
              :precision="2"
              prefix="$"
              :value-style="{ color: '#52c41a' }"
            />
            <div class="card-footer">Using {{ result.callingPlan }}</div>
          </a-card>
        </a-col>
        <a-col :xs="24" :md="12">
          <a-card class="result-card">
            <a-statistic
              title="Standard Cost"
              :value="result.costWithoutPlan"
              :precision="2"
              prefix="$"
            />
            <div class="card-footer">Standard Rate Applied</div>
          </a-card>
        </a-col>
      </a-row>

      <a-result
        v-if="savings > 0"
        status="success"
        :title="'You save $' + savings.toFixed(2) + '!'"
        sub-title="Switch to FaleMais today and start saving on every call."
        style="padding: 24px 0"
      >
        <template #extra>
          <a-button key="buy" type="primary">Subscribe to {{ result.callingPlan }}</a-button>
        </template>
      </a-result>
      <a-alert
        v-else-if="result.costWithPlan === result.costWithoutPlan"
        message="Standard cost is equal to plan cost for this duration."
        type="info"
        show-icon
        style="margin-top: 24px"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, computed } from 'vue';
import { message } from 'ant-design-vue';

const areaCodes = ref<any[]>([]);
const plans = ref<any[]>([]);
const calculating = ref(false);
const result = ref<any>(null);

const formState = reactive({
  originAreaId: null,
  destinationAreaId: null,
  minutes: 0,
  callingPlanId: null,
});

const config = useRuntimeConfig();
const apiBase = config.public.apiBase;

const savings = computed(() => {
  if (!result.value) return 0;
  return result.value.costWithoutPlan - result.value.costWithPlan;
});

onMounted(async () => {
  try {
    const [areaCodesRes, plansRes] = await Promise.all([
      $fetch(`${apiBase}/area-code`),
      $fetch(`${apiBase}/calling-plan`),
    ]);
    areaCodes.value = areaCodesRes as any[];
    plans.value = plansRes as any[];
  } catch (error) {
    message.error('Failed to load initial data');
  }
});

const handleCalculate = async () => {
  calculating.value = true;
  try {
    const res = await $fetch(`${apiBase}/calculation`, {
      query: { ...formState },
    });
    result.value = res;
    message.success('Calculation completed');
  } catch (error: any) {
    if (error.status === 404) {
      message.warning('Rate not found for this route');
    } else {
      message.error('Calculation error');
    }
    result.value = null;
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
.result-card {
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}
.result-card.highlight {
  border: 2px solid #52c41a;
  background: #f6ffed;
}
.card-footer {
  color: #8c8c8c;
  font-size: 0.85rem;
  margin-top: 8px;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
