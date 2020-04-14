import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VCA from "@vue/composition-api";
import LazyLoad from "vue-lazyload";
import "./assets/stylus/index.styl";

Vue.config.productionTip = false;
Vue.use(VCA);
Vue.use(LazyLoad, {
  loading: require("./assets/image/default.png"),
});

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
