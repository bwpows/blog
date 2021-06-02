<template>
  <div class="overflow-hidden">
    <v-app-bar color="headerColor" fixed elevation="0">
      <v-row align-content='center' justify='center' class="mx-md-1 mx-xs-0">
        <v-col xs='12' sm='12' md='12' lg='9' xl='9' class="d-flex align-center pa-0">
          <v-app-bar-nav-icon @click="drawer = true" class="d-flex d-sm-none mr-2" color='primary'></v-app-bar-nav-icon>
          <nuxt-link class="ml-2 mr-12 text-h6 pl-0 pointer" to='/' style="text-decoration:none"> BOWEI </nuxt-link>
          <div class="d-none d-sm-block">
            <v-btn text class="mx-2 body-2 font-weight-bold primary--text" v-for="item in headerMenu" :key="item.to" @click="goPage(item.to)">{{ item.title }}</v-btn>
            <v-btn text class="mx-2 body-2 font-weight-bold primary--text" @click="dialog = true">工单支持</v-btn>
          </div>
          <v-spacer></v-spacer>
          <v-menu offset-y v-if="userInfo.nickName || userInfo.userName">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" text v-bind="attrs" v-on="on">{{userInfo.nickName || '小诸葛'}}</v-btn>
            </template>
            <v-list>
              <v-list-item v-for="(item, index) in userMenu" dense :key="index" @click="openMenu(item.eventName)">
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          <v-btn text @click="$router.push('/Login')" v-else>登录/注册</v-btn>
          <v-btn icon small color="primary" class="mr-2" @click="rightDrawer = true"><v-icon>mdi-cog</v-icon></v-btn>
        </v-col>
      </v-row>
    </v-app-bar>

    <v-navigation-drawer v-model="rightDrawer" fixed right temporary style="z-index: 999">
      <v-list nav class="mt-4">
          <v-list-item class="d-block">
            <v-list-item-title>模式切换</v-list-item-title>
            <v-switch label="黑夜" v-model="color.theme" @change="openMenu('theme')" inset></v-switch>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item class="d-block my-6">
            <v-list-item-title>主题颜色</v-list-item-title>
            <div class="d-flex mt-4">
              <div class="rounded-circle mr-3 d-flex align-center" v-for="item in colorData" :key="item" @click="changeTheme(item)" style="height: 18px; width: 18px;" :style="{background:item}">
                <v-icon v-if="item == color.themeColor" size="18" color="white">mdi-check</v-icon>
              </div>
            </div>
          </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-navigation-drawer v-model="drawer" fixed temporary style="z-index: 999; max-height: 100vh;">
      <v-list nav dense class="pt-4">
        <div class="d-flex my-4">
          <v-img class="rounded-lg elevation-2" height="80" aspect-ratio='1' :src="userInfo.headerImg?$store.state.configURL+userInfo.headerImg:require('~/static/head.webp')" alt="头像" />
          <div class="ml-3 my-1 d-flex flex-column justify-space-between" >
            <div class=" text-truncate" style="width: 140px;">{{userInfo.nickName || '小诸葛'}}</div>
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

    <v-dialog v-model="dialog" persistent max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline my-4">工单提交</span>
        </v-card-title>
        <v-card-text>
          <v-text-field label="问题反馈" required solo v-model="order.question"></v-text-field>
          <v-text-field label="留下邮箱" required solo v-model="order.userName"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="dialog = false">关闭</v-btn>
          <v-btn color="primary" text @click="feedback()">提交</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <Dialog :dialog='dialogInfo.dialog' :title="dialogInfo.title" @leftBtnEvent='dialogInfo.dialog = false' @rightBtnEvent="$router.push('/Login')" />
  </div>
</template>
<script>
import {feedback, getFabulous} from '~/plugins/Request'
export default {
  name: "Header",
  data: () => ({
    dialog:false,
    dialogInfo: {
      dialog: false
    },
    drawer: false,
    rightDrawer: false,
    group: null,
    userInfo: {},
    order:{},
    headerMenu: [
      { title: '主页', icon: 'mdi-home', to: '/'},
      { title: '个人中心', icon: 'mdi-account', to: 'UserCenter'},
      { title: '写文章', icon: 'mdi-pencil', to: 'EditBlog'},
      { title: '编辑资料', icon: 'mdi-cog', to: 'Setting'}
    ],
    userMenu:[
      {title:'退出登录', eventName:'exit', icon:'mdi-exit-to-app'}
    ],
    isLogin: false,
    theme:  false,
    colorData:['#1976D2','#43A047','#009688','#FF9800','#F44336'],
    color:{
      theme: false,
      topBar: '',
      themeColor: ''
    }
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
    console.log(this.$vuetify.theme.defaults.dark.primary)
  },
  methods:{
    changeTheme(item){
      this.color.themeColor = item
      this.$vuetify.theme.themes.light.primary = item
      this.$vuetify.theme.themes.dark.primary = item
    },
    
    openMenu(item){
      if(item == 'theme'){
        this.$vuetify.theme.dark = !this.$vuetify.theme.dark
        this.color.theme = this.$vuetify.theme.dark
      }else if(item == 'Setting'){
        this.$router.replace(item)
      }else if(item == 'exit'){
        this.exit()
      }else if(item == 'fabulous'){
        getFabulous({userName: this.userInfo.userName}).then(res=>{
          console.log(res)
        }).catch(err => {
          console.log(err)
        })
      }
    },

    openDrawer(){
      this.drawer = true
      // this.userInfo.nickName = localStorage.getItem('nickName') || false
      // this.userInfo.headerImg = localStorage.getItem('headerImg') || false
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
      this.$router.go('/')
    },

    workOrder(){
      this.dialog = true;
      this.drawer = false;
    }
  }
};
</script>