<template>
  <div class="selection">
    <a-space>
      <a-select
        ref="select"
        style="width: 120px"
        :options="options"
        @change="handleChange"
      ></a-select>
    </a-space>
  </div>
  <div id="map" class="map"></div>
</template>

<script setup>
import { ref, onMounted } from "vue"; // vue相关方法
import { Map, View } from "ol"; // 地图实例方法、视图方法
import { OSM, Vector as VectorSource } from "ol/source"; // OSM瓦片【OSM不能在实际开发中使用，因为OSM里中国地图的边界有点问题！！！！
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import { Draw } from "ol/interaction";
import "ol/ol.css"; // 地图样式

const tile = new TileLayer({
  source: new OSM(),
});
const view = new View({
  center: [-11000000, 4600000],
  zoom: 4,
});
const source = new VectorSource({ wrapX: false });
const vector = new VectorLayer({
  source: source,
});
const options = ref([
  {
    value: "LineString",
    label: "线",
  },
  {
    value: "Polygon",
    label: "多边形",
  },
  {
    value: "Circle",
    label: "圆",
  },
]);

// select draw type
const handleChange = (value) => {
  removeInteractions();
  drawPolygon(value);
};
let map = null,
  draw = null;
// 绘制
const drawPolygon = (type) => {
  draw = new Draw({
    source: source,
    type: type,
    freehand: true,
  });
  map.addInteraction(draw);
};
// 移除绘制事件
const removeInteractions = () => {
  map.removeInteraction(draw);
};
// initial map
const initMap = () => {
  map = new Map({
    layers: [tile, vector],
    target: "map",
    view: view,
  });
};
onMounted(() => {
  initMap();
});
</script>

<style lang="less" scoped>
.map {
  width: 100%;
  height: 650px;
}
.selection {
  position: absolute;
  left: 4rem;
  top: 1.5rem;
  z-index: 1000;
}
</style>
