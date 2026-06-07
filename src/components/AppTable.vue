<template>
  <a-table
    :columns="columns"
    :data-source="dataSource"
    :loading="loading"
    :pagination="pagination"
    row-key="id"
    @change="onTableChange"
  >
    <template v-for="slot in slots" :key="slot" #[slot]="{ text, record }">
      <slot :name="slot" :text="text" :record="record" />
    </template>
    <template #bodyCell="{ column, text, record }">
      <slot
        v-if="column.key !== 'action'"
        name="bodyCell"
        :column="column"
        :text="text"
        :record="record"
      >
        <span>{{ text }}</span>
      </slot>
      <slot v-else name="action" :record="record"         :column="column"
        :text="text">
        <a-space>
          <a-button type="link" size="small" @click="$emit('edit', record)"
            >编辑</a-button
          >
          <a-popconfirm
            title="确认删除？"
            @confirm="$emit('delete', record.id)"
          >
            <a-button type="link" danger size="small">删除</a-button>
          </a-popconfirm>
        </a-space>
      </slot>
    </template>
  </a-table>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  columns: { type: Array, required: true },
  dataSource: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  pagination: {
    type: [Object, Boolean],
    default: () => ({
      current: 1,
      pageSize: 10,
      total: 0,
      showSizeChanger: true,
      showTotal: (total) => `共 ${total} 条`,
    }),
  },
});

const emit = defineEmits(["edit", "delete", "change"]);

const slots = computed(() => {
  return props.columns
    .filter((col) => col.slots?.customRender)
    .map((col) => col.slots.customRender);
});

function onTableChange(pagination) {
  emit("change", pagination);
}
</script>
