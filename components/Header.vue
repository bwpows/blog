<template>
  <div>
    <v-app-bar class="headerColor" elevation="0">
      <v-row align-content='center' justify='center'>
        <v-col xs='12' sm='12' md='12' lg='9' xl='9' class="d-flex align-center pa-0">
          <v-app-bar-nav-icon @click="openDrawer()" class="d-flex d-sm-none mr-2" color='primary'></v-app-bar-nav-icon>
          <nuxt-link class="ml-2 mr-12 text-h6 pl-0 pointer" to='/' style="text-decoration:none"> BOWEI </nuxt-link>
          <div class="d-none d-sm-block"> 
            <v-btn text class="mx-2 body-2 font-weight-bold primary--text" v-for="item in headerMenu" :key="item.to" @click="goPage(item.to)">{{ item.title }}</v-btn>
            <v-btn text class="mx-2 body-2 font-weight-bold primary--text" @click="dialog = true">工单支持</v-btn>
          </div>
          <v-spacer></v-spacer>

          <v-menu offset-y v-if="userInfo.nickName">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" text v-bind="attrs" v-on="on">{{userInfo.nickName || '小诸葛'}}</v-btn>
            </template>
            <v-list>
              <v-list-item v-for="(item, index) in userMenu" dense :key="index" @click="openMenu(item.eventName)">
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          <!-- <v-btn color="primary" text  v-if="userInfo.nickName" @click="goUserCenter()">{{userInfo.nickName || '小诸葛'}}</v-btn> -->
          <v-btn text @click="$router.push('/Login')" v-else>登录/注册</v-btn>
        </v-col>
      </v-row>
        
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" fixed temporary style="z-index: 999; max-height: 100vh;">
      <v-list nav dense class="pt-4">
        <div class="d-flex my-4">
          <img :src="userInfo.headerImg?$store.state.configURL+userInfo.headerImg:require('~/static/head.webp')" alt="头像" style=" height: 80px; border-radius: 5px;" class="elevation-2" />
          <div class="ml-3 my-1 d-flex flex-column justify-space-between" >
            <div class=" text-truncate" style="width: 140px;">{{userInfo.nickName}}</div>
            <div class="body-2 grey--text text--darken-2 text-truncate" style="width: 140px;">{{userInfo.intro || '暂时还没有描述哦'}}</div>
          </div>
        </div>

        <v-btn text class="mt-4 primary--text" v-if="!isLogin" @click="$router.replace('Login')">还没登录，点击登录？</v-btn>

        <v-list-item-group v-model="group" active-class="primary--text text--accent-4" v-else>
          <v-list-item v-for="item in headerMenu" :key="item.to" @click="goPage(item.to)">
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>

          <v-list-item @click="workOrder()">
            <v-list-item-icon>
              <v-icon>mdi-cloud-question</v-icon>
            </v-list-item-icon>
            <v-list-item-title>工单提交</v-list-item-title>
          </v-list-item>

          <v-list-item v-for="item in userMenu" :key="item.to" @click="openMenu(item.eventName)">
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
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
    headerMenu: [
      { title: '主页', icon: 'mdi-home', to: '/'},
      { title: '个人中心', icon: 'mdi-account', to: 'UserCenter'},
      { title: '写文章', icon: 'mdi-pencil', to: 'EditBlog'}
    ],
    userMenu:[
      {title:'编辑资料', eventName:'editInfo', icon:'mdi-cog'},
      {title:'我的点赞', eventName:'fabulous', icon:'mdi-thumb-up'},
      {title:'切换主题', eventName:'theme', icon:'mdi-weather-sunset'},
      {title:'退出登录', eventName:'exit', icon:'mdi-exit-to-app'}
    ],
    isLogin: false
  }),
  created(){
    this.isLogin = localStorage.getItem('userName')?true:false

    this.userInfo.nickName = localStorage.getItem('nickName') || false
    this.userInfo.headerImg = localStorage.getItem('headerImg') || false
    this.userInfo.userName = localStorage.getItem('userName') || false
    this.order.userName = localStorage.getItem('userName') || ''
    if(this.order.userName && !localStorage.getItem('token')){
      this.dialogInfo={
        dialog: true,
        title:'身份验证有误，请重新登录。'
      }
    }
  },
  methods:{
    openMenu(item){
      if(item == 'theme'){
        this.$vuetify.theme.dark = !this.$vuetify.theme.dark
      }else if(item == 'editInfo'){
        this.$router.replace('Setting')
      }else if(item == 'exit'){
        this.exit()
      }
    },
    openDrawer(){
      this.drawer = true
      this.userInfo.nickName = localStorage.getItem('nickName') || false
      this.userInfo.headerImg = localStorage.getItem('headerImg') || false
    },

    goPage(item){
      if(item == '/') {
        this.$router.replace('/')
      };
      if(item == 'UserCenter'){
        console.log(localStorage.getItem('userName'))
        this.goUserCenter()
      }else{
        this.$router.replace(item)
      }
    },

    goUserCenter(){
      this.$router.replace({
        path: 'UserCenter', query:{ userName: localStorage.getItem('userName')}
      })
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
          }, 300);
        }
      })
    },

    exit(){
      localStorage.clear()
      this.$router.go(0)
    },

    workOrder(){
      this.dialog = true;
      this.drawer = false;
    }
  }
};
</script>