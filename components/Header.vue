<template>
  <div>
    <div style="height: 56px;">
        <v-row justify="center" class="white pa-0 ma-0" style="position: fixed; top: 0; left: 0; width: 100vw; z-index: 998;">
          <v-col lg='9' md='12' class="pa-0 ma-0">
            <v-app-bar color="white" elevation="0">
                <v-app-bar-nav-icon @click="openDrawer()" class="d-flex d-sm-none mr-2" color='primary'></v-app-bar-nav-icon>
                <nuxt-link class="ml-2 mr-12 primary--text text-h6 pl-0" to='/' style="cursor: pointer;text-decoration:none"> BOWEI </nuxt-link>
                <div class="d-none d-sm-block">
                  <v-btn text class="mx-2 primary--text body-2 font-weight-bold" style="cursor: pointer" v-for="item in headerMenu" :key="item.to" @click="goPage(item.to)">{{ item.title }}</v-btn>
                  <v-btn text class="mx-2 primary--text body-2 font-weight-bold" style="cursor: pointer" @click="dialog = true">工单支持</v-btn>
                </div>
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="$router.push('/UserCenter')" v-if="userInfo.nickName">{{userInfo.nickName || '小诸葛'}}</v-btn>
                <v-btn text color="primary" @click="$router.push('/Login')" v-else>登录/注册</v-btn>
            </v-app-bar>
          </v-col>
        </v-row>
    </div>
    <v-navigation-drawer v-model="drawer" fixed temporary style="z-index: 999; max-height: 100vh;">
      <v-list nav dense class="pt-4">
        <div class="d-flex my-4">
          <img :src="userInfo.headerImg?$store.state.configURL+userInfo.headerImg:require('~/static/head.webp')" alt="头像" style=" height: 80px; border-radius: 5px;" class="elevation-2" />
          <div class="ml-3 my-1 d-flex flex-column justify-space-between" >
            <div class=" text-truncate" style="width: 140px;">{{userInfo.nickName}}</div>
            <div class="body-2 grey--text text--darken-2 text-truncate" style="width: 140px;">{{userInfo.intro || '暂时还没有描述哦'}}</div>
          </div>
        </div>
        <v-list-item-group v-model="group" active-class="primary--text text--accent-4">
          <v-list-item v-for="item in headerMenu" :key="item.to" @click="goPage(item.to)">
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>

          <v-list-item @click="exit()">
            <v-list-item-icon>
              <v-icon>mdi-exit-to-app</v-icon>
            </v-list-item-icon>
            <v-list-item-title>退出</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-dialog v-model="dialog" persistent max-width="600px" style="z-index: 1000">
      <v-card class="py-3 px-4">
        <v-card-title>
          <span class="headline my-4">工单提交</span>
        </v-card-title>
        <v-card-text>
          <v-text-field label="问题反馈" required solo v-model="order.question"></v-text-field>
          <v-text-field label="留下邮箱" required solo v-model="order.userName"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog = false">关闭</v-btn>
          <v-btn color="blue darken-1" text @click="feedback()">提交</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <Dialog :dialog='dialogInfo.dialog' :title="dialogInfo.title" @leftBtnEvent='dialogInfo.dialog = false' @rightBtnEvent="$router.push('/Login')" />
  </div>
</template>
<script>
import {feedback} from '~/plugins/Request'
export default {
  name: "Header",
  data: () => ({
    dialog:false,
    dialogInfo: {
      dialog: false
    },
    drawer: false,
    group: null,
    userInfo: {},
    order:{},
    headerMenu: [{
      title: '主页',
      icon: 'mdi-home',
      to: '/'
    },{
      title: '个人中心',
      icon: 'mdi-account',
      to: '/UserCenter'
    },{
      title: '编辑资料',
      icon: 'mdi-cog',
      to: '/Setting'
    },{
      title: '写文章',
      icon: 'mdi-pencil',
      to: '/EditBlog'
    }]
  }),
  created(){
    this.userInfo.nickName = localStorage.getItem('nickName') || false
    this.userInfo.headerImg = localStorage.getItem('headerImg') || false
    this.order.userName = localStorage.getItem('userName') || ''
    if(this.order.userName && !localStorage.getItem('token')){
      this.dialogInfo={
        dialog: true,
        title:'身份验证有误，请重新登录。'
      }
    }
  },
  methods:{
    openDrawer(){
      this.drawer = true
      this.userInfo.nickName = localStorage.getItem('nickName') || false
      this.userInfo.headerImg = localStorage.getItem('headerImg') || false
      this.order.userName = localStorage.getItem('userName') || ''
    },

    goPage(item){
      if(item == '/') {
        this.$router.replace('/')
      };
      if(localStorage.getItem('userName')){
        this.$router.replace(item)
      }else{
        this.dialogInfo.dialog = true;
        this.dialogInfo.title = '还没登录，是否登录？'
      }
    },
    feedback(){
      this.dialog = false
      this.$store.commit('todos/updateOverlay', {show: true, text:'正在提交反馈'})
      feedback(this.order).then(res=>{
        if(res.data.code == 2000){
          this.$store.commit('todos/updateOverlay', {show: true, text:'反馈成功'})
          setTimeout(() => {
            this.$store.commit('todos/updateOverlay', {show: false, text:''})
            this.order = {}
          }, 500);
          console.log('提交成功')
        }
      })
    },
    exit(){
      localStorage.clear()
      this.$router.replace('/')
    }
  }
};
</script>