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
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";
import { Draw, Modify, Snap } from "ol/interaction";
import { get } from "ol/proj";
import {
  Control,
  defaults as defaultControls,
  FullScreen,
  OverviewMap,
  ScaleLine,
} from "ol/control";
import "ol/ol.css"; // 地图样式

const tile = new TileLayer({
  source: new OSM(),
});
const extent = get("EPSG:3857").getExtent().slice();
extent[0] += extent[0];
extent[2] += extent[2];
const view = new View({
  center: [-9101767, 2822912],
  zoom: 14,
  extent,
});
const source = new VectorSource();
let map = null;
// 矢量图层，也就是用户可以操作的图层
const vector = new VectorLayer({
  source: source,
  style: new Style({
    // 矢量图层填充色
    fill: new Fill({
      color: "rgba(255, 0, 255, 0.2)",
    }),
    // 线条样式
    stroke: new Stroke({
      color: "#ff0000",
      width: 2,
    }),
    image: new CircleStyle({
      radius: 7,
      fill: new Fill({
        color: "#ffcc33",
      }),
    }),
  }),
});
let draw,
  snap = new Snap({ source: source });
// let textValue = ref("Point");
const options = ref([
  {
    value: "Point",
    label: "点",
  },
  {
    value: "LineString",
    label: "折线",
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

// 绘制
const drawPolygon = (type) => {
  draw = new Draw({
    source: source,
    type: type,
  });
  map.addInteraction(draw);

  map.addInteraction(snap);
};
// 移除绘制事件
const removeInteractions = () => {
  map.removeInteraction(draw);
  map.removeInteraction(snap);
};
// initial map
const initMap = () => {
  map = new Map({
    controls: defaultControls().extend([new FullScreen(), new ScaleLine()]),
    layers: [tile, vector],
    target: "map",
    view: view,
  });
  // 修改模块以及修改后的回调
  const modify = new Modify({ source: source });
  map.addInteraction(modify);
  modify.on("modifyend", function (e) {
    console.log("已修改！");
  });
};
onMounted(() => {
  initMap();
});
</script>

<style lang="less" scoped>
.map {
  width: 100%;
  height: 800px;
}
.selection {
  position: absolute;
  left: 3rem;
  top: 1rem;
  z-index: 1000;
}
</style>
