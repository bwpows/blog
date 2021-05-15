<template>
    <div>
        <!-- <div class="mt-12">
        </div> -->
        <div class="rounded-lg white mt-12 pt-6 px-4">
            <div class="mb-4 d-flex" v-if="isLogin">
                <v-btn color="primary--text" class="white" elevation="0">登录才能发表评论哦</v-btn>
            </div>

            <div class="d-flex mb-4" v-else>
                <img :src="headerImg?$store.state.configURL+headerImg:require('@/static/head.webp')" alt="头像" max-width="50" height="50" style="border-radius: 5px;" class="mr-1" />
                <v-text-field solo height="48" label="留下你的神评" v-model="commentContent" v-on:keyup.enter="publishComment()"></v-text-field>
                <v-btn height="48" large color='white primary--text' @click="publishComment()">发表</v-btn>
            </div>

            <div v-for="(item, index) in commentInfo" :key="index" class="py-2">
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
        this.headerImg = localStorage.getItem('headerImg');
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