<template>
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
                <div v-html="blogInfo.blogContent" @click="$emit('showImg', $event)">{{blogInfo.blogContent}}</div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props:{
        userInfo:{
            type: Object,
            require: true
        },
        blogInfo:{
            type: Object,
            require: true
        }
    },

    filters:{
        timeFilters(value){
            if(!value) return;
            return value.substring(0,10) + ' ' + value.substring(11,19)
        }
    },

    created(){
        this.isAdmin = this.blogInfo.userName == localStorage.getItem('userName')?true:false
    },

    methods:{
        goUserInfo(){
            this.$router.replace({
                path: 'UserCenter',
                query:{
                    userName: this.userInfo.userName
                }
            })
        },
    }
}
</script>