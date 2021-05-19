<template>
  <v-main>
    <v-row class="mx-2">
      <v-col xs='12' sm='8' md='8' lg='8' xl='8'>
        <Blog v-for="(blog, index) in blogLists" :key="index" :title=blog.blogTitle :content=blog.blogContent :classify=blog.classify :createTime=blog.updateTime :color="blog.color" @goBlogInfo="goBlogInfo(blog)" />
      </v-col>
      <v-col cols="4" class="d-none d-sm-block">
        <BwInfo />
        <HotBlog @blogInfo='goBlogInfo()' />
      </v-col>
    </v-row>

    <v-dialog v-model="sheet" fullscreen style="z-index: 2001; overflow: auto;" class="blogInfo" transition="dialog-bottom-transition">
      <v-sheet style="min-height: 100vh" class="text-center backgroundColor" v-if='loadingBlogInfo'>
        <v-overlay :value="loadingBlogInfo" opacity='.9' class="text-center overlayBox" style="z-index: 1000">
          <v-progress-circular :size="60" color="primary" indeterminate></v-progress-circular>
          <div class="primary--text mt-5">正在加载...</div>
        </v-overlay>
      </v-sheet>

      <v-sheet style="overflow-y: hidden; min-height: 100vh;" class="backgroundColor" v-else>
        <div style="z-index: 2001; position: relative; max-width: 1400px; margin: 0 auto; opacity: 0.9">
          <v-btn fab small class="grey darken-2 mt-4 mx-3" @click="sheet=false" elevation="0" style="position: fixed;">
            <v-icon color="white" size="28">mdi-close</v-icon>
          </v-btn>
        </div>
        <v-row style="max-width: 1400px; margin: 60px auto;">
          <v-col xs='12' sm='8' md='8' lg='8' xl='8'>
            <BlogContent :blogInfo='blogInfo' :userInfo='userInfo' @showImg="showImg" @editBlog='editBlog' @delBlog='openDialog' :key="(new Date()).getTime()" />
            <Comment :commentInfo='commentInfo' @publishComment='publishComment' />
          </v-col>
          <v-col cols="4" class="d-none d-sm-block">
            <HotBlog @blogInfo='updateBlogInfo()' />
          </v-col>
        </v-row>
        <ImgPreview :imgPreview='imgPreview' />
      </v-sheet>
    </v-dialog>
    <TipDialog :dialog='tipDialog.dialog' :content='tipDialog.content' @BtnEvent='tipDialog.dialog = false' />
    <Dialog :dialog='dialogInfo.dialog' :title="dialogInfo.title" @leftBtnEvent='dialogInfo.dialog = false' @rightBtnEvent="delBlog()" />
  </v-main>
</template>

<script>
import {byTimeGetBlog, getByBlogIdComment, getBlog, delBlog, addComment} from '~/plugins/Request'
export default {
  name: 'Home',
  data: () => ({
    blogLists: {},
    userInfo: {},
    blogInfo: {},
    commentInfo: [],
    sheet: false,
    isLogin: false,
    isAdmin: false,
    commentContent: '',
    dialogInfo:{
      dialog: false,
      title: '是否删除此文章?'
    },
    tipDialog:{},
    seeBloger:{},
    loadingBlogInfo:true,
    imgPreview:{img:"",show:false}
    
  }),
  async asyncData(){
    let blogs = await byTimeGetBlog();

    if(blogs.data.code != 2000) return false;
    blogs = blogs.data.data.reverse();

    var reTag = /<img(?:.|\s)*?>/g;
    for (let i = 0; i < blogs.length; i++) {
      blogs[i].blogContent = blogs[i].blogContent.replace(reTag, '')
    }
    
    return {
      blogLists: blogs
    }
  },
  created(){
    this.isLogin = localStorage.getItem('userName')?false:true;
  },

  methods:{
    goBlogInfo(blog){
      this.loadingBlogInfo = true
      this.sheet = true
      this.seeBloger = blog
      this.getComment(blog)
      getBlog({_id:blog._id}).then(res=>{
        this.blogInfo = res.data.data[0]
        this.userInfo = res.data.data[0].userInfo[0]
        if(this.blogInfo.userName == localStorage.getItem('userName')){
          this.isAdmin = true
        }else{
          this.isAdmin = false
        }
        this.loadingBlogInfo = false
      }).catch(err=>{
      })
    },

    getComment(blog){
      getByBlogIdComment({blogId:blog._id}).then((res)=>{
        this.commentInfo = res.data.data
      }).catch(err=>{
      })
    },

    openDialog(blog){
      this.dialogInfo.dialog = true
      this.seeBloger = blog
    },

    delBlog(){
      delBlog({_id:this.seeBloger._id}).then(res=>{
        if(res.data.code == 2000){
          this.dialogInfo.dialog = false
          this.sheet = false
          this.$router.go(0)
        }
      })
    },

    editBlog(blog){
      this.$router.push({
        path : './EditBlog',
        query:{id: blog._id}
      });
    },

    publishComment(commentContent){
      if(!commentContent){
        this.tipDialog = {
          dialog: true,
          content: '内容不能为空哦！'
        }
        return false;
      }
      let obj = { blogId: this.seeBloger._id, userName:localStorage.getItem('userName'), commentContent:commentContent, commentObject:localStorage.getItem('userName') }
      addComment(obj).then(res=>{
        this.commentContent = ''
        this.getComment(this.seeBloger)
      }).catch(err=>{
      })
    },

    showImg(e) {
      if (e.target.tagName == 'IMG') {
        this.imgPreview.img = e.target.src
        this.imgPreview.show = true
      }
    },

  }
}
</script>

