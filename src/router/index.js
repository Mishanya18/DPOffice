import { createRouter, createWebHistory } from "vue-router";
import ClientList from "../views/ClientList.vue";

const routes = [
  {
    path: "/",
    redirect: "clients",
  },
  {
    path: "/:domain",
    redirect: "clients",
  },
  {
    path: "/clients",
    name: "clients",
    component: ClientList,
  },
  {
    path: "/partner",
    name: "partner",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/PartnerList.vue"),
  },
  {
    path: "/partner/:partnerName",
    name: "partnerpage",
    component: () => import("../views/PartnerPage.vue"),
  },
  {
    path: "/clientsintest",
    name: "clientsintest",
    component: () => import("../views/ClientsInTest.vue"),
  },
  {
    path: "/clientsintest/:clientCode",
    name: "clientsintestpage",
    component: () => import("../views/ClientInTestPage.vue"),
  },
  {
    path: "/clients/:clientCode",
    name: "clientpage",
    component: () => import("../views/ClientPage.vue"),
  },
  // {
  //   path: "/reports",
  //   name: "reports",
  //   component: () => import("../views/ReportList.vue"),
  // },
  // {
  //   path: "/reports/:clientCode",
  //   name: "reportspage",
  //   component: () => import("../views/ReportPage.vue"),
  // },
  {
    path: "/pagenotfound",
    name: "pagenotfound",
    component: () => import("../views/PageNotFound.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// let is_bitrix_call = "";

// router.beforeEach((to, from, next) => {
//   if (is_bitrix_call != "bitrix.d-platforms.ru") {
//     if (to.query.DOMAIN != "bitrix.d-platforms.ru") {
//       if (to.path == "/pagenotfound") {
//         next();
//       } else {
//         next({ name: "pagenotfound" });
//         console.log("GO AWAY!");
//       }
//     }
//     is_bitrix_call = to.query.DOMAIN;
//     next();
//   } else {
//     next();
//   }
// });

export default router;
