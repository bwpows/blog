<template>
    <v-overlay :value="overlay.show" style="z-index: 1000" :opacity=$vuetify.theme.dark?1:0>
        <v-progress-circular :size="60" indeterminate color="primary"></v-progress-circular>
        <div class="primary--text mt-5" v-html="overlay.content || '正在更新...'"></div>
    </v-overlay>
</template>
<script>
export default {
    props:{
        overlay:{
            type: Object,
            require: true
        }
    }
}
</script>