<template>
  <div class="wdg-popup">
    <div class="wdg-popup__layout" @click="changeTypePopup('')"></div>
    <!--    Поделиться ссылкой-->
    <div v-if="popup === 'share'" class="wdg-popup__wrap">
      <div class="wdg-popup__title">{{ "SHARE_LINK" | translate }}</div>

      <div class="wdg-popup__content">
        <div class="wdg-copy-link" @click="copyClipboard($event)">
          <input class="wdg-copy-link__input" type="text" :value="shareLink" />
          <div class="wdg-text">
            {{ shareLink }}
          </div>

          <div class="wdg-i wdg-icon-copy"></div>
        </div>

        <div class="wdg-soc-list">
          <a href="" class="wdg-item wdg-icon-fb">
            <span class="path1"></span><span class="path2"></span
            ><span class="path3"></span><span class="path4"></span>
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

      <div class="wdg-popup__close" @click="changeTypePopup('')"></div>
    </div>

    <!--    Войти через почту-->
    <div v-if="popup === 'email'" class="wdg-popup__wrap">
      <div class="wdg-popup__title">{{ "SIGN_EMAIL" | translate }}</div>

      <div class="wdg-popup__content">
        <div class="wdg-link-back">
          <a
            class="wdg-link-grey"
            href=""
            @click.prevent="changeTypePopup('login')"
          >
            <span class="wdg-i">←</span>
            <div class="wdg-t">{{ "SIGN_SOCIAL" | translate }}</div>
          </a>
        </div>

        <form
          class="wdg-form"
          action="https://commentus.net/authorize"
          method="post"
          @submit.prevent="submitForm"
        >
          <div class="wdg-form__row">
            <div class="wdg-text">{{ "INPUT_NAME" | translate }}:</div>
            <div class="wdg-field">
              <input
                type="text"
                name="name"
                class="wdg-inp"
                :class="{ error: !validName }"
                required
                v-model="name"
              />
              <span>{{ "NAME_REQUIRED" | translate }}</span>
            </div>
          </div>

          <div class="wdg-form__row">
            <div class="wdg-text">{{ "INPUT_EMAIL" | translate }}:</div>
            <div class="wdg-field">
              <input
                type="email"
                name="email"
                class="wdg-inp"
                :class="{ error: !validEmail }"
                required
                v-model="email"
              />
              <span>{{ "EMAIL_REQUIRED" | translate }}</span>
            </div>
          </div>

          <div class="wdg-form__bottom">
            <div class="wdg-l">
              <button class="wdg-btn-blue size-l">
                {{ "SIGNIN" | translate }}
              </button>
            </div>

            <div class="wdg-r">
              <div class="wdg-auth-notify">
                {{ "POLICY_PART1" | translate }}
                <a href="#">{{ "POLICY_LINK1" | translate }}</a>
                {{ "POLICY_PART2" | translate }}
                <a href="#">{{ "POLICY_LINK2" | translate }}</a>
              </div>
            </div>
          </div>
        </form>
      </div>

      <div class="wdg-popup__close" @click="changeTypePopup('')"></div>
    </div>

    <!--    авторизоваться-->
    <div v-if="popup === 'login'" class="wdg-popup__wrap">
      <div class="wdg-popup__title">{{ "LOGIN_REQUIRED" | translate }}</div>

      <div class="wdg-popup__content">
        <div class="wdg-soc-links">
          <button
            @click="openLink('https://commentus.net/account/authorize/google?redirect=')"
            class="wdg-item"
          >
            <span class="wdg-icon-google"
              ><span class="path1"></span><span class="path2"></span
              ><span class="path3"></span><span class="path4"></span
            ></span>
            <span class="wdg-t">Google</span>
          </button>

          <a href="" class="wdg-item">
            <span class="wdg-icon-fb"></span>
            <span class="wdg-t">Facebook</span>
          </a>

          <a href="" class="wdg-item">
            <span class="wdg-icon-telegram-1"
              ><span class="path1"></span><span class="path2"></span
            ></span>
            <span class="wdg-t">Telegram</span>
          </a>

          <a href="" class="wdg-item">
            <span class="wdg-icon-vk"
              ><span class="path1"></span><span class="path2"></span
            ></span>
            <span class="wdg-t">VK</span>
          </a>

          <a href="" class="wdg-item">
            <span class="wdg-icon-twitter"></span>
            <span class="wdg-t">Twitter</span>
          </a>

          <a href="" class="wdg-item">
            <span class="wdg-icon-minter"
              ><span class="path1"></span><span class="path2"></span
            ></span>
            <span class="wdg-t">Minter ID</span>
          </a>

          <a href="" class="wdg-item" @click.prevent="changeTypePopup('email')">
            <span class="wdg-icon-mail"></span>
            <span class="wdg-t">{{ "WITH_EMAIL" | translate }}</span>
          </a>
        </div>

        <div class="wdg-auth-notify">
          {{ "POLICY_PART1" | translate }}
          <a href="#">{{ "POLICY_LINK1" | translate }}</a>
          {{ "POLICY_PART2" | translate }}
          <a href="#">{{ "POLICY_LINK2" | translate }}</a>
        </div>
      </div>

      <div class="wdg-popup__close" @click="changeTypePopup('')"></div>
    </div>
  </div>
</template>

<script>
import translate from "@/lang";

export default {
  name: "Popup",
  data() {
    return {
      name: "",
      email: "",
      currentUrl: encodeURI(location.href)
    };
  },
  computed: {
    popup() {
      return this.$store.state.openPopup;
    },
    validName() {
      return !(this.name.length <= 2);
    },
    validEmail() {
      let re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(this.email);
    }
  },
  props: {
    shareLink: String
  },
  methods: {
    openLink(link) {
      this.$store.dispatch("SAVE_DRAFT").then(() => {
        location.href = encodeURI(link + this.currentUrl);
      });
    },
    changeTypePopup(type) {
      this.$store.commit("TOGGLE_POPUP", type);
    },
    submitForm({ target: form }) {
      if (this.validName && this.validEmail) {
        form.submit();
        form.reset();
      }
    },
    copyClipboard({ target }) {
      let input = target.parentElement.querySelector("input");
      let text = target.parentElement.querySelector(".wdg-text");

      input.select();
      input.setSelectionRange(0, 99999);
      document.execCommand("copy");

      let innerText = text.innerText;
      text.innerText = translate["COPY_CLIPBOARD"][this.$store.state.lang];
      target.parentElement.style.pointerEvents = "none";
      setTimeout(() => {
        text.innerText = innerText;
        target.parentElement.style.pointerEvents = "auto";
      }, 1000);
    }
  }
};
</script>

<style scoped lang="scss">
.wdg-popup {
  display: none;

  .wdg-popup__layout {
    position: absolute;
    top: 0;
    left: 0;
    background-color: transparent;
    width: 100%;
    height: 100%;
  }

  &__close {
    user-select: none;
  }
}

.wdg-field {
  input {
    &.error {
      & ~ span {
        display: block;
      }
    }
  }

  span {
    display: none;
    margin-top: 5px;
    color: #f93f3f;
  }
}

.wdg.wdg--popup-active {
  .wdg-popup {
    display: flex;
  }
}

.wdg-copy-link__input {
  //width: 0;
  //height: 0;
  //opacity: 0;
  position: absolute;
  background: transparent;
  z-index: -1;
  pointer-events: none;
}

.wdg-popup {
  position: fixed;
}
</style>
