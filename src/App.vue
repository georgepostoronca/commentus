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

        <button @click="popup = 'share'">Popup Share</button>
        <button @click="popup = 'email'">Popup Email</button>
        <button @click="popup = 'login'">Popup Login</button>

<!--        <span>{{ $store.state.hash }}</span>-->
<!--        <br />-->
<!--        <span>{{ $store.state.userData }}</span>-->

        <Message type="root"/>

        <div class="wdg-user" v-if="userData">
          <span class="wdg-user__ava">
            <img :src="userData.avatar" alt="IMG" />
          </span>
          <span class="wdg-user__text">Вы вошли как {{ userData.name }}.</span>
          <button class="wdg-user__exit" @click="logoutUser">Выйти</button>
        </div>

        <div class="wdg-notify">
          <span class="wdg-notify__icon wdg-icon-info"></span>
          Оставляя комментарии на этом сайте, можно получать монеты COMMENTUS,
          котые затем можно тратить на привычные вам вещи.
          <a href="">Подробнее</a>
        </div>

        <div class="wdg-comments__wrap" v-if="commentsArray.length">
          <div class="wdg-comments">
            <Comment
              v-for="(item, index) in commentsArray"
              :key="index"
              :data="item.comment"
              :index="index"
              reply="Написать ответ..."
              :replyto="Number(0)"
              @popupType="popupClose($event)"
              @shareData="popupShare($event)"
            >
              <Comment
                v-if="item.subcomment"
                v-for="(val, index) in item.subcomment"
                :key="Number(val.id)"
                :data="item.subcomment[index]"
                reply="Написать ответ..."
                :replyto="Number(item.comment.id)"
                @popupType="popupClose($event)"
                @shareData="popupShare($event)"
              >
              </Comment>
            </Comment>
          </div>

          <button
            class="wdg-comments__more"
            v-if="pageNotFinish"
            @click="moreComment"
          >
            Показать ещё
          </button>
        </div>
      </div>

      <Popup
        v-bind:popup="popup"
        :shareLink="popupShareLink"
        @popupType="popupClose($event)"
      />
    </div>
    <!-- end wdg -->
  </div>
</template>

<script>
import Message from "@/components/Message";
import Comment from "@/components/Comment";
import Popup from "@/components/Popup";

import ClickOutside from "vue-click-outside";

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
      popup: "",
      sortOpen: false,
      popupShareLink: "",
      sortSelected: {
        name: "По популярности"
      },
      sortItem: [
        {
          name: "По популярности",
          type: "popularity"
        },
        {
          name: "Новые",
          type: "newest"
        },
        {
          name: "Старые",
          type: "oldest"
        }
      ]
    };
  },
  computed: {
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
      let data = e.$store.state.comments || [];
      // console.log(data);
      let cmt = [];

      data.forEach(item => {
        let id = item.id;
        let replyId = item.reply_to;

        let subcomment = data.filter(sub => {
          return Number(sub.reply_to) === Number(id) ? sub : false;
        });

        if (!Number(replyId)) {
          cmt.push({
            comment: item,
            subcomment
          });
        }
      });

      // console.log("CMT", cmt);

      return cmt.length ? cmt : [];
    },
    userData: e => {
      return e.$store.state.userData.data;
    }
  },
  methods: {
    popupClose(e) {
      this.popup = e;
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
    this.$store.dispatch("GET_COOKIE");
    this.$store.dispatch("GET_DRAFT");
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
