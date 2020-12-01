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
    sortSelected: {
      name: translate["SORT_NEW"][langGlob],
      type: "newest"
    }
  },
  getters: {
    COMMENTS_LENGTH: state => {
      return state.comments.length;
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
        state.comments = [];
        // console.log("result comment: ", payload.data.data);
        // console.log("Comment: ------ ", state.comments);

        state.comments = payload.data.data;
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
    AJAX({commit}, data) {
      axios
        .post(data.url, data.data)
        .then(function (response) {
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
        .catch(function (error) {
          console.log(error);
        });
    },
    LOGOUT_USER({state, dispatch}) {
      let formData = new FormData();
      formData.append("method", "logout_user");

      dispatch("AJAX", {
        url: state.apiUrl,
        data: formData,
        callback() {
          state.hash = false;
          state.userData = {};
          Cookies.remove("commentus_user_hash");
        }
      });
    },
    LIKE_DISLIKE({state, dispatch}, payload) {
      let formData = new FormData();
      if (payload.type === "dislike") {
        formData.append("method", "dislike");
      } else {
        formData.append("method", "like");
      }
      formData.append("comment_id", payload.id);
      formData.append("commentus_user_id", state.userData.data.user_id);
      formData.append("commentus_user_hash", state.hash);

      dispatch("AJAX", {
        url: state.apiUrl,
        data: formData,
        callback(result) {
          console.log(result);
        }
      });
    },
    GET_DRAFT({state, commit, dispatch}) {
      let method = "get_draft";
      let formData = new FormData();
      formData.append("method", method);
      formData.append("commentus_user_hash", state.hash);
      formData.append("url", location.href);
      formData.append("site_id", state.siteId);

      dispatch("AJAX", {
        url: state.apiUrl,
        data: formData,
        callback({data}) {
          if (data.result !== "false") {
            commit("DRAFT", data.draft);
          }
        }
      });
    },
    SAVE_DRAFT({state, dispatch}, payload) {
      let formData = new FormData();
      formData.append("method", "save_draft");
      formData.append("commentus_user_hash", state.hash);
      formData.append("site_id", state.siteId);
      formData.append("url", location.href);
      formData.append("text", payload.text);
      formData.append("reply_to", payload.replyto);

      dispatch("AJAX", {
        url: state.apiUrl,
        data: formData,
        callback({data}) {
          console.log(data);
        }
      });
    },
    SEND_COMMENT({state, commit, dispatch}, payload) {
      let method = "post_comment";

      payload.append("method", method);
      payload.append("commentus_user_hash", state.hash);
      payload.append("url", location.href);
      payload.append("site_id", state.siteId);

      // let date = new Date();
      // let year = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      // let time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
      //
      // let newmsg = {
      //   id: "62",
      //   date: year + " " + time,
      //   text: payload.get("text"),
      //   reply_to: payload.get("reply_to"),
      //   likes: {
      //     upvote: "0"
      //   },
      //   user_data: state.userData
      // };

      dispatch("AJAX", {
        url: state.apiUrl,
        data: payload,
        callback() {
          dispatch("GET_COMMENT");
        }
      });
    },
    GET_COMMENT({state, commit, dispatch}) {
      let data = new FormData();
      data.append("method", "get_comments");
      data.append("site_id", state.siteId);
      data.append("url", location.origin);
      data.append("sort_by", state.sortSelected.type);

      dispatch("AJAX", {
        url: state.apiUrl,
        data: data,
        callback(response) {
          console.log(response.data);
          commit("GET_COMMENT", response);
        }
      });
    },
    GET_MORE_COMMENT({state, commit, dispatch}) {
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
    GET_COOKIE({state, dispatch, commit}) {
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
        callback({data}) {
          console.log(data);

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
    GET_USER_HASH({state, dispatch, commit}, payload) {
      let formData = new FormData();
      formData.append("method", "get_user_hash");
      formData.append("code", payload.code);
      formData.append("user_id", payload.id);

      dispatch("AJAX", {
        url: state.apiUrl,
        data: formData,
        callback({data}) {
          if (data.result === "true") {
            Cookies.remove("commentus_user_hash");
            Cookies.set("commentus_user_hash", data.commentus_user_hash);
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
