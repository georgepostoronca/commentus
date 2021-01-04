<template>
  <div id="app">
    <!-- при открытии всплывающего окна к элементу "wdg" добавлять "wdg--popup-active" -->
    <!-- ночной режим задается классом "wdg--night" -->

<!--    <button @click="saveDraft">Save Draft</button>-->
<!--    <button @click="getDraft">Get Draft</button>-->
    <div
      class="wdg"
      ref="wdgRoot"
      :class="[{ 'wdg--popup-active': popup }, theme]"
    >
      <div class="wdg__wrap">
        <div class="wdg-top">
          <div class="wdg-title">
            {{ messagesLength }}
            <!--            page: {{ commentPage }}-->
          </div>

          <div class="wdg-main-sort">
            <div
              class="wdg-custom_select"
              v-click-outside="hideSelect"
              :class="{ active: sortOpen }"
            >
              <input type="hidden" name="#" />
              <div
                class="wdg-custom_select_title"
                @click="sortOpen = !sortOpen"
              >
                <p>{{ getSortSelected.name }}</p>
              </div>

              <div class="wdg-custom_select_dropdown">
                <p
                  v-for="(item, index) in sortItem"
                  :key="index"
                  :data-index="index"
                  @click="commentsSort(index)"
                >
                  {{ item.name }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!--        <button @click="togglePopup('share')">Popup Share</button>-->
        <!--        <button @click="togglePopup('email')">Popup Email</button>-->
        <!--        <button @click="togglePopup('login')">Popup Login</button>-->
        <!--        <span>{{ $store.state.openPopup }}</span>-->

        <!--        <span>{{ $store.state.hash }}</span>-->
        <!--        <br />-->
        <!--        <span>{{ $store.state.userData }}</span>-->

        <Message
          type="root"
          :textarea="'PLACEHOLDER_COMMENT' | translate"
          :replyto="0"
          :draft="getDraftRoot"
        />

        <div class="wdg-user" v-if="userData">
          <span class="wdg-user__ava">
            <img :src="userData.avatar" alt="IMG" />
          </span>
          <span class="wdg-user__text">{{ "YOU_LOGED" | translate }} {{ userData.name }}.</span>
          <button class="wdg-user__exit" @click="logoutUser">{{ "LOGOUT" | translate }}</button>
        </div>

        <div class="wdg-notify">
          <span class="wdg-notify__icon wdg-icon-info"></span>
          {{ "INFO_TEXT" | translate }}
          <a href="">{{ "MORE_DETAILS" | translate }}</a>
        </div>

        <div class="wdg-comments__wrap" :class="{ loading: loadingComment }">
          <!--          v-if="commentsArray.length"-->
          <div class="wdg-comments__loading">
            <div class="loader"></div>
          </div>

          <div class="wdg-comments">
            <Comment
              v-for="(item, index) in commentsArray"
              :key="index"
              :data="item"
              :index="index"
              :reply="'PLACEHOLDER_REPLY' | translate"
              :replyto="Number(0)"
              :idShare="Number(item.id)"
              :level="0"
              @shareData="popupShare($event)"
            >
<!--              <Comment-->
<!--                v-for="(val, index) in item.subcomment"-->
<!--                :key="Number(val.id)"-->
<!--                :data="item.subcomment[index]"-->
<!--                :reply="'PLACEHOLDER_REPLY' | translate"-->
<!--                :replyto="Number(item.id)"-->
<!--                @shareData="popupShare($event)"-->
<!--              >-->
<!--                <Comment-->
<!--                  v-for="(val2, index2) in val.subcomment"-->
<!--                  :key="Number(val2.id)"-->
<!--                  :data="val.subcomment[index2]"-->
<!--                  :reply="'PLACEHOLDER_REPLY' | translate"-->
<!--                  :replyto="Number(val.subcomment.id)"-->
<!--                  @shareData="popupShare($event)"-->
<!--                >-->
<!--                  {{ val2.subcomment }}-->
<!--                  <Comment-->
<!--                    v-for="(val3, index3) in val2.subcomment"-->
<!--                    :key="Number(val3.id)"-->
<!--                    :data="val.subcomment[index3]"-->
<!--                    :reply="'PLACEHOLDER_REPLY' | translate"-->
<!--                    :replyto="Number(va2.subcomment.id)"-->
<!--                    @shareData="popupShare($event)"-->
<!--                  ></Comment>-->
<!--                </Comment>-->
<!--                &lt;!&ndash;                  :ifreply="false"&ndash;&gt;-->
<!--              </Comment>-->
            </Comment>
          </div>

<!--          commentsArray.length-->
          <button
            class="wdg-comments__more"
            v-if="pageNotFinish"
            v-show="totalComments"
            @click="moreComment"
          >
            {{ "SHOW_MORE" | translate }}
          </button>
        </div>
      </div>

      <Popup v-bind:popup="popup" :shareLink="popupShareLink" />
    </div>
    <!-- end wdg -->
  </div>
</template>

<script>
import Message from "@/components/Message";
import Comment from "@/components/Comment";
import Popup from "@/components/Popup";

import ClickOutside from "vue-click-outside";
import translate from "@/lang";

export default {
  name: "App",
  components: {
    Popup,
    Comment,
    Message
  },
  data() {
    return {
      root: this.$refs.wdgRoot,
      sortOpen: false,
      sortItem: [
        {
          name: translate["SORT_NEW"][this.$store.state.lang],
          type: "newest"
        },
        {
          name: translate["SORT_POPULARITY"][this.$store.state.lang],
          type: "popularity"
        },
        {
          name: translate["SORT_OLD"][this.$store.state.lang],
          type: "oldest"
        }
      ]
    };
  },
  computed: {
    popupShareLink: e => {
      return e.$store.state.popupShareLink;
    },
    totalComments: e => {
      let total = e.$store.state.totalComments;
      let length = e.commentLength;

      return length < total;
    },
    getDraftRoot: e => {
      let draft = e.$store.state.draft;
      return draft && Number(0) === Number(draft.reply_to)
        ? e.$store.state.draft.draft
        : false;
    },
    loadingComment: e => {
      return e.$store.state.loadingComment;
    },
    messagesLength: e => {
      // console.log(e.$store.state.comments);
      let len = e.commentLength;
      let lang = e.$store.state.lang;
      let prep = "";

      if (lang === "ru") {
        switch (len) {
          case 1:
            prep = "ий";
            break;
          case 2:
            prep = "я";
            break;
          case 3:
            prep = "я";
            break;
          case 4:
            prep = "я";
            break;
          default:
            prep = "ев";
            break;
        }
      }

      if (lang === "en") {
        if (len > 1) {
          prep = "s";
        }
      }

      return `${len} ${translate["TEXT_COMMENT"][lang]}${prep}`;
    },
    getSortSelected: e => {
      return e.$store.state.sortSelected;
    },
    popup() {
      return this.$store.state.openPopup;
    },
    commentLength: e => {
      // console.log(e.$store.state.comments, e.$store.state);
      return e.$store.state.comments.length;
    },
    theme: e => {
      if (e.$store.state.theme === "dark") {
        return "wdg--night";
      } else {
        return "";
      }
    },
    commentPage: e => {
      return e.$store.state.page;
    },
    pageNotFinish: e => {
      return e.$store.state.pageNotFinish;
    },
    commentsArray: e => {
      return e.$store.getters["SORT_COMMENTS"];
    },
    userData: e => {
      return e.$store.state.userData.data;
    }
  },
  methods: {
    saveDraft() {
      // this.$store.state.globalTextareaFocused = {
      //   text: "DRAFT:::",
      //   replyto: 0
      // };

      this.$store.dispatch("SAVE_DRAFT");
    },
    getDraft() {
      this.$store.dispatch("GET_DRAFT");
    },
    commentsSort(index) {
      this.$store.commit("CHANGE_SORT_SELECTED", this.sortItem[index]);
      this.sortOpen = false;

      // console.log("sortItem: ", this.sortItem[index].type);
      // console.log("state sortSelected: ", this.$store.state.sortSelected.type);

      this.$store.dispatch("GET_COMMENT");
    },
    togglePopup(e) {
      this.$store.commit("TOGGLE_POPUP", e);
    },
    popupShare(e) {
      this.$store.state.popupShareLink = e;
      // console.log("popupShareLink: ", this.$store.state.popupShareLink)
    },
    hideSelect() {
      this.sortOpen = false;
    },
    moreComment() {
      this.$store.dispatch("GET_MORE_COMMENT");
    },
    logoutUser() {
      this.$store.dispatch("LOGOUT_USER");
    }
  },
  created() {
    this.$store.dispatch("GET_COMMENT");
    // this.$store.dispatch("GET_COOKIE");
    // this.$store.dispatch("GET_DRAFT");
  },
  directives: {
    ClickOutside
  },
  watch: {
    popup(newVal) {
      if (newVal === "") {
        this.$store.state.popupShareLink = "";
      }
    }
  }
};
</script>

<style lang="scss">
button {
  padding-left: 0;
  padding-right: 0;
}

.wdg {
  padding: 0;
}

.wdg-custom_select {
  user-select: none;
}

.wdg-comment__ava {
  overflow: hidden;
}

button.wdg-user__exit {
  border: 0;
  font-size: 14px;
  text-decoration: underline;
  background-color: transparent;

  &:hover {
    text-decoration: none;
  }
}

.wdg-comments__wrap {
  position: relative;

  &.loading {
    height: 400px;
    overflow: hidden;

    .wdg-comments__loading {
      opacity: 1;
      height: inherit;
      transform: translateZ(0) scale(1);
    }

    .wdg-comments {
      opacity: 0;
    }

    .wdg-comments__more {
      opacity: 0;
    }
  }

  .wdg-comments {
    opacity: 1;
    transition: 0s;
  }

  .wdg-comments__loading {
    opacity: 0;
    transition: 0.2s;
    //height: 0;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    transform: translateZ(0) scale(0);

    .loader {
      transition: 0.01s;
    }
  }

  .wdg-comments__more {
    transition: 0.2s;
    opacity: 1;
  }
}

.loader {
  font-size: 10px;
  margin: 50px auto;
  text-indent: -9999em;
  width: 5em;
  height: 5em;
  border-radius: 50%;
  background: #ffffff;
  background: -moz-linear-gradient(
    left,
    #ffffff 10%,
    rgba(255, 255, 255, 0) 42%
  );
  background: -webkit-linear-gradient(
    left,
    #ffffff 10%,
    rgba(255, 255, 255, 0) 42%
  );
  background: -o-linear-gradient(left, #ffffff 10%, rgba(255, 255, 255, 0) 42%);
  background: -ms-linear-gradient(
    left,
    #ffffff 10%,
    rgba(255, 255, 255, 0) 42%
  );
  background: linear-gradient(
    to right,
    #ffffff 10%,
    rgba(255, 255, 255, 0) 42%
  );
  position: relative;
  -webkit-animation: load3 1.4s infinite linear;
  animation: load3 1.4s infinite linear;
  -webkit-transform: translateZ(0);
  -ms-transform: translateZ(0);
  transform: translateZ(0);

  filter: invert(100);

  &:before {
    width: 50%;
    height: 50%;
    background: #ffffff;
    border-radius: 100% 0 0 0;
    position: absolute;
    top: 0;
    left: 0;
    content: "";
  }

  &:after {
    background: #000;
    width: 75%;
    height: 75%;
    border-radius: 50%;
    content: "";
    margin: auto;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }
}

.wdg.wdg--night {
  .loader {
    filter: invert(0);
  }

  .loader:after {
    background-color: #25273c;
  }
}

@-webkit-keyframes load3 {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@keyframes load3 {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
</style>
