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
        <template v-if="column.key === 'action'">
          <a-space>
            <a @click="showModal(record)">Edit</a>
            <a-popconfirm
              title="Are you sure delete this plan?"
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
          <a-input v-model:value="formState.name" placeholder="e.g. TalkMore 30" />
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
import { PlusOutlined } from '@ant-design/icons-vue';

const plans = ref([]);
const loading = ref(false);
const modalVisible = ref(false);
const submitting = ref(false);
const editingId = ref<number | null>(null);
const formRef = ref();

const formState = reactive({
  name: '',
  minutes: 0,
  exceededMinutesPercent: 10,
});

const config = useRuntimeConfig();
const apiBase = config.public.apiBase;

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id' },
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Minutes', dataIndex: 'minutes', key: 'minutes' },
  { title: 'Exceeded Fee (%)', dataIndex: 'exceededMinutesPercent', key: 'fee' },
  { title: 'Action', key: 'action' },
];

const fetchPlans = async () => {
  loading.value = true;
  try {
    plans.value = await $fetch(`${apiBase}/calling-plan`);
  } catch (error) {
    message.error('Failed to fetch plans');
  } finally {
    loading.value = false;
  }
};

onMounted(fetchPlans);

const showModal = (record?: any) => {
  if (record) {
    editingId.value = record.id;
    formState.name = record.name;
    formState.minutes = record.minutes;
    formState.exceededMinutesPercent = record.exceededMinutesPercent;
  } else {
    editingId.value = null;
    formState.name = '';
    formState.minutes = 0;
    formState.exceededMinutesPercent = 10;
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
    fetchPlans();
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
    fetchPlans();
  } catch (error) {
    message.error('Delete failed');
  }
};
</script>
