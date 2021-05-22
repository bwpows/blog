<template>
    <div>
        <v-main>
            <v-row style="max-width: 1400px; margin: 32px auto;" v-if='!overlay.show'>
                <v-col xs='12' sm='8' md='8' lg='8' xl='8'>
                    <BlogContent :blogInfo='blogInfo' :userInfo='userInfo' @showImg="showImg" @editBlog='editBlog' @delBlog='dialogInfo.dialog = true' />
                    <Comment :commentInfo='commentInfo' @publishComment='publishComment' />
                </v-col>
                <v-col cols="4" class="d-none d-sm-block">
                    <HotBlog />
                </v-col>
            </v-row>
            <Overlay :overlay=overlay v-else />
            <ImgPreview :imgPreview='imgPreview' />
        </v-main>
        <TipDialog :dialog='tipDialog.dialog' :content='tipDialog.content' @BtnEvent='tipDialog.dialog = false' />
        <Dialog :dialog='dialogInfo.dialog' :title="dialogInfo.title" @leftBtnEvent='dialogInfo.dialog = false' @rightBtnEvent="delBlog()" />
    </div>
</template>
<script>
import { getByBlogIdComment, getBlog, delBlog, addComment} from '~/plugins/Request'
export default {
    data:()=>({
        userInfo: {},
        commentInfo: [],
        blogInfo: {},
        imgPreview:{img:"",show:false},
        tipDialog:{},
        dialogInfo:{ dialog: false, title: '是否删除此文章?'},
        overlay: { show: true, content: '正在更新...' },
    }),
    created(){
        this.getComment()
        this.getBlogInfo()
    },
    methods:{

        // 获取评论列表
        getComment(){
            getByBlogIdComment({blogId:this.$route.query.blogId}).then(res=>{
                this.commentInfo = res.data.data
            })
        },

        // 获取博客内容
        getBlogInfo(){
            getBlog({_id:this.$route.query.blogId}).then(res=>{
                this.blogInfo = res.data.data[0]
                this.userInfo = res.data.data[0].userInfo[0]
                this.overlay.show = false;
            })
        },

        // 发表评论
        publishComment(commentContent){
            if(!commentContent){
                this.tipDialog = { dialog: true, content: '内容不能为空哦！'}
                return false;
            }
            let obj = { blogId: this.blogInfo._id, userName:localStorage.getItem('userName'), commentContent:commentContent, commentObject:localStorage.getItem('userName') }
                addComment(obj).then(res=>{
                    this.getComment()
                }).catch(err=>{
            })
        },

        // 预览图片
        showImg(e) {
            if (e.target.tagName == 'IMG') {
                this.imgPreview.img = e.target.src
                this.imgPreview.show = true
            }
        },

        // 删除博客
        delBlog(){
            this.dialogInfo.dialog = false
            this.overlay = {show: true, content: '正在删除...'}
            delBlog({_id:this.blogInfo._id}).then(res=>{
                if(res.data.code == 2000){
                    this.overlay = {show: false, content: '正在更新'}
                }
                this.$router.go(-1)
            })
        },

        // 编辑博客
        editBlog(blog){
            this.$router.push({
                path : './EditBlog',
                query:{id: blog._id}
            });
        },
    }
}
</script>