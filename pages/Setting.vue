<template>
    <v-main>
        <v-row class="mx-2 mt-4">
            <v-col cols="12" sm="10" md="10" xs="12" xl="6">
                <div class="d-flex align-end my-4">
                    <img :src="user.headerImg?$store.state.configURL+user.headerImg:require('/static/head.webp')" alt="bw社区" style="width: 100px;" class="mr-7 rounded-lg"/>
                    <v-btn outlined color="primary" @click="chooseImg()">更换头像</v-btn>
                    <input type="file" ref="filElem" style="width:0;" @change="UploadHeaderImg()">
                </div>
                <div class="d-flex mt-10">
                    <v-subheader class="body-1 pl-0">昵称：</v-subheader>
                    <v-text-field solo class="rounded-lg" style="max-width: 500px;" label="对外的称呼" v-model="user.nickName"></v-text-field>
                </div>
                <div class="d-flex">
                    <v-subheader class="body-1 pl-0">职位：</v-subheader>
                    <v-text-field solo class="rounded-lg" style="max-width: 500px;" label="职位" v-model="user.job"></v-text-field>
                </div>
                <div class="d-flex">
                    <v-subheader class="body-1 pl-0">邮箱：</v-subheader>
                    <v-text-field solo class="rounded-lg" style="max-width: 500px; max-height: 60px" label="name@example.com" disabled v-model="user.userName"></v-text-field>
                </div>
                <div class="d-flex align-center">
                    <v-subheader class="body-1 pl-0">性别：</v-subheader>
                    <v-radio-group v-model="user.sex" row>
                        <v-radio label="男" value="1"></v-radio>
                        <v-radio label="女" value="2"></v-radio>
                        <v-radio label="保密" value="0"></v-radio>
                    </v-radio-group>
                </div>
                <div class="d-flex">
                    <v-subheader class="body-1 pl-0">简介：</v-subheader>
                    <v-textarea class="rounded-lg" solo name="input-7-4" label="介绍一下自己吧" v-model="user.intro"></v-textarea>
                </div>
                <v-btn color="primary" dense width="100" @click="updateUserInfo()">保存</v-btn>
            </v-col>
        </v-row>
        <v-snackbar v-model="snackbar" :timeout="timeout">
            {{ snackbarText }}
            <template v-slot:action="{ attrs }">
                <v-btn color="blue" text v-bind="attrs" @click="snackbar = false">关闭</v-btn>
            </template>
        </v-snackbar>
    </v-main>
</template>
<script>

import {upload, putInfo, getInfo} from '~/plugins/Request'
export default {
    created () {
        this.user.userName = localStorage.getItem('userName')
        this.getUserInfo()
    },
    data () {
        return {
            user:{},
            timeout: 2000,
            snackbar: false,
            snackbarText: '',
        }
    },

    head(){
        return {
            title: '编辑资料',
        }
    },

    methods: {
        // 获取个人信息
        getUserInfo(){
            getInfo({ userName: this.user.userName }).then(res => {
                if(res.data.code == 2000){
                    this.user = res.data.data
                    this.user.sex = res.data.data.sex.toString()
                    localStorage.setItem('nickName', res.data.data.nickName)
                    localStorage.setItem('headerImg', res.data.data.headerImg)
                    this.$forceUpdate()
                }else{
                    this.snackbar = false;
                    this.snackbarText = '获取个人信息失败'
                }
            })
        },
        // 更新个人博客
        updateUserInfo(){
            this.snackbar = true
            putInfo(this.user).then(res => {
                if(res.data.code == 2000){
                    this.getUserInfo()
                }
                this.snackbarText = res.data.msg
            })
        },
        // 上传图片
        chooseImg(){
            this.$refs.filElem.dispatchEvent(new MouseEvent('click'))
        },
        
        // 检测图片改变
        UploadHeaderImg(){
            let file = this.$refs.filElem.files[0]
            let formData = new FormData()
            formData.append('bowei', file)
            upload(formData).then(res=>{
                if(res.data.code == 2000){
                    this.user.headerImg = res.data.path
                    this.updateUserInfo()
                }
            })
        }
    }
}
</script>