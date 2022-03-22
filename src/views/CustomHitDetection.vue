<template>
  <div id="map" class="map"></div>
</template>

<script setup>
import { onMounted } from "vue"; // vue相关方法
import { Map, View, Feature } from "ol"; // 地图实例方法、视图方法
import { OSM, Vector as VectorSource } from "ol/source"; // OSM瓦片【OSM不能在实际开发中使用，因为OSM里中国地图的边界有点问题！！！！
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import { defaults as defaultControls } from "ol/control";
import { fromLonLat } from "ol/proj";
import { Circle } from "ol/geom";
import "ol/ol.css"; // 地图样式
import { Style } from "ol/style";

const tile = new TileLayer({
  source: new OSM(),
});
const view = new View({
  center: [-9101767, 2822912],
  zoom: 1, //地图显示层级
});

let map = null;

const columbusCircleCoords = fromLonLat([-73.98189, 40.76805]);
const labelTextStroke = "rgba(120, 120, 120, 1)";
const labelText = "Columbus Circle";

let pointerOverFeature = null;

const renderLabelText = (ctx, x, y, stroke) => {
  ctx.fillStyle = "rgba(255,0,0,1)";
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 1;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `bold 30px verdana`;
  ctx.filter = "drop-shadow(7px 7px 2px #e81)";
  ctx.fillText(labelText, x, y);
  ctx.strokeText(labelText, x, y);
};
// 构建一个circle
const circleFeature = new Feature({
  geometry: new Circle(columbusCircleCoords, 50),
});
const vectorLayer = new VectorLayer({
  source: new VectorSource({
    features: [circleFeature],
  }),
});
// circle的颜色
circleFeature.set("label-color", labelTextStroke);

circleFeature.setStyle(
  new Style({
    renderer(coordinates, state) {
      const [[x, y], [x1, y1]] = coordinates;
      const ctx = state.context;
      const dx = x1 - x;
      const dy = y1 - y;
      const radius = Math.sqrt(dx * dx + dy * dy);

      const innerRadius = 0;
      const outerRadius = radius * 1.4;

      const gradient = ctx.createRadialGradient(
        x,
        y,
        innerRadius,
        x,
        y,
        outerRadius
      );
      gradient.addColorStop(0, "rgba(255,0,0,0)");
      gradient.addColorStop(0.6, "rgba(255,0,0,0.2)");
      gradient.addColorStop(1, "rgba(255,0,0,0.8)");
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI, true);
      ctx.fillStyle = gradient;
      ctx.fill();
      ctx.strokeStyle = "rgba(255,0,0,1)";
      ctx.stroke();

      renderLabelText(ctx, x, y, circleFeature.get("label-color"));
    },
    hitDetectionRenderer(coordinates, state) {
      const [x, y] = coordinates[0];
      const ctx = state.context;
      renderLabelText(ctx, x, y, circleFeature.get("label-color"));
    },
  })
);
// initial map
const initMap = () => {
  map = new Map({
    controls: defaultControls(),
    layers: [tile, vectorLayer],
    target: "map",
    view: view,
  });
  map.on("pointermove", (evt) => {
    const featureOver = map.forEachFeatureAtPixel(evt.pixel, (feature) => {
      feature.set("label-color", "rgba(255,255,255,1)");
      return feature;
    });

    if (pointerOverFeature && pointerOverFeature != featureOver) {
      pointerOverFeature.set("label-color", labelTextStroke);
    }
    pointerOverFeature = featureOver;
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
</style>
