<template>
  <div class="wdg-comment">
    <div class="wdg-comment__wrap">
      <!-- ава и имя могут быть ссылками -->
      <a href="" class="wdg-comment__ava">
        <img src="img/ava1.jpg" alt="">
      </a>

      <div class="wdg-comment__inner">
        <div class="wdg-comment__top">
          <a href="" class="wdg-name">Николай</a>
          <div class="wdg-reward">🏅</div>
          <div class="wdg-date">4 дня назад</div>
        </div>

        <div class="wdg-comment__text">
          Провоз кошек и собак одномерно синхронизует барионный вулканизм. Сырдарья изящно выбирает разрыв.
        </div>

        <div class="wdg-comment__bottom">
          <a class="wdg-link" href="">Ответить</a>

          <div class="wdg-rate">
            <div class="wdg-rate__like"></div>

            <div class="wdg-rate__num">38</div>

            <div class="wdg-rate__dislike"></div>
          </div>
        </div>

        <!-- для раскрытого состояния класс wdg-open -->
        <Message />
      </div>
    </div>
  </div>
</template>

<script>
import Message from "@/components/Message";

export default {
  name: "Comment",
  components: {
    Message
  },
  props: {

  },
  data() {
    return {

    }
  }
  }
</script>

<style scoped>

</style>