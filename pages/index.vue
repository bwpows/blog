<template>
  <div>
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
    </v-main>
    <Footer />
  </div>
</template>

<script>
import {byTimeGetBlog} from '~/plugins/Request'
export default {
  name: 'Home',
  data: () => ({
    blogLists: {}
    
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

  methods:{

    goBlogInfo(blog){
      this.$router.push({
        path: 'BlogInfo',
        query: { blogId: blog._id }
      })
    }

  }
}
</script>

