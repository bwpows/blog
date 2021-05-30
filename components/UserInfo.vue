<template>
    <v-card class="mx-auto mt-8" elevation='0'>
        <v-card-subtitle class="title primary--text">我的资料</v-card-subtitle>
        <v-card-text class="text--primary">
            <img :src="user.headerImg?$store.state.configURL+user.headerImg:require('/static/head.webp')" :alt="user.nickName || '小诸葛'"  class="mb-3" style="border-radius: 5px; width: 80px;">
            <div class="mb-2">昵称：{{ user.nickName || "小诸葛"}}</div>
            <div class="mb-2">职位：{{ user.job || "攻城狮"}}</div>
            <div class="mb-2 text-truncate">Email：{{ user.userName || "name@example.com" }}</div>
            <div class="mb-2">个人描述：{{ user.intro || "你还没写个人描述哦" }}</div>
        </v-card-text>
    </v-card>
</template>
<script>
import { getInfo } from '~/plugins/Request'
export default {
    data () {
        return {
            user:{}
        }
    },
    props:{
        userName: {
            type: String,
            require: true
        }
    },
    watch: {
        userName: {
            handler() {
                this.getUserInfo()
            },
            immediate: true,
            deep: true
        }
    },
    mounted () {
        this.getUserInfo();
        
    },
    methods:{
        getUserInfo(){
            console.log(this.userName)
            getInfo({userName: this.userName}).then(res =>{
                console.log(res)
                if(res.data.code == 2000){
                    this.user = res.data.data
                }
            })
        }
    }
}
</script>