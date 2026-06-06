<template>
  <a-layout style="min-height: 100vh">
    <a-layout-sider v-model:collapsed="collapsed" collapsible>
      <div class="logo">
        <span v-if="!collapsed">游戏管理后台</span>
        <span v-else>GM</span>
      </div>
      <a-menu
        v-model:selectedKeys="selectedKeys"
        theme="dark"
        mode="inline"
        @click="onMenuClick"
      >
        <a-menu-item key="Game">
          <template #icon>
            <AppstoreOutlined />
          </template>
          游戏管理
        </a-menu-item>
        <a-menu-item key="GameAccount">
          <template #icon>
            <UserOutlined />
          </template>
          游戏账号管理
        </a-menu-item>
        <a-menu-item key="GameDictionary">
          <template #icon>
            <BookOutlined />
          </template>
          游戏字典管理
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0 24px">
        <h3 style="margin: 0">{{ pageTitle }}</h3>
      </a-layout-header>
      <a-layout-content style="margin: 16px">
        <div style="padding: 24px; background: #fff; min-height: 360px; border-radius: 8px">
          <router-view />
        </div>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { AppstoreOutlined, UserOutlined, BookOutlined } from '@ant-design/icons-vue'

const route = useRoute()
const router = useRouter()
const collapsed = ref(false)
const selectedKeys = ref([route.name])

const pageTitle = computed(() => route.meta?.title || '')

watch(
  () => route.name,
  (name) => {
    selectedKeys.value = [name]
  }
)

function onMenuClick({ key }) {
  router.push({ name: key })
}
</script>

<style scoped>
.logo {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
</style>
