import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import Cookies from "js-cookie";
import translate from "@/lang";

Vue.use(Vuex);
let langGlob = ["ru", "en"].includes(commentus_widget[0].lang)
  ? commentus_widget[0].lang
  : "en";
export default new Vuex.Store({
  state: {
    apiUrl: "https://commentus.net/api/api.php",
    apiAuth: "https://commentus.net/authorize",
    siteId: commentus_widget[0].site_id,
    lang: langGlob,
    theme: commentus_widget[0].theme,
    comments: [],
    hash: false,
    userData: {},
    page: 1,
    pageNotFinish: true,
    draft: false,
    openPopup: "",
    totalComments: 0,
    popupShareLink: "",
    sortSelected: {
      name: translate["SORT_NEW"][langGlob],
      type: "newest"
    },
    loadingComment: false,
    globalTextareaFocused: false
  },
  getters: {
    COMMENTS_LENGTH: state => {
      return state.comments.length;
    },
    SORT_COMMENTS: state => {
      let arr = Array.from(state.comments) || [];

      function nestedItems(id, arr) {
        return arr.filter((item, index) => {
          if (Number(id) === Number(item.reply_to)) {
            delete arr[index];
            return item;
          }
        });
      }

      function nestedRecursive(item) {
        let nested = nestedItems(item.id, arr);

        nested.forEach(el => {
          nestedRecursive(el);
        });

        if (nested.length) item.subcomment = nested;
        return item;
      }

      arr.forEach(item => {
        nestedRecursive(item, arr);
      });

      let newArr = arr.filter(item => {
        return Number(item.reply_to) !== 0 ? false : item;
      });

      // console.log(newArr);
      // console.log("newArr: ", newArr);
      return newArr.length ? newArr : [];
    }
  },
  mutations: {
    CHANGE_SORT_SELECTED: (state, payload) => {
      state.sortSelected = payload;
    },
    TOGGLE_POPUP: (state, payload) => {
      state.openPopup = payload;
    },
    GET_COMMENT: (state, payload) => {
      if (payload.result === "false") {
        alert(payload.data);
      } else {
        state.loadingComment = true;
        state.comments = [];
        state.totalComments = payload.data.total_comments ?? 0;

        setTimeout(() => {
          state.comments = payload.data.data;

          setTimeout(() => {
            state.loadingComment = false;
          }, 500);
        });
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
      return axios
        .post(data.url, data.data)
        .then(response => {
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
          }

          return new Promise(resolve => resolve(response));
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    LOGOUT_USER({ state, dispatch }) {
      let formData = new FormData();
      formData.append("method", "logout_user");

      dispatch("AJAX", {
        url: state.apiUrl,
        data: formData,
        callback() {
          state.hash = false;
          state.userData = {};
          Cookies.remove("commentus_user_hash");
          dispatch("GET_COOKIE");
        }
      });
    },
    LIKE_DISLIKE({ state, dispatch }, payload) {
      let formData = new FormData();
      if (payload.type === "dislike") {
        formData.append("method", "dislike");
      } else {
        formData.append("method", "like");
      }
      formData.append("comment_id", payload.id);
      formData.append("commentus_user_id", state.userData.data.user_id);
      formData.append("commentus_user_hash", state.hash);

      return dispatch("AJAX", {
        url: state.apiUrl,
        data: formData
      }).then(response => {
        // console.log(response)
        return response;
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
          // console.log("GET_DRAFT: ", data);
          if (data.result !== "false") {
            commit("DRAFT", data);
          }
        }
      });
    },
    SAVE_DRAFT({ state, dispatch }) {
      let formData = new FormData();
      // console.log("test SAVE_DRAFT: ", state.globalTextareaFocused)
      if (!state.globalTextareaFocused.text) return false;

      let userName = state.globalTextareaFocused.name ?? "";
      let text = state.globalTextareaFocused.text;
      let textSlice = text.slice(userName.length, text.length).trim();

      formData.append("method", "save_draft");
      formData.append("commentus_user_hash", state.hash);
      formData.append("site_id", state.siteId);
      formData.append("url", location.href);
      formData.append("text", textSlice);
      formData.append("reply_to", state.globalTextareaFocused.replyto);

      return dispatch("AJAX", {
        url: state.apiUrl,
        data: formData
      });
    },
    SEND_COMMENT({ state, commit, dispatch }, payload) {
      let method = "post_comment";
      payload.append("method", method);
      console.log(Cookies.get("commentus_user_hash"), state.hash);
      payload.append("commentus_user_hash", Cookies.get("commentus_user_hash"));
      payload.append("url", location.href);
      payload.append("site_id", state.siteId);

      dispatch("AJAX", {
        url: state.apiUrl,
        data: payload,
        callback(log) {
          if (log.data.result === "true") {
            state.draft = {
              draft: "",
              result: "true"
            };
          }

          dispatch("GET_COMMENT");
        }
      });
    },
    GET_COMMENT({ state, commit, dispatch }) {
      let data = new FormData();
      data.append("method", "get_comments");
      data.append("site_id", state.siteId);
      data.append("url", location.href);
      data.append("sort_by", state.sortSelected.type);

      if (Cookies.get("commentus_user_hash"))
        data.append("commentus_user_hash", Cookies.get("commentus_user_hash"));

      dispatch("AJAX", {
        url: state.apiUrl,
        data: data,
        callback(response) {
          // console.log(response);
          commit("GET_COMMENT", response);
        }
      });
    },
    GET_MORE_COMMENT({ state, commit, dispatch }) {
      if (!state.pageNotFinish) return false;

      let formData = new FormData();
      formData.append("method", "get_comments");
      formData.append("site_id", state.siteId);
      formData.append("url", location.href);

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
      dispatch("AJAX", {
        url: state.apiUrl,
        data: formData,
        callback({ data }) {
          console.log("GET_COOKIE response: ", data, data[hash], data.result)
          if (!Cookies.get(hash)) {
            if (data.result === "false") {
              Cookies.set(hash, data[hash]);
              dispatch("GET_COOKIE");
            }
          }

          if (data.result === "true") {
            commit("SET_USER_DATA", data);
          }
        }
      });
    },
    GET_USER_HASH({ state, dispatch, commit }, payload) {
      let formData = new FormData();
      formData.append("method", "get_user_hash");
      formData.append("code", payload.code);
      formData.append("user_id", payload.id);

      dispatch("AJAX", {
        url: state.apiUrl,
        data: formData,
        callback({ data }) {
          console.log("GET_USER_HASH: ", data);
          if (data.result === "true") {
            Cookies.remove("commentus_user_hash");
            Cookies.set("commentus_user_hash", data.commentus_user_hash);
            state.hash = data.commentus_user_hash;
            commit("SET_USER_DATA", data);
          }
        }
      });

      return {
        result: true
      };
    }
  },
  modules: {}
});
