<template>
  <v-main class="mx-4 editBlog mt-6">
    <div class="d-flex align-end my-4" >
      <img :src="blogInfo.blogTitleImg?$store.state.configURL+blogInfo.blogTitleImg:require('~/static/head.webp')" alt="头像" style=" height: 100px;" class="mr-7 rounded-lg" />
      <v-btn outlined color="primary" class="rounded-lg" @click="chooseImg()">更换题图</v-btn>
      <input type="file" ref="filElem" style="width:0;" @change="UploadHeaderImg()">
    </div>
    <v-text-field label="输入文章标题" id="id" v-model="blogInfo.blogTitle" solo style="max-width: 800px;" class="mt-8 rounded-lg"></v-text-field>
    <div class="white elevation-2 rounded-lg" style="max-width: 800px;">
      <quill-editor v-model="blogInfo.blogContent" :options="editorOption" ref="myQuillEditor"
        @change="onEditorChange($event)" @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"></quill-editor>
    </div>
    <div class="grey--text mt-4 d-flex align-center">
      <span class="mr-4">分类或等级:</span>
      <div class="rounded-circle mx-2 d-flex align-center" v-for="item in colorData" :key="item" @click="blogInfo.color = item" style="height: 18px; width: 18px;" :style="{background:item}">
        <v-icon v-if="item == blogInfo.color" size="18" color="white">mdi-check</v-icon>
      </div>
    </div>
    <v-btn color="primary" class="mt-4 rounded-lg" @click="publishBlog()">发表文章</v-btn>
    <TipDialog :dialog='tipDialog.dialog' :content='tipDialog.content' @BtnEvent='tipDialog.dialog = false' />
  </v-main>
</template>

<script>
import { quillEditor } from "vue-quill-editor";
import hljs from "highlight.js";
import "highlight.js/styles/night-owl.css";
import {upload, addBlog, getBlog, putBlog} from '~/plugins/Request'

export default {
  data: () => ({
    tipDialog:{},
    type: 1, // 2代表的是编辑博客， 1代表新增博客
    blogInfo:{
      color: '#1976D2',
    },
    editorOption: {
      placeholder: "请输入正文......", // modules设置工具栏
      modules: {
        toolbar: [
          ["blockquote", "code-block", "bold", "italic", "underline", "strike", "link", "image", { header: 1 }, { header: 2 },
          { list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }, { direction: "rtl" }, 
          { color: [] }, { background: [] }, { align: [] }, { size: ["small", false, "large", "huge"] }],
        ],
        syntax: {
            highlight: text => {
                return hljs.highlightAuto(text).value; // 这里就是代码高亮需要配置的地方
            }
        }
      }
    },
    overlay: true,
    colorData:['#1976D2','#ff6260','#ffb23e','#FDD835','#43A047']
  }),

  head(){
    return {
      title: '写文章'
    }
  },

  mounted() {
    if(this.$route.query.id){
      this.type = 2
      getBlog({_id:this.$route.query.id}).then(res=>{
        if(res.data.code == 2000){
          if(res.data.data[0].userName != localStorage.getItem('userName')){
            alert('请不要企图编辑别人的博客')
          }else{
            this.blogInfo.userName = localStorage.getItem('userName')
            this.blogInfo.blogTitleImg = res.data.data[0].blogTitleImg?res.data.data[0].blogTitleImg:null
            this.blogInfo.blogTitle = res.data.data[0].blogTitle
            this.blogInfo.blogContent = res.data.data[0].blogContent
            this.blogInfo._id = res.data.data[0]._id
            this.$forceUpdate()
          }
        }
      })
    }else{
      this.blogInfo.userName = localStorage.getItem('userName')
      this.type = 1
    }
  },

  components: {
    quillEditor,
  },

  methods: {

    onEditorBlur() {
      //失去焦点事件
    },
    onEditorFocus() {
      //获得焦点事件
    },
    onEditorChange() {
      //内容改变事件
    },

    // 选择文件事件转移
    chooseImg(){
        this.$refs.filElem.dispatchEvent(new MouseEvent('click'))
    },

    // 检测图片改变
    UploadHeaderImg(){
        let file = this.$refs.filElem.files[0]
        let formData = new FormData()
        formData.append('bowei', file)
        upload(formData).then(res=>{
            if(res.data.code == 2000){
                this.blogInfo.blogTitleImg = res.data.path;
                this.$forceUpdate();
            }
        })
    },

    // 发表博客
    publishBlog(){

      if(!this.blogInfo.blogTitle){
        return this.tipDialog = {
          dialog: true,
          content: '文章标题不能为空哦！'
        }
      }else if(!this.blogInfo.blogContent){
        return this.tipDialog = {
          dialog: true,
          content: '文章内容不能为空哦！'
        }
      }


      if(this.type == 1){
        // 添加博客
        this.$store.commit('todos/updateOverlay', {show: true, text:'正在发表...'})
        addBlog(this.blogInfo).then(res => {
          if(res.data.code == 2000){
            this.$store.commit('todos/updateOverlay', {show: true, text:'发表文章成功'})
            setTimeout(() => {
              this.$store.commit('todos/updateOverlay', {show: false, text:''})
              this.$router.replace({
                path: 'UserCenter',
                query:{
                  userName: this.blogInfo.userName
                }
              })
            }, 300);
          }
        })
      }else{
        // 修改博客
        this.$store.commit('todos/updateOverlay', {show: true, text:'正在修改...'})
        putBlog(this.blogInfo).then(res => {
          if(res.data.code == 2000){
            this.$store.commit('todos/updateOverlay', {show: true, text:'修改文章成功'})
            setTimeout(() => {
              this.$store.commit('todos/updateOverlay', {show: false, text:''})
              this.$router.replace('/UserCenter')
            }, 800);
          }
        })
      }


    },

  },
};
</script>
<style scoped>
.editBlog /deep/ .ql-editor{
  min-height: 100px;
}

.editBlog /deep/ .ql-container,.ql-toolbar{
  border: none;
}

.editBlog /deep/  .ql-toolbar.ql-snow{
  border: none;
}

.overlayBox /deep/ .v-overlay__scrim{
  filter:blur(5px);
}
</style>