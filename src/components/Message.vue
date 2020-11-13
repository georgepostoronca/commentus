<template>
  <!-- для раскрытого состояния класс wdg-open -->
  <div class="wdg-add-comment" ref="messageWrap" :class="{'wdg-open': ifTextareaOpen}">
    <textarea class="wdg-add-comment__field"
      @input="cursorPosition"
      @change="cursorPosition"
      @keyup.left="cursorPosition"
      @keyup.right="cursorPosition"
      @keyup.up="cursorPosition"
      @keyup.down="cursorPosition"
      @click="cursorPosition"
      v-model="messageText"
      ref="messageTextarea"
      :placeholder="textarea || 'Написать комментарий...'"
    ></textarea>

    <div class="wdg-add-comment__bottom">
      <div class="wdg-add-comment__control">
        <button
          class="wdg-send wdg-btn-blue"
          type="button"
          @click="getFormData"
        >
          Отправить
        </button>

        <div class="wdg-file" v-if="files.length">
          <div class="wdg-text">Прикреплено {{ files.length }} файла:</div>

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
            id="input-file-01"
            multiple
            @change="addFile"
          />
          <label for="input-file-01">
            <span class="wdg-icon-clip"></span>
          </label>
        </div>

        <!-- открытое состояние задается классом wdg-open -->
        <div class="wdg-add-smile" ref="emojiParent">
          <div class="wdg-add-smile__btn" @click="emojiOpneClose">
            <span class="wdg-icon-smile"></span>
          </div>

          <div class="wdg-add-smile__list">
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
  </div>
</template>

<script>
// TODO собрать данные для отправки

export default {
  name: "Message",
  props: {
    textarea: String,
    type: String
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
        "😉",
      ],
      curPosition: 0,
      files: [],
      fileMaxSize: 50000,
      fileFormat: [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/svg+xml",
        "image/gif"
      ],
      messageFocused: false,
      messageText: ""
    };
  },
  computed: {
    draft: e => {
      return e.$store.state.draft;
    },
    ifTextareaOpen: e => {
      let ifText = e.messageText;
      let ifFile = e.files.length;

      return !!(ifText || ifFile || e.messageFocused);
    }
  },
  methods: {
    emojiOpneClose() {
      this.$refs.emojiParent.classList.toggle("wdg-open");
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
      if ((content.selectionStart != null) && (content.selectionStart != undefined)) {
        let position = content.selectionStart;
        this.curPosition = position;
      } else {
        return false;
      }
    },
    addFile(e) {
      //TODO проверка файлов на размер имя и количество
      //TODO исправить проблему с добовлением файла в первы блок <Message> когда их больше 1

      let files = [].slice.call(e.target.files);
      let error = false;

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
        alert(String(this.fileFormat));
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
    getFormData() {
      let form = new FormData();

      if (!this.messageText) {
        alert("Введите текст сообщения");
        return false;
      }

      form.append("text", this.messageText);
      form.append("comment_id", "20");
      form.append("reply_to", "0");

      this.files.map(item => {
        console.log(item.name);
        form.append("file[]", item, item.name);
      });

      this.$store.dispatch("SEND_COMMENT", form);

    }
  },
  watch: {
    draft(newCount) {
      if (newCount && this.type === "root") {
        this.$refs.messageTextarea.value = newCount;
        this.messageText = newCount;
      }
    }
  }
};
</script>

<style scoped>
.wdg-add-smile {
  user-select: none;
}

.wdg-smile {
  cursor: pointer;
}
</style>
