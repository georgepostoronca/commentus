<template>
  <div>
    <textarea
      name=""
      @input="cursorPosition"
      @change="cursorPosition"
      @keyup.left="cursorPosition"
      @keyup.right="cursorPosition"
      @keyup.up="cursorPosition"
      @keyup.down="cursorPosition"
      @click="cursorPosition"
      ref="messageTextarea"
      cols="30"
    ></textarea>

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
</template>

<script>
export default {
  name: "Textarea",
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
      inputHeight: "0"
    };
  },
  methods: {
    // resize () {
    //   this.inputHeight = `${this.$refs.shadow.scrollHeight}px`
    // },
    selectSmile(e) {
      let textarea = this.$refs.messageTextarea;
      let smile = e.target.innerText;

      textarea.value = textarea.value.splice(this.curPosition, 0, smile);

      this.curPosition = this.curPosition + smile.length;
      textarea.focus();
    },

    cursorPosition(e) {
      console.log(e.target.scrollHeight);

      let content = e.target;
      if (
        content.selectionStart != null &&
        content.selectionStart != undefined
      ) {
        let position = content.selectionStart;
        this.curPosition = position;
        console.log(position);
      } else {
        return false;
      }
    }
  }
};
</script>

<style scoped>
.wdg-smile {
  padding: 10px;
  cursor: pointer;
  display: inline-block;
}
</style>
