import "./global";
import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import translate from "./lang.js";

import "../public/css/main.min.css";

import "url-search-params-polyfill";
import "url-polyfill";
// import Cookies from "js-cookie";

// Get Parameter and add Cookie
let userCode = "commentus_code";
let userHash = "commentus_user_hash";
let userId = "commentus_user_id";
let URLLink = new URL(location.href);
let urlparam = new URLSearchParams(URLLink.search);

if (urlparam.has(userCode)) {
  store
    .dispatch("GET_USER_HASH", {
      code: urlparam.get(userCode),
      id: urlparam.get(userId)
    })
    .then(() => {
      store.dispatch("GET_COOKIE");
      store.dispatch("GET_DRAFT");
    })
    .catch(r => {
      console.log(r);
    });

  urlparam.delete(userCode);
  if (userId) urlparam.delete(userId);

  history.pushState(
    {},
    "",
    location.origin +
      location.pathname +
      decodeURIComponent(urlparam.toString())
  );
} else {
  store.dispatch("GET_COOKIE");
  store.dispatch("GET_DRAFT");
}

Vue.config.productionTip = false;

Vue.filter("translate", name => {
  let lang = store.state.lang;
  return translate[name][lang] || "";
});

new Vue({
  store,
  render: h => h(App)
}).$mount("#commentus_comments_widget");
