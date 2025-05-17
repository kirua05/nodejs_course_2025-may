<script setup>
defineProps({
  items: {
    type: Array,
    required: true
  },
  type: {
    type: String,
    required: true,
    validator: value => ['hero', 'monster'].includes(value)
  }
})

const emit = defineEmits(['edit', 'delete'])
</script>

<template>
  <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
    <div v-for="item in items" :key="item.id" class="p-4 border rounded shadow-sm">
      <h3 class="text-xl font-semibold">{{ item.name }}</h3>

      <!-- 英雄卡片內容 -->
      <template v-if="type === 'hero'">
        <p>等級: {{ item.heroLevel }}</p>
        <p>排名: {{ item.heroRank }}</p>
      </template>

      <!-- 怪物卡片內容 -->
      <template v-if="type === 'monster'">
        <p>危險等級: {{ item.dangerLevel }}</p>
        <p v-if="item.killBy">擊殺者: {{ item.killBy }}</p>
      </template>

      <div class="mt-4 space-x-2">
        <button @click="emit('edit', item)" class="px-4 py-2 text-white bg-blue-500 rounded">
          編輯
        </button>
        <button v-if="type === 'hero'" @click="emit('delete', item.id)" class="px-4 py-2 text-white bg-red-500 rounded">
          刪除
        </button>
      </div>
    </div>
  </div>
</template>