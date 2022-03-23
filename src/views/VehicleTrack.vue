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
import { Circle, Fill, Style, Stroke, Icon } from "ol/style";
import { useGeographic } from "ol/proj";
import { getVectorContext } from "ol/render";
import "ol/ol.css"; // 地图样式
import { fromLonLat } from "ol/proj";
import {
  getRotation,
  formatLength,
  getCenterPoint,
} from "../utils/carAnimation";

const tile = new TileLayer({
  source: new OSM(),
});
const view = new View({
  center: [110, 46],
  zoom: 1,
});
const point = new Point([110, 45]);
const source = new VectorSource({
  features: [
    new Feature({
      type: "carMarker",
      geometry: new Point([55.945951, 14.465262]),
    }),
  ],
});
const vector = new VectorLayer({
  source: source,
  style: (feature) => {
    return styles[feature.get("type")];
  },
});
// 定义样式
let styles = Object.freeze({
  route: new Style({
    stroke: new Stroke({
      lineDash: [2, 6, 10],
      width: 4,
      color: [0, 255, 0, 1],
    }),
  }),
  marker: new Style({
    image: new Circle({
      radius: 10,
      stroke: new Stroke({
        color: "#fff",
      }),
      fill: new Fill({
        color: "#3399CC",
      }),
    }),
  }),
  carMarker: new Style({
    image: new Icon({
      rotation: 0,
      src: require("../assets/car.png"),
      imgSize: [20, 36],
    }),
  }),
});
// 建立一个点的layer;
const pointSource = new VectorSource({
  features: [new Feature(point)],
});
const pointLayer = new VectorLayer({
  source: pointSource,
  style: new Style({
    image: new Circle({
      radius: 10,
      stroke: new Stroke({
        color: "#fff",
      }),
      fill: new Fill({
        color: "red",
      }),
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
let shopPopup = ref(false);
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
let carGeometry = null;
let carFeature = null;
// 绘制路线
const drawRoute = () => {
  if (routeGeometry) {
    source.clear();
  }
  routeGeometry = new LineString(routePointArray);
  let route = new Feature({
    type: "route",
    geometry: routeGeometry,
  });
  // 绘制点
  let points = drawPoint();
  let car = drawCar();
  source.addFeatures([route, car, ...points]);
};
//绘制车辆
const drawCar = () => {
  carGeometry = new Point(routeGeometry.getFirstCoordinate());
  let carMarker = new Feature({
    type: "carMarker",
    geometry: carGeometry,
  });
  carFeature = carMarker;
  return carMarker;
};
// 画点
const drawPoint = () => {
  let iconFeatures = [];
  routePointArray.forEach((item) => {
    let _feature = new Feature({
      type: "point",
      geometry: new Point(item),
    });
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
    [55.945951, 14.465262],
    [109.04724, 34.262504],
    [108.580321, 24.076162],
    [140.458983, 22.071209],
    [105.734862, 50.49272],
  ];
  routePointArray = _data.map((item) => {
    // return fromLonLat(item);
    return item;
  });
  getRoutesAll();
  drawRoute();
  changeAnimation();
};
//路径分割
let lastRouteIndex = 0;
let routesAll = [];
let animating = false;
const getRoutesAll = () => {
  let _routesAll = [
    {
      coordinate: routePointArray[0],
    },
  ];
  for (let i = 0, len = routePointArray.length; i < len - 1; i++) {
    const item = routePointArray[i];
    const itemNext = routePointArray[i + 1];
    const rotation = getRotation(...item, ...itemNext);
    let points = getCenterPoint(map, [item, itemNext], 0.1);
    points = points.map((item) => {
      return {
        rotation,
        coordinate: item,
      };
    });
    _routesAll = [..._routesAll, ...points];
  }
  routesAll = _routesAll;
};
// 动画
const changeAnimation = () => {
  animating ? stopAnimation() : startAnimation();
};
// 开始动画
const startAnimation = () => {
  animating = true;
  vector.on("postrender", moveFeature);
  carFeature.setGeometry(null);
};
// 停止动画
const stopAnimation = () => {
  animating = false;
  vector.un("postrender", moveFeature);
  carFeature.setGeometry(carGeometry);
};
// 移动动画
const moveFeature = (event) => {
  // 具体移动动画方法
  const len = routesAll.length;
  if (lastRouteIndex < len - 1) {
    lastRouteIndex++;
  } else {
    lastRouteIndex = 0;
  }
  const current = routesAll[lastRouteIndex];
  carGeometry.setCoordinates(current.coordinate);
  const vectorContext = getVectorContext(event);
  let _style = new Style({
    image: new Icon({
      anchor: [0.5, 0.5],
      rotation: current.rotation,
      src: require("../assets/car.png"),
      imgSize: [2000, 3006],
    }),
  });
  vectorContext.setStyle(_style);
  vectorContext.drawGeometry(carGeometry);
  map.render();
};

let map = null;
// initial map
const initMap = () => {
  useGeographic();
  map = new Map({
    layers: [tile, vector, pointLayer],
    target: "map",
    view: view,
  });
  singleclick();
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
