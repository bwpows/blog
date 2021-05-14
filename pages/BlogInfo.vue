<template>
  <v-main class="mx-4 pb-12">
    <v-row>
      <v-col xs='12' sm='8' md='8' lg='8' xl='8'>
        <div class="rounded-lg white px-4 mt-8 pt-1">
          <div class="primary--text text-h6 mt-6">{{ blogInfo.blogTitle }}</div>
          <div class="d-flex justify-space-between align-center mb-3 pt-4 white">
              <div class="d-flex align-center">
                  <img :src="userInfo.headerImg?$store.state.configURL+userInfo.headerImg:require('@/static/head.webp')" alt="头像" style="border-radius: 5px;" class="mr-4" max-width="50px" height="50px" />
                  <div class="text-body-1">
                      <div>{{ userInfo.nickName || userInfo.userName }}</div>
                      <div class="grey--text">{{ blogInfo.updateTime || blogInfo.createTime | timeFilters}}</div>
                  </div>
              </div>
              <div class="mt-1 mr-3 mb-4 grey--text" v-if="isAdmin">
                  <div @click="editBlog()" class="grey--text mr-auto">编辑文章</div>
                  <div @click="dialogInfo.dialog = true">删除文章</div>
              </div>
          </div>
          <div class="ql-container ql-snow" style="border: none; height: auto; font-size: 16px;">
              <div class="ql-editor px-0">
                  <div v-html="blogInfo.blogContent">{{blogInfo.blogContent}}</div>
              </div>
          </div>
        </div>

        <div class="mt-12">
            <div class="mb-4 d-flex justify-center" v-if="isLogin">
                <v-btn color="primary--text">登录才能发表评论哦</v-btn>
            </div>

            <div class="d-flex mb-5" v-else>
                <img :src="userInfo.headerImg?$store.state.configURL+userInfo.headerImg:require('@/static/head.webp')" alt="头像" max-width="50" height="50" style="border-radius: 5px;" class="mr-1" />
                <v-text-field solo height="48" label="留下你的神评" v-model="commentContent" v-on:keyup.enter="publishComment()"></v-text-field>
                <v-btn height="48" large color='white primary--text' @click="publishComment()">发表</v-btn>
            </div>
        </div>
        <div class="rounded-lg white">
          <div v-for="(item, index) in commentInfo" :key="index" class="pt-4 px-4">
            <div class="d-flex">
              <img :src="item.userInfo[0].headerImg?$store.state.configURL+item.userInfo[0].headerImg:require('@/static/head.webp')" alt="头像" style="border-radius: 5px;" class="mr-4" max-width="50px" height="50px" />
              <div style="width: 100%;">
                <div class="d-flex justify-space-between mb-2">
                  <div>{{item.userInfo[0].nickName}}</div>
                  <div class="grey--text body-2">{{item.commentTime | timeFilters }}</div>
                </div>
                <div class="mb-4">{{item.commentContent}}</div>
              </div>
            </div>
            <v-divider v-if="index != commentInfo.length-1"></v-divider>
          </div>
        </div>
      </v-col>
      <v-col cols="4" class="d-none d-sm-block">
        <HotBlog />
        <PushBlog />
      </v-col>
    </v-row>

    <Dialog :dialog='dialogInfo.dialog' :title="dialogInfo.title" @leftBtnEvent='dialogInfo.dialog = false' @rightBtnEvent="delBlog()" />

    <TipDialog :dialog='tipDialog.dialog' :content='tipDialog.content' @BtnEvent='tipDialog.dialog = false' />

  </v-main>
</template>

<script>
import {getBlog, getByBlogIdComment, addComment, delBlog} from '~/plugins/Request'
export default {
  data() {
    return {
      dialogInfo:{
        dialog: false,
        title: '是否删除此文章?'
      },
      tipDialog:{},
      userInfo:{},
      blogInfo:{},
      commentInfo:{},
      commentContent:'',
      isAdmin: false,
      isLogin: false,
    }
  },

  head(){
    return {
      title: this.blogInfo.blogTitle,
      meta:[
        {
          hid: 'description',
          name: 'description',
          content: this.blogInfo.blogTitle
        },
        { 
          name:'keywords', 
          content: this.blogInfo.blogTitle
        }
      ]
    }
  },

  created(){
    this.isLogin = localStorage.getItem('userName')?false:true;
    // 获取博客内容
    getBlog({_id:this.$route.query.id}).then(res=>{
      this.blogInfo = res.data.data[0]
      this.userInfo = res.data.data[0].userInfo[0]
      if(this.blogInfo.userName == localStorage.getItem('userName')){
        this.isAdmin = true
      }
    }).catch(err=>{
      // console.log(err)
    })

    this.getComment()
  },

  filters:{
      timeFilters(value){
          if(!value) return;
          return value.substring(0,10) + ' ' + value.substring(11,19)
      }
  },

  methods:{

    // 获取评论的信息
    getComment(){
      getByBlogIdComment({blogId:this.$route.query.id}).then((res)=>{
        this.commentInfo = res.data.data
      }).catch(err=>{
        // console.log(err)
      })
    },


    // 发表评论
    publishComment(){
      if(!this.commentContent){
        this.tipDialog = {
          dialog: true,
          content: '内容不能为空哦！'
        }
        return false;
      }
      let obj = { blogId: this.$route.query.id, userName:localStorage.getItem('userName'), commentContent:this.commentContent, commentObject:localStorage.getItem('userName') }
      addComment(obj).then(res=>{
        this.commentContent = ''
        this.getComment()
      }).catch(err=>{
        // console.log(err)
      })
    },

    delBlog(){
      delBlog({_id:this.$route.query.id}).then(res=>{
        if(res.data.code == 2000){
          this.tipDialog.dialog = false
          this.$router.push('/')
        }
      })
    },

    editBlog(){
      this.$router.push({
        path : './EditBlog',
        query:{id: this.$route.query.id}
      });
    }



  }

}
</script>
