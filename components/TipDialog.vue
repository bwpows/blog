<template>
    <v-dialog v-model="dialog" max-width="290" persistent>
        <v-card>
            <div class="body-2 text-center py-6 grey--text text--darken-2 mx-3" v-html="content"></div>
            <v-divider></v-divider> 
            <v-btn color="primary" text x-large @click="$emit('BtnEvent')" style="width: 100%; height: 50px;" v-text="btnText"></v-btn>
        </v-card>
    </v-dialog>
</template>
<script>
export default {
    props: {
        dialog: {
            type: Boolean,
            default: false
        },
        content: {
            type: String,
            require: true
        },
        btnText: {
            type: String,
            default: '确定'
        }
    }
}
</script>
