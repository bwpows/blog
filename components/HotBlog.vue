<template>
    <v-card class="rounded-lg" style="cursor: pointer" elevation='0'>
        <v-card-title class="pb-1"> 最新文章 </v-card-title>
        <v-card-text>
            <v-hover v-slot:default="{ hover }" v-for="(item,index) in blogs" :key="item.id">
                <div class="text-truncate my-1" :class="hover?'primary--text font-weight-bold':''" v-text="(index+1)+'. '+item.blogTitle" @click='handleTip(item)'></div>
            </v-hover>
        </v-card-text>
    </v-card>
</template>
<script>
import {byTimeGetBlog} from '~/plugins/Request'
export default {
    data: ()=>({
        blogs:[]
    }),
    created(){
        byTimeGetBlog().then(res=>{
            if(res.data.code == 2000){
                this.blogs = res.data.data.slice(0, 6)
            }
        })
    },
    methods:{
        handleTip: function (item) {
            // console.log(item)
            this.$emit('handle-tip', 'haha')
        }
    }
}
</script>