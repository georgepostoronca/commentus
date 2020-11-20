import "./global";
import Vue from "vue";
import App from "./App.vue";
import store from "./store";

import 'url-search-params-polyfill';
import 'url-polyfill';
import Cookies from "js-cookie";

// Get Parameter and add Cookie
let userHash = "commentus_user_hash";
let userId = "commentus_user_id";
let URLLink = new URL(location.href);
console.log(URLLink.search);
let urlparam = new URLSearchParams(URLLink.search);

console.log("hash: ", urlparam.get(userHash));
console.log("id: ", urlparam.get(userId));
console.log("if hash: ", urlparam.has(userHash));

if (urlparam.has(userHash)) {
  Cookies.remove(userHash);
  Cookies.set(userHash, urlparam.get(userHash));
  urlparam.delete(userHash);
  urlparam.delete(userId);
  console.log("URL: ", decodeURIComponent(urlparam.toString()))
  history.pushState({}, "", location.origin + decodeURIComponent(urlparam.toString()));
}

Vue.config.productionTip = false;

new Vue({
  store,
  render: h => h(App)
}).$mount("#commentus_comments_widget");
