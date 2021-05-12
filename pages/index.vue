<template>
  <v-main class="main">
    <v-row class="mx-2">
      <v-col xs='12' sm='8' md='8' lg='8' xl='8'>
        <Blog v-for="(blog, index) in blogLists" :key="index" :title=blog.blogTitle :content=blog.blogContent :classify=blog.classify :createTime=blog.updateTime :color="blog.color" @goBlogInfo="goBlogInfo(blog)" />
      </v-col>
      <v-col cols="4" class="d-none d-sm-block">
        <BwInfo />
        <HotBlog />
      </v-col>
    </v-row>

    <v-dialog v-model="sheet" fullscreen style="z-index: 2001; overflow: auto;" class="blogInfo" transition="dialog-bottom-transition">
      <v-sheet style="background-color: #f4f7fe; min-height: 100vh" class="text-center" v-if='loadingBlogInfo'>
        <v-overlay :value="loadingBlogInfo" color="rgb(255,255,255)" opacity='.9' class="text-center overlayBox" style="z-index: 1000">
          <v-progress-circular :size="60" color="primary" indeterminate></v-progress-circular>
          <div class="primary--text mt-5">正在加载...</div>
        </v-overlay>
      </v-sheet>
      <BlogInfo :userInfo='userInfo' :blogInfo='blogInfo' :commentInfo='commentInfo' :key="(new Date()).getTime()" @close='sheet = false' @delBlog='openDialog' @editBlog='editBlog' @publishComment = 'publishComment' v-else />
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
    loadingBlogInfo:true
    
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
        console.log(err)
      })
    },

    getComment(blog){
      getByBlogIdComment({blogId:blog._id}).then((res)=>{
        this.commentInfo = res.data.data
      }).catch(err=>{
        console.log(err)
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
      console.log(blog)
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
      console.log(this.seeBloger._id)
      let obj = { blogId: this.seeBloger._id, userName:localStorage.getItem('userName'), commentContent:commentContent, commentObject:localStorage.getItem('userName') }
      addComment(obj).then(res=>{
        this.commentContent = ''
        this.getComment(this.seeBloger)
      }).catch(err=>{
        console.log(err)
      })
    },

  }
}
</script>
<style>
.main /deep/ .v-bottom-sheet{
  overflow: auto;
}
.main /deep/ .v-dialog{
  overflow: auto;
}
</style>

