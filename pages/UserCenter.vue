<template>
  <v-main>
      <v-row justify="center" class="mx-2">
          <v-col xs='12' sm='8' md='8' lg='8' xl='8'>
            <div v-if="blogLists.length == 0" class="primary--text"> 你暂时还没写博客哦 </div>
            <Blog v-else v-for="(blog, index) in blogLists" :key="index" :title=blog.blogTitle :content=blog.blogContent :classify=blog.classify :color=blog.color :createTime=blog.updateTime @goBlogInfo="goBlogInfo(blog)" />
          </v-col>
          <v-col cols="4" class="d-none d-sm-block">
            <UserInfo />
          </v-col>
      </v-row>
      <v-dialog v-model="sheet" fullscreen style="z-index: 2001; overflow: auto;" class="blogInfo" transition="dialog-bottom-transition">
        <v-sheet style="background-color: #f4f7fe; min-height: 100vh" class="text-center" v-if='loadingBlogInfo'>
          <v-overlay :value="loadingBlogInfo" color="rgb(255,255,255)" opacity='.9' class="text-center overlayBox" style="z-index: 1000">
            <v-progress-circular :size="60" color="primary" indeterminate></v-progress-circular>
            <div class="primary--text mt-12">正在加载...</div>
          </v-overlay>
        </v-sheet>
        <BlogInfo :userInfo='userInfo' :blogInfo='blogInfo' :commentInfo='commentInfo' :key="(new Date()).getTime()" @close='sheet = false' @delBlog='openDialog' @editBlog='editBlog' @publishComment = 'publishComment' />
      </v-dialog>
      <Dialog :dialog='dialogInfo.dialog' :title="dialogInfo.title" @leftBtnEvent='dialogInfo.dialog = false' @rightBtnEvent="delBlog()" />
      <TipDialog :dialog='tipDialog.dialog' :content='tipDialog.content' @BtnEvent='tipDialog.dialog = false' />
  </v-main>
</template>
<script>
  import { getInfo, byUsGetBlog, getByBlogIdComment, getBlog, addComment, delBlog } from '~/plugins/Request'
  export default {
    data: () => ({
      blogLists: [],
      user: {},

      sheet: false,
      userInfo: {},
      blogInfo: {},
      commentInfo: [],
      seeBloger: {},
      dialogInfo:{
        dialog: false,
        title: '是否删除此文章?'
      },
      tipDialog:{},
      loadingBlogInfo: false
    }),
    head(){
      return {
        title: '个人中心'
      }
    },
    mounted () {
      this.getBlogList();
      this.getUserInfo();
    },
    filters:{
      timeFilters(value){
        return value.substring(0,10) + ' ' + value.substring(11,19)
      }
    },
    methods: {

      // 获取用户信息
      getUserInfo(){
         getInfo({userName: localStorage.getItem('userName')}).then(res =>{
           console.log(res)
            if(res.data.code == 2000){
              this.user = res.data.data[0]
              localStorage.setItem('headerImg', res.data.list[0].headerImg || '')
            }
         }).catch(err => {
           console.log('获取用户失败')
         })
      },

      // 获取博客列表
      getBlogList(){
        byUsGetBlog({userName: localStorage.getItem('userName')}).then(res=>{
            if(res.data.code == 2000){
              this.blogLists = res.data.data
              this.blogLists.reverse()
              var reTag = /<img(?:.|\s)*?>/g;
              for (let i = 0; i < this.blogLists.length; i++) {
                this.blogLists[i].blogContent = this.blogLists[i].blogContent.replace(reTag, '')
              }
            }else{
              alert(res.data.msg)
            }
        }).catch(err=>{
            console.log(err)
        })
      },
      // 前往博客详情页
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
          this.loadingBlogInfo = false
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
        let obj = { blogId: this.seeBloger._id, userName:localStorage.getItem('userName'), commentContent:commentContent, commentObject:localStorage.getItem('userName') }
        addComment(obj).then(res=>{
          this.commentContent = ''
          this.getComment(this.seeBloger)
        }).catch(err=>{
          console.log(err)
        })
      },




      // 前往编辑博客
      goEditBlog(){
        this.$router.push('/EditBlog')
      },

      // 前往编辑资料页
      goEditUserInfo(){
        this.$router.push('/EditUserInfo')
      }


    }
  }
</script>

<style scoped>
  .text-over{
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    max-height: 20px;
  }
</style>