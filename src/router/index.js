import Vue from "vue";
import VueRouter from "vue-router";
import Recommend from "../views/recommend.vue";
import SingerDetail from "../views/singer-detail.vue";
import DiscDetail from "../views/disc-detail.vue";
import RankDetail from '../views/rank-detail'

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/recommend",
  },
  {
    path: "/recommend",
    name: "recommend",
    component: Recommend,
    children: [
      {
        path: ":id",
        component: DiscDetail,
      },
    ],
  },
  {
    path: "/rank",
    name: "rank",
    component: () => import("../views/rank.vue"),
    children: [
      {
        path: ":id",
        component: RankDetail
      }
    ]
  },
  {
    path: "/search",
    name: "search",
    component: () => import("../views/search.vue"),
  },
  {
    path: "/singer",
    name: "singer",
    component: () => import("../views/singer.vue"),
    children: [
      {
        path: ":id",
        component: SingerDetail,
      },
    ],
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
