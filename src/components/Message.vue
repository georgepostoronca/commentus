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
      placeholder="Написать комментарий..."
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
            <div v-for="(item, index) in files" :key="index" class="wdg-file__item js-upload-item">
              <div v-html="item.input"></div>
              <div class="wdg-t">{{ item.name }}</div>
              <div class="wdg-r" :data-index="index" @click="removeThisFile"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="wdg-add-comment__r">
        <div class="wdg-add-file">
          <input type="file" name="" id="input-file-01" @change="addFile">
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
      messageFocused: false,
      messageText: ""
    };
  },
  computed: {
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
      //TODO исправить загрузку файлов и если поллучится сделать мулти загрузку
      //TODO проверка файлов на размер имя и количество
      //TODO рендерить дубликат <input>
      //TODO исправить проблему с добовлением файла в первы блок <Message> когда их больше 1

      // доступные форматы
      let format = [
        "jpg",
        "jpeg",
        "png",
        "webp",
        "svg",
        "gif",
        "pdf",
        "doc",
        "docx",
        "ppt",
        "txt"
      ];
      // регулярка для получения имя и формат файла
      let reg = /[\/\\]([^\\\/:*?\"<>|]+)$/im;
      let file = reg.exec(e.target.value)[1].split(".");
      // имя
      let fileName = file[0];
      // формат
      let fileFormat = file[1];

      // если формат не совпадает с форматами из мссива то отменяем выполнение функций
      if (!format.includes(fileFormat)) {
        alert(String(format));
        return 0;
      }

      // добовляем в массив выбраный файл
      this.files.push({
        name: fileName + "." + fileFormat || e.target.value,
        format: fileFormat,
        file: e.target.files[0]
      });
    },
    removeThisFile(e) {
      let el = e.target;
      let index = el.dataset.index;

      // удаляем из масива выбраный файл
      this.files[index] = undefined;
      this.files = this.files.filter(item => {
        console.log(item);
        return item ? item : 0;
      });
    },
    getFormData() {
      let form = new FormData;

      form.append("text", this.messageText);
      this.files.map(item => {
        form.append('file[]', item.file, item.name);
      });

      console.log(form.getAll("file[]"));
      console.log("Submit", form);
    }
  }
}
</script>

<style scoped>
.wdg-add-smile {
  user-select: none;
}

.wdg-smile {
  cursor: pointer;
}
</style>
