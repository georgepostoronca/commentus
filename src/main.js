import "./global";
import Vue from "vue";
import App from "./App.vue";
import store from "./store";

import axios from "axios";

// fetch("https://commentus.net/api/", {
//   method: 'POST',
//   credentials: 'include',
//   body: {
//     method: "get_comments",
//     site_id: "12345",
//     url: "https://yandex.ru/page"
//   },
//   headers: {
//     'Content-Type': 'application/json'
//   }
// })

// let data = {
//   method: "get_comments",
//   site_id: 12345,
//   url: location.origin
// };

let data = new FormData();
data.append("method", "get_comments");
data.append("site_id", 1);
data.append("url", location.origin);

axios
  .post("https://commentus.net/api/", data)
  .then(function(response) {
    console.log(response.data);
  })
  .catch(function(error) {
    console.log(error);
  });


Vue.config.productionTip = false;

new Vue({
  store,
  render: h => h(App)
}).$mount("#commentus_comments_widget");
