<template>
  <div class="wdg-popup">

<!--    Поделиться ссылкой-->
    <div v-if="popup === 'share'" class="wdg-popup__wrap">
      <div class="wdg-popup__title">Поделиться ссылкой<br> на комментарий</div>

      <div class="wdg-popup__content">
        <div class="wdg-copy-link">
          <div class="wdg-text">https://site.com/article-page.html#comment231234</div>

          <div class="wdg-i wdg-icon-copy"></div>
        </div>

        <div class="wdg-soc-list">
          <a href="" class="wdg-item wdg-icon-fb">
            <span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span>
          </a>

          <a href="" class="wdg-item wdg-icon-vk">
            <span class="path1"></span><span class="path2"></span>
          </a>

          <a href="" class="wdg-item wdg-icon-twitter"></a>

          <a href="" class="wdg-item wdg-icon-telegram-1">
            <span class="path1"></span><span class="path2"></span>
          </a>
        </div>
      </div>

      <div class="wdg-popup__close"></div>
    </div>

<!--    Войти через почту-->
    <div v-if="popup === 'email'" class="wdg-popup__wrap">
      <div class="wdg-popup__title">Войти через почту</div>

      <div class="wdg-popup__content">
        <div class="wdg-link-back">
          <a class="wdg-link-grey" href="">
            <span class="wdg-i">←</span>
            <div class="wdg-t">Войти через соц. сети</div>
          </a>
        </div>


        <form class="wdg-form">
          <div class="wdg-form__row">
            <div class="wdg-text">Ваше имя:</div>
            <div class="wdg-field">
              <input type="text" class="wdg-inp" >
            </div>
          </div>

          <div class="wdg-form__row">
            <div class="wdg-text">E-Mail:</div>
            <div class="wdg-field">
              <input type="text" class="wdg-inp" >
            </div>
          </div>

          <div class="wdg-form__bottom">
            <div class="wdg-l">
              <button class="wdg-btn-blue size-l">Войти</button>
            </div>

            <div class="wdg-r">
              <div class="wdg-auth-notify">
                Авторизуясь, вы соглашаетесь с <a href="">правилами использования</a> и даете согласие на <a href="">обработку персональных данных</a>.
              </div>
            </div>
          </div>

        </form>
      </div>

      <div class="wdg-popup__close"></div>
    </div>

<!--    авторизоваться-->
    <div v-if="popup === 'login'"  class="wdg-popup">
      <div class="wdg-popup__wrap">
        <div class="wdg-popup__title">Необходимо<br> авторизоваться:</div>

        <div class="wdg-popup__content">
          <div class="wdg-soc-links">
            <a href="" class="wdg-item">
              <span class="wdg-icon-google"><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span></span>
              <span class="wdg-t">Google</span>
            </a>

            <a href="" class="wdg-item">
              <span class="wdg-icon-fb"></span>
              <span class="wdg-t">Facebook</span>
            </a>

            <a href="" class="wdg-item">
              <span class="wdg-icon-telegram-1"><span class="path1"></span><span class="path2"></span></span>
              <span class="wdg-t">Telegram</span>
            </a>

            <a href="" class="wdg-item">
              <span class="wdg-icon-vk"><span class="path1"></span><span class="path2"></span></span>
              <span class="wdg-t">VK</span>
            </a>

            <a href="" class="wdg-item">
              <span class="wdg-icon-twitter"></span>
              <span class="wdg-t">Twitter</span>
            </a>

            <a href="" class="wdg-item">
              <span class="wdg-icon-minter"><span class="path1"></span><span class="path2"></span></span>
              <span class="wdg-t">Minter ID</span>
            </a>

            <a href="" class="wdg-item">
              <span class="wdg-icon-mail"></span>
              <span class="wdg-t">Через почту</span>
            </a>
          </div>


          <div class="wdg-auth-notify">
            Авторизуясь, вы соглашаетесь с <a href="">правилами использования</a> и даете согласие на <a href="">обработку персональных данных</a>.
          </div>
        </div>

        <div class="wdg-popup__close"></div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: "Popup",
  data() {
    return {

    }
  },
  props: {
    popup: String,
    default: true
  }
}
</script>

<style scoped>

</style>