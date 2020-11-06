import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import Cookies from "js-cookie";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    apiUrl: "https://commentus.net/api/",
    apiAuth: "https://commentus.net/authorize",
    siteId: commentus_widget.site_id,
    lang: commentus_widget.lang,
    comments: {},
    userLog: {}
  },
  getters: {},
  mutations: {
    GET_COMMENT: (state, payload) => {
      if (payload.result === "false") {
        alert(payload.data);
      } else {
        state.comments = payload.data;
      }
    },
    USER_LOG: (state, payload) => {
      state.userLog = payload.data;
    }
  },
  actions: {
    GET_COMMENT(self) {
      let data = new FormData();
      data.append("method", "get_comments");
      data.append("site_id", 1);
      data.append("url", location.origin);

      axios
        .post(self.state.apiUrl, data)
        .then(function(response) {
          self.commit("GET_COMMENT", response);
        })
        .catch(function (error) {
          alert(error);
        });
    },
    USER_LOG({ state, commit }) {
      let data = new FormData();
      data.append("method", "check_user_login");

      if (Cookies.get("commentus_user_hash")) {
        data.append("check_user_login", Cookies.get("commentus_user_hash"));
      }

      axios
        .post(state.apiUrl, data)
        .then(response => {
          console.log(response.data);
          if(response.data.commentus_user_hash) {
            Cookies.set("commentus_user_hash", response.data.commentus_user_hash, { expires: 7 });
          }
        })
        .catch(error => {
          alert(error);
        });
    }
  },
  modules: {}
});
