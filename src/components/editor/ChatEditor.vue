<template>
    <div>
        <vue-editor
                ref="editor"
                id="editor"
                @image-added="handleImageAdded"
                :editor-toolbar="customToolbar"
                v-model="content"
                use-custom-image-handler>
        </vue-editor>
        <div style="text-align: right"><el-button  @click="submitMessage">发送(S)</el-button></div>
    </div>
</template>

<script>
    import { VueEditor } from "vue2-editor"
    import service from "../../http";
    export default {
        name: "ChatEditor",
        components:{
            VueEditor
        },
        props:{
            parentContent:{
                type:String,
                default:null
            }
        },
        data(){
            return{
                content:this.parentContent,
                editorUrl:null,
                customToolbar: [
                    ["image","video"]
                ]
            }
        },methods:{
            handleImageAdded(file, Editor, cursorLocation, resetUploader) {
                //upload是我封装的方法
                let formData = new FormData()
                formData.append('file', file)
                let config = {
                    headers: {'Content-Type': 'multipart/form-data'}
                }
                service.post("/upload/oss",formData,config).then((res) => {
                    if (res.code === 20000) {
                        this.editorUrl = res.message
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
            submitMessage(){
                this.$emit('submitMessage',this.content);
                this.content = ""
            },
            editorFocus(){
                this.$nextTick(() => {
                    this.$refs.editor.quill.focus();
                })
            }
        },mounted() {
           this.editorFocus()
            this.$refs.editor.$el.addEventListener('paste', this.handlePaste);
        },
        beforeDestroy() {
            this.$refs.editor.$el.removeEventListener('paste', this.handlePaste);
        }
    }
</script>

<style scoped>
    /deep/.ql-editor{
        max-height: 45px;
        min-height: 45px !important ;
        padding: 0 15px 15px 15px;
        border-bottom: none;

    }
    /deep/.ql-toolbar.ql-snow{
        border-bottom: none;
        border-right: none;
        border-left: none;
    }
    /deep/.quillWrapper .ql-snow.ql-toolbar{
        padding-bottom:0
    }
    /deep/.ql-snow .ql-editor img{
        max-width:5%
    }
    /deep/.ql-snow .ql-tooltip{
        margin-left: 130px;
    }
    /deep/.ql-container.ql-snow{
        border: none;
    }
    /deep/.el-button{
        background: #e7e8ec;
        border: none;
        color: #3ba2f4;
        padding:12px 25px
    }
    /deep/.el-button:focus, .el-button:hover{
        color: #3ba2f4;
        background-color: #dcdde1;
    }
</style>
