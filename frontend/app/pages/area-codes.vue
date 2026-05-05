<template>
  <div>
    <div style="margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center">
      <a-typography-title :level="4" style="margin: 0">Area Codes</a-typography-title>
      <a-button type="primary" @click="showModal()">
        <template #icon><plus-outlined /></template>
        Add Area Code
      </a-button>
    </div>

    <a-table :columns="columns" :data-source="areaCodes" :loading="loading" row-key="id">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <a-space>
            <a @click="showModal(record)">Edit</a>
            <a-popconfirm
              title="Are you sure delete this area code?"
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
      :title="editingId ? 'Edit Area Code' : 'Add Area Code'"
      @ok="handleOk"
      :confirm-loading="submitting"
    >
      <a-form :model="formState" layout="vertical" ref="formRef">
        <a-form-item
          label="Area Code"
          name="code"
          :rules="[{ required: true, message: 'Please input area code' }]"
        >
          <a-input v-model:value="formState.code" placeholder="e.g. 11" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import { message } from 'ant-design-vue';
import { PlusOutlined } from '@ant-design/icons-vue';

const areaCodes = ref([]);
const loading = ref(false);
const modalVisible = ref(false);
const submitting = ref(false);
const editingId = ref<number | null>(null);
const formRef = ref();

const formState = reactive({
  code: '',
});

const config = useRuntimeConfig();
const apiBase = config.public.apiBase;

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id' },
  { title: 'Code', dataIndex: 'code', key: 'code' },
  { title: 'Action', key: 'action' },
];

const fetchAreaCodes = async () => {
  loading.value = true;
  try {
    areaCodes.value = await $fetch(`${apiBase}/area-code`);
  } catch (error) {
    message.error('Failed to fetch area codes');
  } finally {
    loading.value = false;
  }
};

onMounted(fetchAreaCodes);

const showModal = (record?: any) => {
  if (record) {
    editingId.value = record.id;
    formState.code = record.code;
  } else {
    editingId.value = null;
    formState.code = '';
  }
  modalVisible.value = true;
};

const handleOk = async () => {
  try {
    await formRef.value.validateFields();
    submitting.value = true;
    
    if (editingId.value) {
      await $fetch(`${apiBase}/area-code/${editingId.value}`, {
        method: 'PATCH',
        body: formState,
      });
      message.success('Area code updated');
    } else {
      await $fetch(`${apiBase}/area-code`, {
        method: 'POST',
        body: formState,
      });
      message.success('Area code created');
    }
    
    modalVisible.value = false;
    fetchAreaCodes();
  } catch (error) {
    message.error('Operation failed');
  } finally {
    submitting.value = false;
  }
};

const handleDelete = async (id: number) => {
  try {
    await $fetch(`${apiBase}/area-code/${id}`, {
      method: 'DELETE',
    });
    message.success('Area code deleted');
    fetchAreaCodes();
  } catch (error) {
    message.error('Delete failed');
  }
};
</script>
