<template>
  <div>
    <div style="margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center">
      <a-typography-title :level="4" style="margin: 0">Calling Plans</a-typography-title>
      <a-button type="primary" @click="showModal()">
        <template #icon><plus-outlined /></template>
        Add Plan
      </a-button>
    </div>

    <a-table :columns="columns" :data-source="plans" :loading="loading" row-key="id">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'provider'">
          {{ record.provider?.name || 'N/A' }}
        </template>
        <template v-else-if="column.key === 'action'">
          <a-space>
            <a-tooltip title="Edit">
              <a-button type="link" size="small" @click="showModal(record)">
                <template #icon><edit-outlined /></template>
              </a-button>
            </a-tooltip>
            <a-tooltip title="Delete">
              <a-popconfirm
                title="Are you sure delete this plan?"
                ok-text="Yes"
                cancel-text="No"
                @confirm="handleDelete(record.id)"
              >
                <a-button type="link" size="small" danger>
                  <template #icon><delete-outlined /></template>
                </a-button>
              </a-popconfirm>
            </a-tooltip>
          </a-space>
        </template>
      </template>
    </a-table>

    <a-modal
      v-model:open="modalVisible"
      :title="editingId ? 'Edit Plan' : 'Add Plan'"
      @ok="handleOk"
      :confirm-loading="submitting"
    >
      <a-form :model="formState" layout="vertical" ref="formRef">
        <a-form-item
          label="Plan Name"
          name="name"
          :rules="[{ required: true, message: 'Please input plan name' }]"
        >
          <a-input v-model:value="formState.name" />
        </a-form-item>
        <a-form-item
          label="Provider"
          name="providerId"
          :rules="[{ required: true, message: 'Select provider' }]"
        >
          <a-select v-model:value="formState.providerId" placeholder="Select">
            <a-select-option v-for="p in providers" :key="p.id" :value="p.id">{{ p.name }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          label="Included Minutes"
          name="minutes"
          :rules="[{ required: true, message: 'Please input included minutes' }]"
        >
          <a-input-number v-model:value="formState.minutes" :min="0" style="width: 100%" />
        </a-form-item>
        <a-form-item
          label="Exceeded Fee (%)"
          name="exceededMinutesPercent"
          :rules="[{ required: true, message: 'Please input exceeded fee' }]"
        >
          <a-input-number v-model:value="formState.exceededMinutesPercent" :min="0" style="width: 100%" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import { message } from 'ant-design-vue';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons-vue';

const plans = ref([]);
const providers = ref([]);
const loading = ref(false);
const modalVisible = ref(false);
const submitting = ref(false);
const editingId = ref<number | null>(null);
const formRef = ref();

const formState = reactive({
  name: '',
  minutes: 0,
  exceededMinutesPercent: 10,
  providerId: null,
});

const config = useRuntimeConfig();
const apiBase = config.public.apiBase;

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id' },
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Provider', key: 'provider' },
  { title: 'Minutes', dataIndex: 'minutes', key: 'minutes' },
  { title: 'Exceeded Fee (%)', dataIndex: 'exceededMinutesPercent', key: 'fee' },
  { title: 'Action', key: 'action' },
];

const fetchData = async () => {
  loading.value = true;
  try {
    const [plansRes, providersRes] = await Promise.all([
      $fetch(`${apiBase}/calling-plan`),
      $fetch(`${apiBase}/provider`),
    ]);
    plans.value = plansRes;
    providers.value = providersRes;
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
    formState.name = record.name;
    formState.minutes = record.minutes;
    formState.exceededMinutesPercent = record.exceededMinutesPercent;
    formState.providerId = record.providerId;
  } else {
    editingId.value = null;
    formState.name = '';
    formState.minutes = 0;
    formState.exceededMinutesPercent = 10;
    formState.providerId = null;
  }
  modalVisible.value = true;
};

const handleOk = async () => {
  try {
    await formRef.value.validateFields();
    submitting.value = true;
    
    if (editingId.value) {
      await $fetch(`${apiBase}/calling-plan/${editingId.value}`, {
        method: 'PATCH',
        body: formState,
      });
      message.success('Plan updated');
    } else {
      await $fetch(`${apiBase}/calling-plan`, {
        method: 'POST',
        body: formState,
      });
      message.success('Plan created');
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
    await $fetch(`${apiBase}/calling-plan/${id}`, {
      method: 'DELETE',
    });
    message.success('Plan deleted');
    fetchData();
  } catch (error) {
    message.error('Delete failed');
  }
};
</script>
