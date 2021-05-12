<template>
    <v-card class="my-8 rounded-lg" style="cursor: pointer" elevation='0'>
        <v-card-title class="pb-1"> 推荐文章 </v-card-title>
        <v-card-text>
            <v-hover v-slot:default="{ hover }">
                <div class="font-italic" :class="hover?'primary--text font-weight-bold':''">1.Git 的基本使用</div>
            </v-hover>
            <v-hover v-slot:default="{ hover }">
                <div class="font-italic" :class="hover?'primary--text font-weight-bold':''">2.JS 的深浅拷贝</div>
            </v-hover>
            <v-hover v-slot:default="{ hover }">
                <div class="font-italic" :class="hover?'primary--text font-weight-bold':''">3.node 部署服务器</div>
            </v-hover>
        </v-card-text>
    </v-card>
</template>