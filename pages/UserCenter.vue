<template>
  <v-main>
      <v-row justify="center" class="mx-2">
          <v-col xs='12' sm='8' md='8' lg='8' xl='8'>

            <v-card class="mx-auto mt-5 rounded-lg d-sm-none" elevation='0'>
              <v-list-item three-line>
                <v-list-item-content class="pb-1">
                  <v-list-item-title>
                    昵称：{{ user.nickName || "小诸葛"}}
                  </v-list-item-title>
                  <v-list-item-subtitle>职位：{{ user.job || "攻城狮"}}</v-list-item-subtitle>
                  <v-list-item-subtitle>Email：{{ user.userName || "name@example.com" }}</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-avatar tile size="80" class="rounded-lg">
                  <v-img :src="user.headerImg?$store.state.configURL+user.headerImg:require('/static/head.webp')" :alt="user.nickName || '小诸葛'"  class="mb-3" />
                </v-list-item-avatar>
              </v-list-item>
              <v-card-actions class="pt-0 pb-4">
                <div class="body-2 ml-2" style="opacity: .8">个人描述：{{ user.intro || "你还没写个人描述哦" }}</div>
              </v-card-actions>
            </v-card>


            <v-tabs class="rounded-lg mt-8 mb-6" v-model="tab" @change='changeTabs()'>
              <v-tab v-for="item in tabData" :key="item" v-html="item"></v-tab>
            </v-tabs>
            <Blog v-for="(blog, index) in blogLists" :key="index" :title=blog.blogTitle :content=blog.blogContent :classify=blog.classify :color=blog.color :createTime=blog.updateTime @goBlogInfo="goBlogInfo(blog)" />
            <div v-if="blogLists.length == 0" class="primary--text mt-5"> 暂时还没有博客哦 </div>
          </v-col>
          <v-col cols="4" class="d-none d-sm-block">
            <UserInfo :userName=user.userName />
          </v-col>
      </v-row>
      <TipDialog :dialog='tipDialog.dialog' :content='tipDialog.content' @BtnEvent='tipDialog.dialog = false' />
  </v-main>
</template>
<script>
  import { getInfo, byUsGetBlog, getFabulous} from '~/plugins/Request'
  export default {
    data: () => ({
      blogLists: [],
      user: {},
      userInfo: {},
      blogInfo: {},
      commentInfo: [],
      tipDialog:{},
      tab:'',
      tabData:['我的博客','我的点赞']
    }),
    head(){
      return {
        title: '个人中心'
      }
    },
    mounted () {
      this.getBlogList(this.$route.query.userName);
      this.getUserInfo(this.$route.query.userName);
    },
    filters:{
      timeFilters(value){
        return value.substring(0,10) + ' ' + value.substring(11,19)
      }
    },
    methods: {

      // 获取用户信息
      getUserInfo(userName){
         getInfo({userName}).then(res =>{
            if(res.data.code == 2000){
              this.user = res.data.data
            }
         })
         console.log(this.user)
      },

      // 获取我的博客列表
      getBlogList(userName){
        byUsGetBlog({userName}).then(res=>{
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
        })
      },

      // 获取我的点赞博客信息
      getFabulous(userName){
        getFabulous({userName}).then(res=>{
          if(res.data.code == 2000){
            console.log('这是', res)
            this.blogLists = res.data.data
            this.blogLists.reverse()
            var reTag = /<img(?:.|\s)*?>/g;
            for (let i = 0; i < this.blogLists.length; i++) {
              this.blogLists[i].blogContent = this.blogLists[i].blogContent.replace(reTag, '')
            }
          }else{
            alert(res.data.msg)
          }
        })
      },

      // 前往博客详情页
      goBlogInfo(blog){
        this.$router.push({
          path: 'BlogInfo',
          query: { blogId: blog._id }
        })
      },

      // 切换状态
      changeTabs(){
        if(this.tab == 1){
          this.getFabulous(this.$route.query.userName)
        }else if(this.tab == 0){
          this.getBlogList(this.$route.query.userName)
        }
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