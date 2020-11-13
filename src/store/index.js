import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import Cookies from "js-cookie";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    apiUrl: "https://commentus.net/api/",
    apiAuth: "https://commentus.net/authorize",
    siteId: commentus_widget[0].site_id,
    lang: commentus_widget[0].lang,
    theme: commentus_widget[0].theme,
    comments: [],
    hash: false,
    userData: {},
    page: 1,
    pageNotFinish: true,
    draft: false
  },
  getters: {},
  mutations: {
    LOGOUT_USER: state => {
      state.hash = false;
      state.userData = {};
    },
    GET_COMMENT: (state, payload) => {
      if (payload.result === "false") {
        alert(payload.data);
      } else {
        state.comments = [...payload.data.data];
      }
    },
    GET_MORE_COMMENT: (state, payload) => {
      if (payload.result === "false") {
        alert(payload.data);
      } else {
        state.comments = state.comments.concat(payload.data);
      }
    },
    SET_USER_DATA: (state, payload) => {
      state.userData = payload;
    },
    DRAFT: (state, payload) => {
      state.draft = payload;
    }
  },
  actions: {
    AJAX({ commit }, data) {
      axios
        .post(data.url, data.data)
        .then(function(response) {
          if (response.data.error || response.data.result === "false") {
            if (response.data.error) {
              alert(response.data.error);
              return false;
            }

            if (response.data.data) {
              alert(response.data.data);
              return false;
            }
          }

          if (data.callback) {
            data.callback(response);
          } else {
            return true;
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    LIKE_DISLIKE({ state, dispatch }, payload) {
      payload.append("method", "like");
      payload.append("comment_id", payload.id);
      payload.append("commentus_user_id", state.userData.data.user_id);
      payload.append("commentus_user_hash", state.hash);

      dispatch("AJAX", {
        url: state.apiUrl,
        data: payload,
        callback(result) {
          console.log(result);
        }
      });
    },
    GET_DRAFT({ state, commit, dispatch }) {
      let method = "get_draft";
      let formData = new FormData();
      formData.append("method", method);
      formData.append("commentus_user_hash", state.hash);
      formData.append("url", location.href);
      formData.append("site_id", state.siteId);

      dispatch("AJAX", {
        url: state.apiUrl,
        data: formData,
        callback({ data }) {
          if (data.result !== "false") {
            commit("DRAFT", data.draft);
          }
        }
      });
    },
    SEND_COMMENT({ state, commit, dispatch }, payload) {
      let method = "post_comment";

      payload.append("method", method);
      payload.append("commentus_user_hash", state.hash);
      payload.append("url", location.href);
      payload.append("site_id", state.siteId);

      dispatch("AJAX", {
        url: state.apiUrl,
        data: payload,
        callback({ data }) {
          console.log(data);
        }
      });
    },
    GET_COMMENT({ state, commit, dispatch }) {
      let data = new FormData();
      data.append("method", "get_comments");
      data.append("site_id", state.siteId);
      data.append("url", location.origin);

      dispatch("AJAX", {
        url: state.apiUrl,
        data: data,
        callback(response) {
          commit("GET_COMMENT", response);
        }
      });
    },
    GET_MORE_COMMENT({ state, commit, dispatch }) {
      if (!state.pageNotFinish) return false;

      let formData = new FormData();
      formData.append("method", "get_comments");
      formData.append("site_id", state.siteId);
      formData.append("url", location.origin);

      state.page = state.page + 1;
      formData.append("page", state.page);

      dispatch("AJAX", {
        url: state.apiUrl,
        data: formData,
        callback(response) {
          if (!response.data.data.length) {
            state.page = state.page - 1;
            state.pageNotFinish = false;
          } else {
            commit("GET_MORE_COMMENT", response.data);
          }
        }
      });
    },
    GET_COOKIE({ state, dispatch, commit }) {
      let hash = "commentus_user_hash";
      let formData = new FormData();
      formData.append("method", "check_user_login");

      if (Cookies.get(hash)) {
        state.hash = Cookies.get(hash);
        formData.append(hash, Cookies.get(hash));
      }

      // console.log("Call GET__COOKIE");
      // console.log("method: ", formData.get("method"));
      // console.log("hash: ", formData.get("commentus_user_hash"))

      dispatch("AJAX", {
        url: state.apiUrl,
        data: formData,
        callback({ data }) {
          console.log(data);
          
          if (!Cookies.get(hash)) {
            if (data.result === "false") {
              Cookies.set(hash, data[hash], {
                expires: 7
              });
              dispatch("GET_COOKIE");
            }
          }

          if (data.result === "true") {
            commit("SET_USER_DATA", data);
          }
        }
      });
    }
  },
  modules: {}
});
