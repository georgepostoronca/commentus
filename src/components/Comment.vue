<template>
  <div class="wdg-comment">
    <div class="wdg-comment__wrap">
      <!-- ава и имя могут быть ссылками -->
      <a :href="userLink" class="wdg-comment__ava">
        <img :src="avatar" :alt="name" />
      </a>

      <div class="wdg-comment__inner">
        <div class="wdg-comment__top">
          <a :href="userLink" class="wdg-name">{{ name }}</a>
          <div class="wdg-reward">🏅</div>
          <div class="wdg-date">
            <time-ago :datetime="date" long :locale="locale"></time-ago>
          </div>
        </div>

                ID: {{ id }}
                <br />
                REPLY: {{ data.reply_to }}
                <br>
                LEVEL: {{ level }} {{ Number(level) < 4 }}

        <div class="wdg-comment__text">{{ text }}</div>

        <div class="wdg-comment__bottom">
          <button
            class="wdg-link"
            v-if="ifreply"
            @click="ifMessage = !ifMessage"
          >
            {{ "REPLY" | translate }}
          </button>

          <!--Rate-->
          <div class="wdg-rate">
            <!--            {{ ifLiked }}-->
            <!--            {{ ifDisliked }}-->
            <div
              class="wdg-rate__like"
              :class="{ disabled: isLiked }"
              @click="like('like')"
            ></div>

            <div
              class="wdg-rate__num"
              v-if="likes !== 0"
              :class="[likes < 0 ? '--wdg-red' : '']"
            >
              {{ likes }}
            </div>

            <div
              class="wdg-rate__dislike"
              :class="{ disabled: isDisliked }"
              @click="like('dislike')"
            ></div>
          </div>

          <!--Share-->
          <button class="wdg-comment__share" @click="openShare">
            <span class="wdg-t">{{ "SHARE" | translate }}</span>
            <span class="wdg-i"></span>
          </button>
        </div>

        <!-- для раскрытого состояния класс wdg-open -->
        <Message
          v-show="ifMessage"
          :textarea="reply"
          :valueText="name + ','"
          :replyto="id"
          :draft="getDraft"
        />
      </div>
    </div>

    <Comment
      v-for="(val, index) in Number(level) <= 3 ? data.subcomment : []"
      :key="Number(val.id)"
      :index="index"
      :data="data.subcomment[index]"
      :reply="'PLACEHOLDER_REPLY' | translate"
      :replyto="Number(data.id)"
      :idShare="Number(val.id)"
      :level="Number(level) + 1"
      :ifreply="Number(level) <= 2"
    ></Comment>
    <!--    <slot>-->
    <!--    </slot>-->
  </div>
</template>

<script>
import TimeAgo from "vue2-timeago";
import Message from "@/components/Message";

export default {
  name: "Comment",
  components: {
    Message,
    TimeAgo
  },
  props: {
    data: Object,
    reply: String,
    index: [Number, String],
    replyto: Number,
    idShare: Number,
    level: Number,
    ifreply: {
      default: true,
      type: Boolean
    }
  },
  data() {
    return {
      id: Number(this.data.id),
      name: this.data.user_data.name ?? "",
      avatar: this.data.user_data.avatar ?? "",
      date: this.data.date ?? "",
      text: this.data.text ?? "",
      myLike: this.data.my_like ?? 0,
      userLink: this.data.user_data.link ?? "",
      likes: this.data.likes ?? 0,
      draft: this.data.draft ?? false,
      ifMessage: false,
      isLiked: false,
      isDisliked: false
    };
  },
  created() {
    this.ifMessage = this.getDraft;
    this.ifLikeDis();
  },
  computed: {
    getDraft: e => {
      let draft = e.$store.state.draft;
      return draft && Number(e.id) === Number(draft.reply_to)
        ? e.$store.state.draft.draft
        : false;
    },
    locale: e => {
      return e.$store.state.lang;
    },
    ifAuth: e => {
      return e.$store.state.userData;
    }
  },
  updated() {
    console.log("UPDATE");
    this.ifLikeDis();
  },
  methods: {
    ifLikeDis() {
      console.log("ifLikeDis");
      this.isLiked = Object.keys(this.ifAuth).length
        ? Number(this.myLike) === 1
        : false;

      this.isDisliked = Object.keys(this.ifAuth).length
        ? Number(this.myLike) === -1
        : false;

      // console.log("=============");
      // console.log("idLike: ", this.myLike);
      // console.log("ID: ", this.id);
      // console.log("Like: ", this.isLiked);
      // console.log("Dislike: ", this.isDisliked);
      // console.log("userData: ", this.$store.state.comments);
    },
    like(type) {
      let userData = this.$store.state.userData;
      if (
        Object.keys(userData).length === 0 &&
        userData.constructor === Object
      ) {
        this.$store.commit("TOGGLE_POPUP", "login");
        return false;
      }

      this.$store
        .dispatch("LIKE_DISLIKE", {
          type: type,
          id: this.id
        })
        .then(response => {
          if (response.data.result === "true") {
            switch (type) {
              case "like":
                if (this.isLiked) return false;
                this.likes =
                  this.likes === -1 ? this.likes + 2 : this.likes + 1;
                this.isLiked = true;
                this.isDisliked = false;
                break;
              case "dislike":
                if (this.isDisliked) return false;
                this.likes = this.likes === 1 ? this.likes - 2 : this.likes - 1;
                this.isLiked = false;
                this.isDisliked = true;
                break;
            }
          }
        });
    },
    openShare() {
      // console.log(this.idShare, e, id);
      this.$store.commit("TOGGLE_POPUP", "share");

      this.$store.state.popupShareLink =
        location.href + "#commentus_widget_form" + this.idShare;
      // this.$emit(
      //   "shareData",
      //   location.href + "#commentus_widget_form" + this.idShare
      // );
    }
  },
  watch: {
    // ifMessage: () => {
    //   console.log("UPD ifMessage")
    // }

    ifAuth: {
      handler: function() {
        console.log("ifAuth")
        this.ifLikeDis();
      }
    }
  }
};
</script>

<style scoped lang="scss">
.wdg-comment__bottom {
  button {
    background-color: transparent;
    border: 0;
  }
}

button.wdg-comment__share {
  padding: 0;
}

.wdg-date {
  .v-time-ago__text {
    font-family: initial;
    color: initial;
  }
}

.wdg-rate__like,
.wdg-rate__dislike {
  &.disabled {
    pointer-events: none;
    opacity: 0.2;
  }
}
</style>
