import { createRouter, createWebHashHistory } from "vue-router";
import Index from "../views/index.vue";
import Interaction from "../views/Interaction.vue";
const routes = [
  {
    path: "/",
    name: "index",
    component: Index,
  },
  {
    path: "/Interaction",
    name: "Interaction",
    component: () => import("../views/Interaction.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
