<template>
  <div class="wdg-comment">
    <div class="wdg-comment__wrap">
      <!-- ава и имя могут быть ссылками -->
      <a :href="userLink" class="wdg-comment__ava">
        <img :src="avatar" :alt="name" />
      </a>

      <div class="wdg-comment__inner">
        <div class="wdg-comment__top">
          <a href="" class="wdg-name">{{ name }}</a>
          <div class="wdg-reward">🏅</div>
          <div class="wdg-date">
            <time-ago :datetime="date" long :locale="locale"></time-ago>
          </div>
        </div>

        ID: {{ id }}
        <br>
        REPLY: {{ data.reply_to }}

        <div class="wdg-comment__text">{{ text }}</div>

        <div class="wdg-comment__bottom">
          <button class="wdg-link" @click="ifMessage = !ifMessage">Ответить</button>

          <!--Rate-->
          <div class="wdg-rate">
            <div class="wdg-rate__like" @click="like"></div>

            <div class="wdg-rate__num" :class="[likes < 0 ? '--wdg-red' : '']">{{ likes }}</div>

            <div class="wdg-rate__dislike" @click="dislike"></div>
          </div>

          <!--Share-->
          <button class="wdg-comment__share" @click="openShare">
            <span class="wdg-t">Поделиться</span>
            <span class="wdg-i"></span>
          </button>
        </div>

        <!-- для раскрытого состояния класс wdg-open -->
        <Message v-if="ifMessage" :textarea="reply"/>
      </div>
    </div>

    <slot></slot>
    <!--Sub Comment-->
<!--    <div class="wdg-comment" v-for="item in data.subcomment">-->
<!--      <div class="wdg-comment__wrap">-->
<!--        <div class="wdg-comment__ava &#45;&#45;wdg-anonim">-->
<!--        </div>-->

<!--        <div class="wdg-comment__inner">-->
<!--          <div class="wdg-comment__top">-->
<!--            <div class="wdg-name">Анонимный персонаж</div>-->
<!--            <div class="wdg-date">6 дней назад</div>-->
<!--          </div>-->

<!--          <div class="wdg-comment__text">Здесь работали Карл Маркс и Владимир Ленин, но химическое соединение трансформирует кварк.</div>-->

<!--          <div class="wdg-comment__bottom">-->
<!--            <a class="wdg-link" href="">Ответить</a>-->

<!--            <div class="wdg-rate">-->
<!--              <div class="wdg-rate__like"></div>-->

<!--              <div class="wdg-rate__dislike"></div>-->
<!--            </div>-->
<!--          </div>-->

<!--          <Message />-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->
    <!-- end wdg-comment -->

  </div>
</template>

<script>
import TimeAgo from 'vue2-timeago';
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
    index: [Number, String]
  },
  computed: {
    locale: e => {
      return e.$store.state.lang;
    }
  },
  data() {
    return {
      id: this.data.id,
      name: this.data.user_data.name || "",
      avatar: this.data.user_data.avatar || "",
      date: this.data.date || "",
      text: this.data.text || "",
      userLink: this.data.user_data.link || "",
      likes: this.data.likes.upvote || 0,
      ifMessage: false
    };
  },
  methods: {
    like() {
      this.$store.dispatch("LIKE_DISLIKE", {
        type: "like",
        id: this.id
      });
    },
    dislike() {
      this.$store.dispatch("LIKE_DISLIKE", {
        type: "dislike",
        id: this.id
      });
    },
    openShare() {
      this.$emit("popupType", "share");
      this.$emit(
        "shareData",
        location.href + "#commentus_widget_form" + this.id
      );
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
</style>
