<template>
  <div id="map" class="map"></div>
</template>

<script setup>
import { ref, onMounted } from "vue"; // vue相关方法
import { Map, View } from "ol"; // 地图实例方法、视图方法
import {OSM, Vector as VectorSource} from 'ol/source';// OSM瓦片【OSM不能在实际开发中使用，因为OSM里中国地图的边界有点问题！！！！
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import {
  Control,
  defaults as defaultControls,
  FullScreen,
  OverviewMap,
  ScaleLine,
} from "ol/control";
import "ol/ol.css"; // 地图样式

const source = new OSM();
const view = new View({
  center: [-9101767, 2822912],
  zoom: 14,
});
// 缩略图
const overviewMapControl = new OverviewMap({
  className: "ol-overviewmap ol-custom-overviewmap", //自定义样式
  layers: [
    new TileLayer({
      source: source,
    }),
  ],
  collapsed: false,
});
// initial map
const initMap = () => {
  const map = new Map({
    controls: defaultControls().extend([
      new FullScreen(),
      overviewMapControl,
      new ScaleLine(),
    ]),
    layers: [
      new TileLayer({
        source: source,
      }),
    ],
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
  height: 800px;
}
.map:-webkit-full-screen {
  height: 100%;
  margin: 0;
}
.map:-ms-fullscreen {
  height: 100%;
}
.map:fullscreen {
  height: 100%;
}
.map .ol-rotate {
  top: 3em;
}
//缩略图样式

.ol-overviewmap {
  right: 0.1rem;
  bottom: 0.1rem;
}
.map .ol-custom-overviewmap,
.map .ol-custom-overviewmap.ol-uncollapsible {
  // bottom: auto;
  // left: auto;
  right: 0;
  bottom: 0;
  position: absolute;
}

.map .ol-custom-overviewmap:not(.ol-collapsed) {
  border: 1px solid black;
}

.map .ol-custom-overviewmap .ol-overviewmap-map {
  border: none;
  width: 300px;
}

.map .ol-custom-overviewmap .ol-overviewmap-box {
  border: 2px solid red;
}

.map .ol-custom-overviewmap:not(.ol-collapsed) button {
  bottom: auto;
  left: auto;
  right: 1px;
  top: 1px;
}

.map .ol-rotate {
  top: 170px;
  right: 0;
}
</style>
