<template>
    <v-sheet style="overflow-y: hidden; min-height: 100vh; background-color: #f5f5f5">
      <div style="z-index: 2001; position: relative; max-width: 1400px; margin: 0 auto; opacity: 0.9">
        <v-btn fab small class="grey darken-2 mt-4 mx-3" @click="$emit('close')" elevation="0" style="position: fixed;">
          <v-icon color="white" size="28">mdi-close</v-icon>
        </v-btn>
      </div>
      <v-row style=" max-width: 1400px; margin: 60px auto;">
        <v-col xs='12' sm='8' md='8' lg='8' xl='8'>
          <div class="rounded-lg white px-4 pt-1">
            <div class="primary--text text-h5 mt-6">{{ blogInfo.blogTitle }}</div>
            <div class="d-flex justify-space-between align-center mb-3 pt-4 white">
                <div class="d-flex align-center">
                    <img :src="userInfo.headerImg?$store.state.configURL+userInfo.headerImg:require('@/static/head.webp')" alt="头像" style="border-radius: 5px;" class="mr-4 pointer" max-width="50px" height="50px" @click="goUserInfo()" />
                    <div class="text-body-1">
                        <div>{{ userInfo.nickName || userInfo.userName }}</div>
                        <div class="grey--text">{{ blogInfo.updateTime || blogInfo.createTime | timeFilters}}</div>
                    </div>
                </div>
                <div class="mt-1 mr-3 mb-4 grey--text" v-if="isAdmin">
                    <div @click="$emit('editBlog', blogInfo)" class="grey--text mr-auto">编辑文章</div>
                    <div @click="$emit('delBlog', blogInfo)">删除文章</div>
                </div>
            </div>
            <div class="ql-container ql-snow" style="border: none; height: auto; font-size: 16px;">
                <div class="ql-editor px-0">
                    <div v-html="blogInfo.blogContent" @click="showImg($event)">{{blogInfo.blogContent}}</div>
                </div>
            </div>
          </div>

          <div class="mt-12">
              <div class="mb-10 d-flex" v-if="isLogin">
                  <v-btn color="primary--text" class="white" elevation="0">登录才能发表评论哦</v-btn>
              </div>

              <div class="d-flex mb-5" v-else>
                  <img :src="headerImg?$store.state.configURL+headerImg:require('@/static/head.webp')" alt="头像" max-width="50" height="50" style="border-radius: 5px;" class="mr-1" />
                  <v-text-field solo height="48" label="留下你的神评" v-model="commentContent" v-on:keyup.enter="$emit('publishComment', commentContent)"></v-text-field>
                  <v-btn height="48" large color='white primary--text' @click="$emit('publishComment', commentContent)">发表</v-btn>
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
        </v-col>
      </v-row>
      <v-dialog v-model="imgPreview.show" scrollable fullscreen :overlay="false" overlay-color='black'>
          <div class="imgDolg" v-show="imgPreview.show" @click="imgPreview.show = false">
            <i class="el-icon-close" id="imgDolgClose" @click="imgPreview.show = false"></i>
            <img @click.stop="imgPreview.show = !imgPreview.show" :src="imgPreview.img" />
          </div>
      </v-dialog>
    </v-sheet>
</template>
<script>
export default {
    props:{
        commentInfo:{
            type: Array,
            require: true
        },
        blogInfo:{
            type: Object,
            require: true
        },
        userInfo:{
            type: Object,
            require: true
        }
    },
    created(){
        this.isAdmin = this.blogInfo.userName == localStorage.getItem('userName')?true:false
        this.isLogin = localStorage.getItem('userName')?false:true;
        this.headerImg = localStorage.getItem('headerImg');
    },
    data: ()=>({
        admin: false,
        isLogin: false,
        commentContent: '',
        headerImg: '',
        imgPreview:{
          img:"",
          show:false
        }
    }),
    filters:{
        timeFilters(value){
            if(!value) return;
            return value.substring(0,10) + ' ' + value.substring(11,19)
        }
    },
    methods:{
      showImg(e) {
        if (e.target.tagName == 'IMG') {
          this.imgPreview.img = e.target.src
          this.imgPreview.show = true
        }
      },
      goUserInfo(){
        this.$router.replace({
          path: 'UserCenter',
          query:{
            userName: this.userInfo.userName
          }
        })
      }
    }
}
</script>
<style scoped>
.imgDolg {
  width: 100vw;
  height: 100vh;
  position: fixed;
  z-index: 9999;
  background-color: rgba(0, 0, 0, 0.7);
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
#imgDolgClose {
  position: fixed;
  top: 35px;
  cursor: pointer;
  right: 7%;
  font-size: 50px;
  color: white;
}
.imgDolg  img{
  width: 80%;
}
</style>