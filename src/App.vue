<template>
  <div id="app">
    <!-- при открытии всплывающего окна к элементу "wdg" добавлять "wdg--popup-active" -->
    <!-- ночной режим задается классом "wdg--night" -->
    <div
      class="wdg"
      ref="wdgRoot"
      :class="[{ 'wdg--popup-active': popup }, theme]"
    >
      <div class="wdg__wrap">
        <div class="wdg-top">
          <div class="wdg-title">
            {{ commentLength }} комментариев page: {{ commentPage }}
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
                <p>{{ sortSelected.name }}</p>
              </div>

              <div class="wdg-custom_select_dropdown">
                <p
                  v-for="(item, index) in sortItem"
                  :key="index"
                  :data-index="index"
                  @click="
                    sortSelected = sortItem[index];
                    sortOpen = false;
                  "
                >
                  {{ item.name }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <button @click="togglePopup('share')">Popup Share</button>
        <button @click="togglePopup('email')">Popup Email</button>
        <button @click="togglePopup('login')">Popup Login</button>
        <span>{{ $store.state.openPopup }}</span>

<!--        <span>{{ $store.state.hash }}</span>-->
<!--        <br />-->
<!--        <span>{{ $store.state.userData }}</span>-->

        <Message type="root" :textarea="'PLACEHOLDER_COMMENT' | translate"/>

        <div class="wdg-user" v-if="userData">
          <span class="wdg-user__ava">
            <img :src="userData.avatar" alt="IMG" />
          </span>
          <span class="wdg-user__text">Вы вошли как {{ userData.name }}.</span>
          <button class="wdg-user__exit" @click="logoutUser">Выйти</button>
        </div>

        <div class="wdg-notify">
          <span class="wdg-notify__icon wdg-icon-info"></span>
          {{ "INFO_TEXT" | translate }}
          <a href="">{{ 'MORE_DETAILS' | translate }}</a>
        </div>

        <div class="wdg-comments__wrap" v-if="commentsArray.length">
          <div class="wdg-comments">
            <Comment
              v-for="(item, index) in commentsArray"
              :key="index"
              :data="item.comment"
              :index="index"
              :reply="'PLACEHOLDER_REPLY' | translate"
              :replyto="Number(0)"
              @shareData="popupShare($event)"
            >
              <Comment
                v-if="item.subcomment"
                v-for="(val, index) in item.subcomment"
                :key="Number(val.id)"
                :data="item.subcomment[index]"
                :reply="'PLACEHOLDER_REPLY' | translate"
                :replyto="Number(item.comment.id)"
                @shareData="popupShare($event)"
              >
                <Comment
                    v-if="item.subcomment.nested"
                    v-for="(val, index) in item.subcomment.nested"
                    :key="Number(val.id)"
                    :data="item.subcomment.nested[index]"
                    :reply="'PLACEHOLDER_REPLY' | translate"
                    :replyto="Number(item.subcomment.nested.id)"
                    @shareData="popupShare($event)"
                ></Comment>
              </Comment>
            </Comment>
          </div>

          <button
            class="wdg-comments__more"
            v-if="pageNotFinish"
            @click="moreComment"
          >
            {{ 'SHOW_MORE' | translate }}
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
      popupShareLink: "",
      sortSelected: {
        name: translate["SORT_POPULARITY"][this.$store.state.lang]
      },
      sortItem: [
        {
          name: translate["SORT_POPULARITY"][this.$store.state.lang],
          type: "popularity"
        },
        {
          name: translate["SORT_NEW"][this.$store.state.lang],
          type: "newest"
        },
        {
          name: translate["SORT_OLD"][this.$store.state.lang],
          type: "oldest"
        }
      ]
    };
  },
  computed: {
    popup() {
      return this.$store.state.openPopup;
    },
    commentLength: e => {
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
      // let data = ;
      // // console.log(data);
      // let cmt = [];
      //
      // data.forEach(item => {e.$store.state.comments || []
      //   let id = item.id;
      //   let replyId = item.reply_to;
      //
      //   let subcomment = data.filter(sub => {
      //     return Number(sub.reply_to) === Number(id) ? sub : false;
      //   });
      //
      //   if (!Number(replyId)) {
      //     cmt.push({
      //       comment: item,
      //       subcomment
      //     });
      //   }
      // });
      //
      // // console.log("CMT", cmt);
      //
      // return cmt.length ? cmt : [];


      // new Algorithm
      let com = e.$store.state.comments || [];
      let newArr = [];

      com.forEach((item, index) => {
        let id = item.id;
        let second = nested(id, com);

        second.forEach(item => {
          let findThird = nested(item.id, com);
          item.nested = findThird;
        });

        newArr.push({
          comment: item,
          subcomment: second
        });
      });

      function nested(id, arr) {
        let nested = arr.filter((item, index) => {
          if (Number(id) === Number(item.reply_to)) {
            delete com[index];
            return item;
          }
        });
        return nested;
      }

      return newArr.length ? newArr : [];

    },
    userData: e => {
      return e.$store.state.userData.data;
    }
  },
  methods: {
    togglePopup(e) {
      this.$store.commit("TOGGLE_POPUP", e);
    },
    popupShare(e) {
      this.popupShareLink = e;
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
        this.popupShareLink = "";
      }
    }
  }
};
</script>

<style lang="scss">
.wdg-custom_select {
  user-select: none;
}

.wdg-comment__ava {
  overflow: hidden;
}

button.wdg-user__exit {
  border: 0;
  background-color: transparent;
}
</style>
