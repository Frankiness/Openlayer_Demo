import { createRouter, createWebHashHistory } from "vue-router";
import BaseMap from "../views/BaseMap.vue";
const routes = [
  {
    path: "/",
    name: "默认页面",
    redirect: "/BaseMap",
  },
  {
    path: "/BaseMap",
    name: "BaseMap",
    component: () => import("../views/BaseMap.vue"),
  },
  {
    path: "/Interaction",
    name: "Interaction",
    component: () => import("../views/Interaction.vue"),
  },
  {
    path: "/Clustered",
    name: "Clustered",
    component: () => import("../views/ClusteredFeature.vue"),
  },
  {
    path: "/HitDetection",
    name: "HitDetection",
    component: () => import("../views/CustomHitDetection.vue"),
  },
  {
    path: "/FreehandDrawing",
    name: "FreehandDrawing",
    component: () => import("../views/FreehandDrawing.vue"),
  },
  {
    path: "/VehicleTrack",
    name: "VehicleTrack",
    component: () => import("../views/VehicleTrack.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
