import { createRouter, createWebHistory } from "vue-router";
import ClientList from "../views/ClientList.vue";
// import PartnerList from '../views/PartnerList.vue'

const routes = [
  {
    path: "/",
    redirect: "/clients",
  },
  {
    path: "/clients",
    name: "Clients",
    component: ClientList,
  },
  {
    path: "/partner",
    name: "Partner",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/PartnerList.vue"),
  },
  {
    path: "/service",
    name: "Service",
    component: () => import("../views/ServiceList.vue"),
  },
  {
    path: "/clients/:clientCode",
    name: "ClientPage",
    component: () => import("../views/ClientPage.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
