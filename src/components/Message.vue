<template>
  <!-- для раскрытого состояния класс wdg-open -->
  <form
    class="wdg-add-comment"
    ref="messageWrap"
    :class="{ 'wdg-open': ifTextareaOpen }"
  >
    <textarea
      class="wdg-add-comment__field"
      rows="1"
      @input="twoFn"
      @change="cursorPosition"
      @keyup.left="cursorPosition"
      @keyup.right="cursorPosition"
      @keyup.up="cursorPosition"
      @keyup.down="cursorPosition"
      @click="cursorPosition"
      v-model="messageText"
      ref="messageTextarea"
      :placeholder="textarea"
    ></textarea>

    <div class="wdg-add-comment__bottom">
      <div class="wdg-add-comment__control">
        <button
          class="wdg-send wdg-btn-blue"
          type="button"
          @click="getFormData"
        >
          {{ "SEND" | translate }}
        </button>

        <div class="wdg-file" v-if="files.length">
          <div class="wdg-text">{{ lengthFile }}:</div>

          <div class="wdg-file__list">
            <div
              v-for="(item, index) in files"
              :key="index"
              class="wdg-file__item js-upload-item"
            >
              <div v-html="item.input"></div>
              <div class="wdg-t">{{ item.name }}</div>
              <div
                class="wdg-r"
                :data-index="index"
                @click="removeThisFile"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div class="wdg-add-comment__r">
        <div class="wdg-add-file">
          <input
            type="file"
            name=""
            :id="'input-file-' + id"
            multiple
            @change="addFile"
          />
          <label :for="'input-file-' + id">
            <span class="wdg-icon-clip"></span>
          </label>
        </div>

        <!-- открытое состояние задается классом wdg-open -->
        <div
          class="wdg-add-smile"
          ref="emojiParent"
          :class="{ active: emojiOpenClose }"
        >
          <div
            class="wdg-add-smile__btn"
            ref="smilesBtn"
            @click="emojiOpneClose"
          >
            <span class="wdg-icon-smile"></span>
          </div>

          <div
            class="wdg-add-smile__list"
            ref="smilesList"
            :class="{
              '--top': emojiOpenCloseTop,
              '--left': emojiOpenCloseLeft
            }"
          >
            <div class="wdg-wrap">
              <span
                v-for="(item, index) in smile"
                :key="index"
                @click="selectSmile"
                class="wdg-smile"
                >{{ item }}</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </form>
</template>

<script>
import translate from "@/lang";

export default {
  name: "Message",
  props: {
    textarea: String,
    type: String,
    valueText: String,
    replyto: Number,
    draft: {
      type: [Object, Boolean, String],
      default: ""
    }
  },
  data() {
    return {
      smile: [
        "🤨",
        "🤩",
        "🤪",
        "🤫",
        "🤭",
        "🤮",
        "🤯",
        "🤤",
        "🤣",
        "🤗",
        "🤔",
        "😮",
        "😦",
        "😥",
        "😭",
        "😳",
        "😱",
        "😰",
        "😲",
        "😫",
        "😬",
        "😗",
        "😍",
        "😎",
        "😏",
        "😊",
        "😉"
      ],
      curPosition: 0,
      files: [],
      fileMaxSize: 5000000,
      fileFormat: [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/svg+xml",
        "image/gif"
      ],
      messageFocused: false,
      messageText: this.draft || "",
      textareaHeight: 0,
      id: null,
      emojiOpenClose: false,
      emojiOpenCloseTop: false,
      emojiOpenCloseLeft: false
    };
  },
  created() {
    if (this.valueText) {
      this.messageText = this.valueText + " " + (this.draft ? this.draft : "");
    }

    this.messageFocused = !!this.draft;
  },
  mounted() {
    this.id = this._uid;

    // console.log(this.textarea, this.draft)
    //
    // console.log(
    //   "globalTextareaFocused",
    //   this.$store.state.globalTextareaFocused
    // );
  },
  computed: {
    lengthFile: e => {
      let len = e.files.length;
      let lang = e.$store.state.lang;
      let prep = "";

      if (len > 1) {
        if (lang === "ru") {
          prep = "а";
        } else {
          prep = "s";
        }
      }

      if (len > 4 && lang === "ru") {
        prep = "ов";
      }

      return `${translate["ATTACHED"][lang]} ${len} ${translate["FILE"][lang]}${prep}`;
    },
    ifTextareaOpen: e => {
      let ifText = e.messageText;
      let ifFile = e.files.length;

      return !!(ifText || ifFile || e.messageFocused);
    },
    siteId: e => {
      return e.$store.state.siteId;
    }
  },
  methods: {
    twoFn(e) {
      this.cursorPosition(e);
      this.globalFocused();
    },
    globalFocused() {
      // console.log("this.textarea")
      this.$store.state.globalTextareaFocused = {
        text: this.messageText,
        replyto: this.replyto,
        name: this.valueText ?? ""
      };
    },
    getGlobalOffset(el) {
      var x = 0,
        y = 0;
      while (el) {
        x += el.offsetLeft;
        y += el.offsetTop;
        el = el.offsetParent;
      }
      return { left: x, top: y };
    },
    ifEmojiTop() {
      let wdg = document.querySelector(".wdg");
      let list = this.$refs.smilesList;
      let btn = this.$refs.smilesBtn;
      let offset;
      offset = this.getGlobalOffset(btn);

      console.log(offset, btn.getBoundingClientRect());

      console.log(
        offset.top + btn.offsetHeight + list.offsetHeight,
        wdg.clientHeight
      );

      console.log(offset.top + btn.offsetHeight, list.offsetHeight);

      this.emojiOpenCloseTop =
        offset.top + btn.offsetHeight + list.offsetHeight > wdg.clientHeight;

      this.emojiOpenCloseLeft = wdg.clientHeight < 250;
    },
    emojiOpneClose() {
      if (!this.emojiOpenClose) {
        this.ifEmojiTop();
        this.emojiOpenClose = !this.emojiOpenClose;
      } else {
        this.emojiOpenClose = !this.emojiOpenClose;
        setTimeout(() => {
          this.emojiOpenCloseTop = false;
          this.emojiOpenCloseLeft = false;
          // this.ifEmojiTop();
        }, 100);
      }
    },
    selectSmile(e) {
      let textarea = this.$refs.messageTextarea;
      let smile = e.target.innerText;
      textarea.value = textarea.value.splice(this.curPosition, 0, smile);
      this.curPosition = this.curPosition + smile.length;
      this.messageText = textarea.value;
    },
    cursorPosition(e) {
      // получаем координаты курсора из textarea
      let content = e.target;
      if (content.selectionStart != null) {
        this.curPosition = content.selectionStart;
      } else {
        return false;
      }
    },
    addFile(e) {
      let files = [].slice.call(e.target.files);
      let error = false;

      // console.log(files);

      if (files.length > 5) {
        alert("Не больше 5 файлов");
        return false;
      }

      let arrFiles = files.filter(item => {
        if (
          this.fileFormat.includes(item.type) &&
          item.size < this.fileMaxSize
        ) {
          return item;
        } else {
          error = true;
          return false;
        }
      });

      if (error) {
        alert("jpeg, png, webp, svg, gif");
      }

      this.files = arrFiles;
    },
    removeThisFile(e) {
      let el = e.target;
      let index = el.dataset.index;

      // удаляем из масива выбраный файл
      this.files[index] = undefined;
      this.files = this.files.filter(item => {
        return item ? item : 0;
      });
    },
    resetTextarea() {
      this.$refs.messageWrap.reset();
      this.messageText = "";
      this.files = [];
      this.messageFocused = false;
    },
    getFormData() {
      let form = new FormData();

      if (!this.messageText || this.messageText.trim() === this.valueText) {
        alert("Введите текст сообщения");
        return false;
      }

      form.append("text", this.messageText);
      form.append("comment_id", this.siteId);
      form.append("reply_to", this.replyto);

      this.files.map(item => {
        // console.log(item.name);
        form.append("file[]", item, item.name);
      });

      let userData = this.$store.state.userData;
      if (
        Object.keys(userData).length === 0 &&
        userData.constructor === Object
      ) {
        this.$store.commit("TOGGLE_POPUP", "login");
      } else {
        this.$store.dispatch("SEND_COMMENT", form);
        this.resetTextarea();
      }
    }
  },
  watch: {
    draft(newCount) {
      if (newCount && this.type === "root") {
        this.$refs.messageTextarea.value = newCount;
        this.messageText = newCount;
      }

      if (this.draft) {
        this.globalFocused();
      }
    }
  }
};
</script>

<style scoped lang="scss">
.wdg-add-smile {
  &__list {
    pointer-events: none;
    //transform: translateY(5px);
    transition: 0s;
    //transition: opacity .2s;
    opacity: 0;
    display: block;
  }

  &__btn {
    background: #f5f5f5;
    color: #474748;
  }

  &.active &__btn {
    background: #474748;
    color: #fff;
  }

  &.active &__list {
    opacity: 1;
    pointer-events: all;
    //transform: translateY(0);

    &.--left {
      position: absolute;
      right: 43px;
      top: 50%;
      bottom: inherit;
      transform: translateY(-50%);

      &:before {
        top: 50%;
        right: -1px;
        box-shadow: 1px -1px 0 #d9d8d9;
        transform: rotate(45deg) translateY(-50%);
      }
    }
  }
}

.wdg-add-smile {
  user-select: none;
}

.wdg-smile {
  cursor: pointer;
}

.wdg-add-comment__field {
  overflow: auto;
  line-height: 1.3;

  &::-webkit-scrollbar {
    width: 4px;
  }

  /* Track */
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.65);
  }

  /* Handle */
  &::-webkit-scrollbar-thumb {
    background: #888;
  }

  /* Handle on hover */
  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
}
</style>
