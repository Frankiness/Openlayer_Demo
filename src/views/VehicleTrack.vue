<template>
  <div id="map" class="map"></div>
  <div id="popup" v-show="shopPopup">
    <div class="info">
      <a-button type="primary" @click="getData">绘制轨迹</a-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"; // vue相关方法
import { Map, View, Feature, Overlay } from "ol"; // 地图实例方法、视图方法
import { OSM, Vector as VectorSource } from "ol/source"; // OSM瓦片【OSM不能在实际开发中使用，因为OSM里中国地图的边界有点问题！！！！
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import { LineString, Point } from "ol/geom";
import { Circle, Fill, Style, Stroke } from "ol/style";
import { useGeographic } from "ol/proj";
import "ol/ol.css"; // 地图样式
import { fromLonLat } from "ol/proj";

const tile = new TileLayer({
  source: new OSM(),
});
const view = new View({
  center: [110, 46],
  zoom: 4,
});
const point = new Point([110, 45]);
const source = new VectorSource({
  // features: [new Feature(point)],
  features: [],
});
const vector = new VectorLayer({
  source: source,
  style: new Style({
    image: new Circle({
      radius: 9,
      fill: new Fill({ color: "red" }),
    }),
  }),
});
let popup = null;
// 气泡
const createPopup = () => {
  const element = document.querySelector("#popup");
  popup = new Overlay({
    element: element,
    positioning: "bottom-center",
    stopEvent: false,
    offset: [0, -10],
  });
  map.addOverlay(popup);
};
let shopPopup = ref(true);
const singleclick = () => {
  // 点击
  map.on("singleclick", (e) => {
    createPopup();
    // 判断是否点击在点上
    let feature = map.forEachFeatureAtPixel(e.pixel, (feature) => feature);

    if (feature) {
      shopPopup.value = true;
      // 设置弹窗位置
      let coordinates = feature.getGeometry().getCoordinates();
      popup.setPosition(coordinates);
    } else {
      shopPopup.value = false;
    }
  });
};
// 绘制路线
let routeGeometry = null;
let routePointArray = null;
const drawRoute = () => {
  if (routeGeometry) {
    source.clear();
  }
  routeGeometry = new LineString(routePointArray);
  let route = new Feature(routeGeometry);
  console.log("route", route);
  // 绘制点
  let points = drawPoint();
  source.addFeatures([route, ...points]);
  // source.addFeatures([route]);
};
// 画点
const drawPoint = () => {
  let iconFeatures = [];
  routePointArray.forEach((item) => {
    let _feature = new Feature(new Point(item));
    let _style = new Style({
      image: new Circle({
        radius: 10,
        stroke: new Stroke({
          color: "#fff",
        }),
        fill: new Fill({
          color: "#3399CC",
        }),
      }),
    });
    _feature.setStyle(_style);
    iconFeatures.push(_feature);
  });
  return iconFeatures;
};
const getData = () => {
  let _data = [
    [108.945951, 34.465262],
    [109.04724, 34.262504],
    [108.580321, 34.076162],
    [110.458983, 35.071209],
    [105.734862, 35.49272],
  ];
  routePointArray = _data.map((item) => {
    return fromLonLat(item);
  });
  drawRoute();
};
let map = null;
// initial map
const initMap = () => {
  // useGeographic();
  map = new Map({
    layers: [tile, vector],
    target: "map",
    view: view,
  });
  // singleclick();
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
#popup {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1000;
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
