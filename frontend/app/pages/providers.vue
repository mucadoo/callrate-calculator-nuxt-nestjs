<template>
  <div>
    <div style="margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center">
      <a-typography-title :level="4" style="margin: 0">Providers</a-typography-title>
      <a-button type="primary" @click="showModal()">
        <template #icon><plus-outlined /></template>
        Add Provider
      </a-button>
    </div>

    <a-table :columns="columns" :data-source="providers" :loading="loading" row-key="id">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'plans'">
          {{ record._count?.callingPlans || 0 }}
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
                title="Are you sure delete this provider?"
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
      :title="editingId ? 'Edit Provider' : 'Add Provider'"
      @ok="handleOk"
      :confirm-loading="submitting"
    >
      <a-form :model="formState" layout="vertical" ref="formRef">
        <a-form-item
          label="Name"
          name="name"
          :rules="[{ required: true, message: 'Please input provider name' }]"
        >
          <a-input v-model:value="formState.name" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import { message } from 'ant-design-vue';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons-vue';

const providers = ref([]);
const loading = ref(false);
const modalVisible = ref(false);
const submitting = ref(false);
const editingId = ref<number | null>(null);
const formRef = ref();

const formState = reactive({
  name: '',
});

const config = useRuntimeConfig();
const apiBase = config.public.apiBase;

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id' },
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Plans Count', key: 'plans' },
  { title: 'Action', key: 'action' },
];

const fetchProviders = async () => {
  loading.value = true;
  try {
    providers.value = await $fetch(`${apiBase}/provider`);
  } catch (error) {
    message.error('Failed to fetch providers');
  } finally {
    loading.value = false;
  }
};

onMounted(fetchProviders);

const showModal = (record?: any) => {
  if (record) {
    editingId.value = record.id;
    formState.name = record.name;
  } else {
    editingId.value = null;
    formState.name = '';
  }
  modalVisible.value = true;
};

const handleOk = async () => {
  try {
    await formRef.value.validateFields();
    submitting.value = true;
    
    if (editingId.value) {
      await $fetch(`${apiBase}/provider/${editingId.value}`, {
        method: 'PATCH',
        body: formState,
      });
      message.success('Provider updated');
    } else {
      await $fetch(`${apiBase}/provider`, {
        method: 'POST',
        body: formState,
      });
      message.success('Provider created');
    }
    
    modalVisible.value = false;
    fetchProviders();
  } catch (error) {
    message.error('Operation failed');
  } finally {
    submitting.value = false;
  }
};

const handleDelete = async (id: number) => {
  try {
    await $fetch(`${apiBase}/provider/${id}`, {
      method: 'DELETE',
    });
    message.success('Provider deleted');
    fetchProviders();
  } catch (error) {
    message.error('Delete failed');
  }
};
</script>
