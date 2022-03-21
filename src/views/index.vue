<template>
  <div class="index_container">
    <a-layout>
      <a-layout-sider>
        <a-menu theme="dark" mode="inline" @click="handleClick">
          <a-menu-item
            :key="item.key"
            v-for="(item, index) in menuList"
            v-model:selectedKeys="item.key"
          >
            <span>{{ item.title }}</span>
          </a-menu-item>
        </a-menu>
      </a-layout-sider>
      <a-layout>
        <a-layout-header
          style="
            background: #fff;
            padding: 12px;
            line-height: 32px;
            font-size: 20px;
          "
        >
          <span class="textTitle">{{ currentText }}</span>
        </a-layout-header>
        <a-layout-content
          :style="{
            margin: '12px 8px',
            padding: '12px',
            background: '#fff',
            minHeight: '280px',
            position: 'relative',
          }"
        >
          <router-view></router-view>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
const selectedKeys = ["BaseMap"];
let menuList = reactive([
  { title: "基础图层", key: "BaseMap" },
  { title: "绘制功能", key: "Interaction" },
  { title: "Icon聚合", key: "Clustered" },
  { title: "矢量几何图形绑定事件", key: "HitDetection" },
]);
let currentText = ref("BaseMap");
const handleClick = (e) => {
  currentText.value = e.key;
  router.push(`/${e.key}`);
};
</script>

<style lang="less" scoped>
.index_container {
  width: 100%;
  height: 100%;
}

.ant-layout {
  height: 100%;
}
</style>