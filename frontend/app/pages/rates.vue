<template>
  <div>
    <div style="margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center">
      <a-typography-title :level="4" style="margin: 0">Calling Rates</a-typography-title>
      <a-button type="primary" @click="showModal()">
        <template #icon><plus-outlined /></template>
        Add Rate
      </a-button>
    </div>

    <a-table :columns="columns" :data-source="rates" :loading="loading" row-key="id">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'destination'">
          {{ record.destinationCountry?.name }} (+{{ record.destinationCountry?.phoneCode }})
        </template>
        <template v-else-if="column.key === 'rate'">
          ${{ record.ratePerMin.toFixed(2) }}
        </template>
        <template v-else-if="column.key === 'action'">
          <a-space>
            <a @click="showModal(record)">Edit</a>
            <a-popconfirm
              title="Are you sure delete this rate?"
              ok-text="Yes"
              cancel-text="No"
              @confirm="handleDelete(record.id)"
            >
              <a style="color: #ff4d4f">Delete</a>
            </a-popconfirm>
          </a-space>
        </template>
      </template>
    </a-table>

    <a-modal
      v-model:open="modalVisible"
      :title="editingId ? 'Edit Rate' : 'Add Rate'"
      @ok="handleOk"
      :confirm-loading="submitting"
    >
      <a-form :model="formState" layout="vertical" ref="formRef">
        <a-form-item
          label="Destination Country"
          name="destinationCountryId"
          :rules="[{ required: true, message: 'Select country' }]"
        >
          <a-select v-model:value="formState.destinationCountryId" placeholder="Select">
            <a-select-option v-for="country in countries" :key="country.id" :value="country.id">
              {{ country.name }} (+{{ country.phoneCode }})
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          label="Rate per Minute ($)"
          name="ratePerMin"
          :rules="[{ required: true, message: 'Please input rate' }]"
        >
          <a-input-number v-model:value="formState.ratePerMin" :min="0" :precision="2" style="width: 100%" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import { message } from 'ant-design-vue';
import { PlusOutlined } from '@ant-design/icons-vue';

const rates = ref([]);
const countries = ref([]);
const loading = ref(false);
const modalVisible = ref(false);
const submitting = ref(false);
const editingId = ref<number | null>(null);
const formRef = ref();

const formState = reactive({
  destinationCountryId: null,
  ratePerMin: 0,
});

const config = useRuntimeConfig();
const apiBase = config.public.apiBase;

const columns = [
  { title: 'Destination', key: 'destination' },
  { title: 'Rate/Min', key: 'rate' },
  { title: 'Action', key: 'action' },
];

const fetchData = async () => {
  loading.value = true;
  try {
    const [ratesRes, countriesRes] = await Promise.all([
      $fetch(`${apiBase}/calling-rate`),
      $fetch(`${apiBase}/country`),
    ]);
    rates.value = ratesRes;
    countries.value = countriesRes;
  } catch (error) {
    message.error('Failed to fetch data');
  } finally {
    loading.value = false;
  }
};

onMounted(fetchData);

const showModal = (record?: any) => {
  if (record) {
    editingId.value = record.id;
    formState.destinationCountryId = record.destinationCountryId;
    formState.ratePerMin = record.ratePerMin;
  } else {
    editingId.value = null;
    formState.destinationCountryId = null;
    formState.ratePerMin = 0;
  }
  modalVisible.value = true;
};

const handleOk = async () => {
  try {
    await formRef.value.validateFields();
    submitting.value = true;
    
    if (editingId.value) {
      await $fetch(`${apiBase}/calling-rate/${editingId.value}`, {
        method: 'PATCH',
        body: formState,
      });
      message.success('Rate updated');
    } else {
      await $fetch(`${apiBase}/calling-rate`, {
        method: 'POST',
        body: formState,
      });
      message.success('Rate created');
    }
    
    modalVisible.value = false;
    fetchData();
  } catch (error) {
    message.error('Operation failed');
  } finally {
    submitting.value = false;
  }
};

const handleDelete = async (id: number) => {
  try {
    await $fetch(`${apiBase}/calling-rate/${id}`, {
      method: 'DELETE',
    });
    message.success('Rate deleted');
    fetchData();
  } catch (error) {
    message.error('Delete failed');
  }
};
</script>