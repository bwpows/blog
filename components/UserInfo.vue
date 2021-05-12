<template>
    <v-card class="mx-auto mt-8" elevation='0'>
        <div class="d-flex justify-space-between align-center pt-4">
            <v-card-subtitle class="title py-0">我的资料</v-card-subtitle>
            <v-btn text rounded class="primary--text" @click="$router.push('/Setting')">
                <span>编辑资料</span>
            </v-btn>
        </div>
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
    mounted () {
        this.getUserInfo()
    },
    methods: {
        // 获取用户信息
        getUserInfo(){
            getInfo({userName: localStorage.getItem('userName')}).then(res =>{
                console.log(res.data.code)
                if(res.data.code == 2000){
                    this.user = res.data.data
                    localStorage.setItem('headerImg', res.data.list[0].headerImg || '')
                }
                console.log(this.user)
            }).catch(err => {
                console.log('获取用户失败')
            })
        }
    }
}
</script>