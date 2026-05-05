<template>
  <div>
    <div style="margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center">
      <a-typography-title :level="4" style="margin: 0">Countries</a-typography-title>
      <a-button type="primary" @click="showModal()">
        <template #icon><plus-outlined /></template>
        Add Country
      </a-button>
    </div>

    <a-table :columns="columns" :data-source="countries" :loading="loading" row-key="id">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <a-space>
            <a-tooltip title="Edit">
              <a-button type="link" size="small" @click="showModal(record)">
                <template #icon><edit-outlined /></template>
              </a-button>
            </a-tooltip>
            <a-tooltip title="Delete">
              <a-popconfirm
                title="Are you sure delete this country?"
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
      :title="editingId ? 'Edit Country' : 'Add Country'"
      @ok="handleOk"
      :confirm-loading="submitting"
    >
      <a-form :model="formState" layout="vertical" ref="formRef">
        <a-form-item
          label="Name"
          name="name"
          :rules="[{ required: true, message: 'Please input country name' }]"
        >
          <a-input v-model:value="formState.name" />
        </a-form-item>
        <a-form-item
          label="Phone Code"
          name="phoneCode"
          :rules="[{ required: true, message: 'Please input phone code' }]"
        >
          <a-input v-model:value="formState.phoneCode" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import { message } from 'ant-design-vue';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons-vue';

const countries = ref([]);
const loading = ref(false);
const modalVisible = ref(false);
const submitting = ref(false);
const editingId = ref<number | null>(null);
const formRef = ref();

const formState = reactive({
  name: '',
  phoneCode: '',
});

const config = useRuntimeConfig();
const apiBase = config.public.apiBase;

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id' },
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Phone Code', dataIndex: 'phoneCode', key: 'phoneCode' },
  { title: 'Action', key: 'action' },
];

const fetchCountries = async () => {
  loading.value = true;
  try {
    countries.value = await $fetch(`${apiBase}/country`);
  } catch (error) {
    message.error('Failed to fetch countries');
  } finally {
    loading.value = false;
  }
};

onMounted(fetchCountries);

const showModal = (record?: any) => {
  if (record) {
    editingId.value = record.id;
    formState.name = record.name;
    formState.phoneCode = record.phoneCode;
  } else {
    editingId.value = null;
    formState.name = '';
    formState.phoneCode = '';
  }
  modalVisible.value = true;
};

const handleOk = async () => {
  try {
    await formRef.value.validateFields();
    submitting.value = true;
    
    if (editingId.value) {
      await $fetch(`${apiBase}/country/${editingId.value}`, {
        method: 'PATCH',
        body: formState,
      });
      message.success('Country updated');
    } else {
      await $fetch(`${apiBase}/country`, {
        method: 'POST',
        body: formState,
      });
      message.success('Country created');
    }
    
    modalVisible.value = false;
    fetchCountries();
  } catch (error) {
    message.error('Operation failed');
  } finally {
    submitting.value = false;
  }
};

const handleDelete = async (id: number) => {
  try {
    await $fetch(`${apiBase}/country/${id}`, {
      method: 'DELETE',
    });
    message.success('Country deleted');
    fetchCountries();
  } catch (error) {
    message.error('Delete failed');
  }
};
</script>
