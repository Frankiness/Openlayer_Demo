import { createRouter, createWebHashHistory } from "vue-router";
import BaseMap from "../views/BaseMap.vue";
const routes = [
  {
    path: "/",
    name: "BaseMap",
    component: BaseMap,
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
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
