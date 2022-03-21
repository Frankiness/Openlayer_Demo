<template>
  <div id="map" class="map"></div>
</template>

<script setup>
import { onMounted } from "vue"; // vue相关方法
import { Map, View, Feature } from "ol"; // 地图实例方法、视图方法
import { OSM, Cluster, Vector as VectorSource } from "ol/source"; // OSM瓦片【OSM不能在实际开发中使用，因为OSM里中国地图的边界有点问题！！！！
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import { defaults as defaultControls, FullScreen, ScaleLine } from "ol/control";
import Point from "ol/geom/Point";
import "ol/ol.css"; // 地图样式
import { Circle as CircleStyle, Fill, Stroke, Style, Text } from "ol/style";
import { boundingExtent } from "ol/extent";

const tile = new TileLayer({
  source: new OSM(),
});
const view = new View({
  center: [-9101767, 2822912],
  zoom: 1, //地图显示层级
});
let map = null;
let clusters = null;
// icon聚合代码
const createCluster = () => {
  const count = 20000;
  const features = new Array(20000);
  const e = 4500000;
  // 生成点位数组
  // Feature是描述几何性质的的矢量对象
  for (let i = 0; i < count; ++i) {
    const coordinates = [2 * e * Math.random() - e, 2 * e * Math.random() - e];
    features[i] = new Feature(new Point(coordinates));
  }
  const source = new VectorSource({
    features: features,
  });
  // cluster source
  const clusterSource = new Cluster({
    distance: parseInt(50, 10), //点位距离
    // minDistance: parseInt(50, 10),//最小距离
    source: source,
  });
  const styleCache = {};
  // 聚合图层
  clusters = new VectorLayer({
    source: clusterSource,
    // 为每个point指定样式
    style: function (feature) {
      const size = feature.get("features").length;
      let style = styleCache[size];//判断是否已存在样式
      if (!style) {
        style = new Style({
          image: new CircleStyle({
            radius: 10,
            stroke: new Stroke({
              color: "#fff",
            }),
            fill: new Fill({
              color: "#3399CC",
            }),
          }),
          text: new Text({
            text: size.toString(),
            fill: new Fill({
              color: "#fff",
            }),
          }),
        });
        styleCache[size] = style;
      }
      return style;
    },
  });
};

// initial map
const initMap = () => {
  map = new Map({
    controls: defaultControls().extend([new FullScreen(), new ScaleLine()]),
    layers: [tile, clusters],
    target: "map",
    view: view,
  });
};
onMounted(() => {
  createCluster();
  initMap();
});
</script>

<style lang="less" scoped>
.map {
  width: 100%;
 height: 650px;
}
</style>
