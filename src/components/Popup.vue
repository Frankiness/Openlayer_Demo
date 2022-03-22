<template>
  <div>
    <!-- 弹框 -->
    <div id="popup" class="popup" v-show="true">
      <div class="info">id:{{ identity }}</div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, toRefs, watch } from "vue";
let props = defineProps(["identity"]);
let { identity } = toRefs(props);
</script>

<style lang="less" scoped>
.popup {
  width: 200px;
  background-color: white;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 0 15px rgb(177, 177, 177);
  .info {
    font-size: 18px;
    text-align: center;
  }
}
</style>