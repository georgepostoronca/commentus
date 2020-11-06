<template>
  <div id="app">
    <!-- при открытии всплывающего окна к элементу "wdg" добавлять "wdg--popup-active" -->
    <!-- ночной режим задается классом "wdg--night" -->
    <div class="wdg" ref="wdgRoot">
      <div class="wdg__wrap">
        <div class="wdg-top">
          <div class="wdg-title">48 комментариев</div>

          <div class="wdg-main-sort">
            <div class="wdg-main-sort__title">
              <span class="wdg-icon"></span>
              По популярности
            </div>
          </div>
        </div>

        <Message/>

        <div class="wdg-user">
					<span class="wdg-user__ava">
						<img src="img/ava1.jpg" alt="">
					</span>
          <span class="wdg-user__text">Вы вошли как Антон Корабликов.</span>
          <a class="wdg-user__exit" href="">Выйти</a>
        </div>

        <div class="wdg-notify">
          <span class="wdg-notify__icon wdg-icon-info"></span>
          Оставляя комментарии на этом сайте, можно получать монеты COMMENTUS, котые затем можно тратить на привычные вам вещи. <a href="">Подробнее</a>
        </div>

        <div class="wdg-comments">
          <Comment />
        </div>

        <button class="wdg-comments__more">
          Показать ещё
        </button>
      </div>
    </div>
    <!-- end wdg -->
  </div>
</template>

<script>
import Message from "@/components/Message";
import Comment from "@/components/Comment";

export default {
  name: "App",
  components: {
    Comment,
    Message
  },
  data() {
    return {
      root: this.$refs.wdgRoot
    };
  },
  computed: {
    comments: e => {
      return e.$store.state.comments;
    }
  },
  created() {
    this.$store.dispatch("GET_COMMENT");
    this.$store.dispatch("USER_LOG");
    console.log(this.$store.state.comments)
  }
};
</script>
