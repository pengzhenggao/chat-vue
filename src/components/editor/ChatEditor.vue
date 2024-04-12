<template>
    <div style="position: relative">
        <vue-editor
                ref="editor"
                id="editor"
                @image-added="handleImageAdded"
                :editor-toolbar="customToolbar"
                @selection-change="handleSelectionChange"
                @input="handleInput"
                v-model="content"
                use-custom-image-handler>
        </vue-editor>
        <div style="position: absolute;bottom: 87px;left: 13px">
                            <el-popover
                                    placement="bottom"
                                    title="标题"
                                    width="500"
                                    height="700"
                                    trigger="click"
                                    v-model="emojiShow">
                                <div class="la" slot="reference"  @click="loadEmojis">
                                    <Emoji style="width: 24px;height: 24px;"/></div>
                                <div class="browBox">
                                    <ul>
                                        <li v-for="(item, index) in faceList"
                                            :key="index"
                                            @click="getBrow(index)">
                                            {{ item }}
                                        </li>
                                    </ul>
                                </div>
                            </el-popover>
        </div>
        <div style="text-align: right">
            <el-button :disabled="content.length<=0" @click="submitMessage">
                <span>发送(S)</span>
            </el-button>
        </div>

        <div>

        </div>
    </div>
</template>

<script>
    import {VueEditor} from "vue2-editor"
    import service from "../../http";
    import Emoji from "../../assets/icon/emoji.svg"
    export default {
        name: "ChatEditor",
        components: {
            VueEditor,
            Emoji
        },
        props: {
            parentContent: {
                type: String,
                default: null
            }
        },
        data() {
            return {
                content: this.parentContent,
                editorUrl: null,
                cursorPosition:0,
                emojiShow: false,
                faceList: [],
                customToolbar: [
                    ["","image", "video"]
                ]
            }
        }, methods: {
            loadEmojis() {
                const appData = require("../../assets/mate/emojis.json");
                for (let i in appData) {
                    this.faceList.push(appData[i].char);
                }
            },
            // 获取用户点击之后的标签 ，存放到输入框内
            getBrow(index) {
                const authenticContent = this.$refs.editor.quill.editor.delta.ops[0].insert
                for (let i in this.faceList) {
                    if (index.toString() === i) {

                        this.getBrowString = this.faceList[index];
                        // this.content = this.content + this.getBrowString;
                        this.content = authenticContent.substring(0, this.cursorPosition) + this.getBrowString + authenticContent.substring(this.cursorPosition)
                    }
                }
                this.emojiShow = false;
            },
            handleImageAdded(file, Editor, cursorLocation, resetUploader) {
                //upload是我封装的方法
                let formData = new FormData()
                formData.append('file', file)
                let config = {
                    headers: {'Content-Type': 'multipart/form-data'}
                }
                service.post("/upload/oss", formData, config).then((res) => {
                    if (res.code === 20000) {
                        this.editorUrl = res.message;
                        //在鼠标位置插入图片，保存的URL地址是this.editorUrl
                        Editor.insertEmbed(cursorLocation, "image", this.editorUrl);
                        resetUploader();
                    }
                });
            },
            handlePaste(event) {
                event.preventDefault();
                // 你可以在这里处理粘贴事件，例如提取粘贴的内容
                this.content = (event.clipboardData || window.clipboardData).getData('text/plain');
            },
            submitMessage() {
                this.$emit('submitMessage', this.content);
                this.content = ""
            },
            editorFocus() {
                this.$nextTick(() => {
                    this.$refs.editor.quill.focus();
                })
            },
            handleSelectionChange(range, oldRange, source) {
                if (range){
                    this.cursorPosition = range.index
                }
            },
            handleInput() {
                const selection = window.getSelection();
                if (selection.rangeCount > 0) {
                    const range = selection.getRangeAt(0);
                    const preElement = range.startContainer.parentElement;
                    console.log(range)
                    this.cursorPosition = range.startOffset
                }
            },
        }, mounted() {
            this.editorFocus()
            this.$refs.editor.$el.addEventListener('paste', this.handlePaste);
        },
        beforeDestroy() {
            this.$refs.editor.$el.removeEventListener('paste', this.handlePaste);
        }
    }
</script>

<style scoped>
    /deep/ .ql-editor {
        max-height: 45px;
        min-height: 45px !important;
        padding: 0 15px 15px 15px;
        border-bottom: none;

    }

    /deep/ .ql-toolbar.ql-snow {
        border-bottom: none;
        border-right: none;
        border-left: none;
    }

    /deep/ .quillWrapper .ql-snow.ql-toolbar {
        padding-bottom: 0
    }

    /deep/ .ql-snow .ql-editor img {
        max-width: 5%
    }

    /deep/ .ql-snow .ql-tooltip {
        margin-left: 130px;
    }

    /deep/ .ql-container.ql-snow {
        border: none;
    }

    /deep/ .el-button {
        background: #e7e8ec;
        border: none;
        color: #3ba2f4;
        padding: 12px 25px
    }
    .browBox {
        width: 100%;
        height: 200px;
        background: #e6e6e6;
        position: absolute;
        z-index: 100;
        bottom: 0;
        overflow: scroll;
    }
    .browBox ul {
        display: flex;
        flex-wrap: wrap;
        padding: 10px;
    }

    .browBox li {
        cursor: pointer;
        width: 10%;
        font-size: 26px;
        list-style: none;
        text-align: center;
    }

    .la{
        cursor: pointer;
    }
    /deep/ .el-button:focus, .el-button:hover {
        color: #3ba2f4;
        background-color: #dcdde1;
    }
</style>
