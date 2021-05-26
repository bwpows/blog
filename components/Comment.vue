<template>
    <div>
        <div class="rounded-lg mt-12 pt-3">
            <div class="mb-4 d-flex" v-if="isLogin">
                <v-btn color="primary--text" elevation="0">登录才能发表评论哦</v-btn>
            </div>

            <div class="d-flex mb-4" v-else>
                <img :src="headerImg?$store.state.configURL+headerImg:require('@/static/head.webp')" alt="头像" max-width="50" height="50" class="mr-1  rounded-lg" />
                <v-text-field solo height="48" label="留下你的神评" v-model="commentContent" v-on:keyup.enter="publishComment()"></v-text-field>
                <v-btn height="48" large color='primary--text' @click="publishComment()">发表</v-btn>
            </div>

            <v-card v-for="(item, index) in commentInfo" :key="index" class="py-4 px-4 my-3 rounded-lg" elevation="0">
                <div class="d-flex">
                    <img :src="item.userInfo[0].headerImg?$store.state.configURL+item.userInfo[0].headerImg:require('@/static/head.webp')" alt="头像" style="border-radius: 5px;" class="mr-4" max-width="50px" height="50px" />
                    <div style="width: 100%;">
                        <div class="d-flex justify-space-between mb-2">
                            <div>{{item.userInfo[0].nickName}}</div>
                            <div class="grey--text body-2">{{item.commentTime | timeFilters }}</div>
                        </div>
                        <div>{{item.commentContent}}</div>
                    </div>
                </div>
            </v-card>
        </div>
    </div>
</template>
<script>
export default {
    props:{
        commentInfo:{
            type: Array,
            require: true
        }
    },

    data:()=>({
        commentContent: ''
    }),

    created(){
        this.isLogin = localStorage.getItem('userName')?false:true;
        console.log(localStorage.getItem('headerImg'))
        this.headerImg = localStorage.getItem('headerImg')?localStorage.getItem('headerImg'):false;
    },

    filters:{
        timeFilters(value){
            if(!value) return;
            return value.substring(0,10) + ' ' + value.substring(11,19)
        }
    },

    methods:{
        publishComment(){
            this.$emit('publishComment', this.commentContent)
            this.commentContent = ''
        }
    }
}
</script>