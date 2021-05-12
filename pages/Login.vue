<template>
    <div class = 'bgImage'>
        <div class="bgImage-mask d-flex justify-center align-center">
            <div class="loginDiv d-flex justify-space-between">
                <div class="loginText d-none d-sm-flex">
                    <div class="white--text title">用心创作，与君同行</div>
                </div>
                <div class="white loginInput">
                    <div class="mx-10 logo-btn">
                        <div class="text-center title pb-12 primary--text font-weight-bold" style="z-index: 1000; position: relative;">
                            <span>{{isLogin?'登录账号':'注册账号'}}</span>
                        </div>
                        <div style="position: relative;">
                            <v-text-field label="请输入邮箱号" @input="checkLoginInput()" solo v-model="userName"></v-text-field>
                            <v-btn text color="primary" rounded style="position: absolute; right: 0;top:6px" :disabled="getCodeBtnDis" @click="sendCode()" v-if="!isLogin && regStep == 1">{{second?(second+'S后重试'):'获取验证码'}}</v-btn>
                        </div>
                        <v-text-field label="请输入验证码" solo v-model="code" @input="checkNextInput()" v-if="!isLogin  && regStep == 1"></v-text-field>
                        <v-text-field label="密码" v-if="isLogin" solo v-model="userPwd" @click:append="showPassword = !showPassword" :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"  
                        :type="showPassword ? 'text' : 'password'" @input="checkLoginInput()"></v-text-field>
                        <v-text-field label="密码" v-else-if="!isLogin && regStep == 2" solo v-model="userPwd" @click:append="showPassword = !showPassword" 
                        :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"  :type="showPassword ? 'text' : 'password'"  @input="checkLoginInput()"></v-text-field>
                        <div class="caption primary--text text-end"  v-if="isLogin">
                            <v-btn text rounded color="primary" @click="isLogin = false">还没账号？点击注册</v-btn>
                        </div>
                        <div class="caption primary--text text-end"  v-else>
                            <v-btn text rounded color="primary" @click="isLogin = true">已有账号？点击登录</v-btn>
                        </div>
                        <div class="text-center pt-12">
                            <v-btn class="primary" width="100%" rounded @click="login()" v-if="isLogin" :disabled="loginBtnDis" :loading='loginBtnLoading'>登录</v-btn>
                            <v-btn class="primary" width="100%" rounded @click="verCode()" v-else-if="!isLogin && regStep == 1"  :disabled="nextBtnDis" :loading='nextBtnLoading'>下一步</v-btn>
                            <v-btn class="primary" width="100%" rounded @click="reg()" v-else-if="!isLogin && regStep == 2" :disabled="regBtnDis" :loading='regBtnLoading'>注册</v-btn>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <v-dialog v-model="dialog" max-width="290" persistent>
            <v-card>
                <div class="body-1 text-center py-6 grey--text text--darken-2" v-text="dialogText?dialogText:'正在处理，请稍后...'"></div>
                <v-divider></v-divider> 
                <v-btn color="primary" text x-large @click="dialog = false" style="width: 100%; height: 50px;">确定</v-btn>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
const { sha256 } = require("js-sha256")
import { login, sendMail, venCode, reg } from '~/plugins/Request'
export default {
    data: ()=>({
        userName: '',
        userPwd: '',
        showPassword: false,
        
        isLogin: true,
        code: '',
        regStep: 1,
        second: 0,
        nextBtnDis:true,
        nextBtnLoading: false,
        getCodeBtnDis: true,
        regBtnDis:true,
        regBtnLoading: false,
        loginBtnDis:true,
        loginBtnLoading: false,
        dialog: false,
        dialogText: ''

    }),

    head(){
        return {
            title: '账号登录/注册'
        }
    },

    methods:{
        checkLoginInput(){
            if(this.checkUsername() && this.userPwd){
                this.loginBtnDis = false
                this.regBtnDis = false
            }else{
                this.loginBtnDis = true
                this.regBtnDis = true
            }
        },
        checkNextInput(){
            if(this.checkUsername() && this.code){
                this.nextBtnDis = false
            }else{
                this.nextBtnDis = true
            }
        },
        checkUsername(){
            var myreg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
            if (!myreg.test(this.userName)) {
                return false
            } else {
                if(this.second == 0){
                    this.getCodeBtnDis = false
                }else{
                    this.getCodeBtnDis = true
                }
                return true
            }
        },
        // 登录页面
        login(){
            login({userName:this.userName, password:sha256(this.userPwd)}).then(res=>{
                if(res.data.code == 2000){
                    localStorage.setItem('userName', this.userName)
                    localStorage.setItem('nickName', res.data.data.nickName)
                    localStorage.setItem('headerImg', res.data.data.headerImg)
                    localStorage.setItem('token', res.data.data.token)
                    this.$router.replace('/')
                }else{
                    this.dialog = true
                    this.dialogText = res.data.msg
                }
            }).catch(err=>{
                console.log(err)
            })
        },

        // 发送邮箱验证码
        sendCode(){
            this.getCodeBtnDis = true
            sendMail({mail: this.userName}).then(res=>{
                if(res.data.code == 2000){
                    this.dialog = true
                    this.dialogText = "已发送验证码，请注意查收"
                    setTimeout(() => {
                        this.dialog = false
                    }, 3000);
                    this.second = 60
                    clearInterval(tv)
                    var tv = setInterval(() => {
                        --this.second;
                        if(this.second == 0){
                            this.getCodeBtnDis = false
                            clearInterval(tv)
                        }else{
                            this.getCodeBtnDis = true
                        }
                    }, 1000);
                }else{
                    this.getCodeBtnDis = false
                    this.dialog = true
                    this.dialogText = res.data.msg
                }
            }).catch(err=>{
                console.log(err)
            })

        },
        // 校验 验证码页面
        verCode(){
            venCode({mail:this.userName, mailCode: this.code}).then(res=>{
                if(res.data.code == 2000){
                    this.regStep = 2
                    console.log('验证码正确')
                }else{
                    this.dialog = true
                    this.dialogText = '验证码错误'
                }
            }).catch(err=>{
                console.log(err)
            })
        },
        
        // 注册页面
        reg(){
            reg({userName:this.userName, password:sha256(this.userPwd), mailCode:this.code}).then(res=>{
                if(res.data.code == 2000){
                    this.login()                // 注册成功之后该执行的函数
                }else{
                    console.log('注册失败')     // 注册失败执行的函数
                }
            }).catch(err=>{
                console.log(err)                // 发生错误执行的函数
            })
        },
        
    }
}
</script>
<style scoped>

.bgImage{  
        background-image: url('/bg.webp');
        background-size:cover;
        background-repeat: no-repeat;
        height: 100vh;
        width: 100vw;
}
.bgImage-mask{
    height:100%;
    width:100%;
    background: rgba(0,0,0,.5);
}
.loginDiv{
    height: 570px; width:760px;
    background: url('/bgT.webp') no-repeat;
    background-size:100% 100%;
}
.loginText{
    display: inline-block;
    width: 100%;
    height: 570px;
}

@media only screen and (min-width: 751px){
    .loginInput{
        display: inline-block;
        width: 100%;
        height: 570px;
    }
    .logo-btn{
        margin-top: 70px;
    }
}
@media only screen and (max-width: 750px){
    .loginInput{
        position: fixed;
        top: 0px;
        left: 0;
        right: 0;
        height: 100vh;
    }
    .loginInput::before{
        content: '';
        position: fixed;
        top: 0px;
        left: 0;
        right: 0;
        display: inline-block;
        width: 100%;
        height: 100vh;
        background: url('/bgT.webp') no-repeat;
        background-size:100% 100%;
        filter: blur(5px);
    }
    .logo-btn{
        margin-top: 150px;
    }
}


.loginText{
    background: #00000060;
    padding-top: 120px;
    padding-left: 50px;
}
.loginDivMob{
    height: 100vh;
    width: 100vw;
    background: url('/bgT.webp');
    background-size: cover;
}
</style>

