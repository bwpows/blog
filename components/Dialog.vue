<template>
    <v-dialog v-model="dialog" max-width="290" style="z-index: 1010;">
      <v-card>
        <v-card-title>{{title}}</v-card-title>
        <v-card-text v-if='content'>{{content}}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary darken-1" text @click="$emit('leftBtnEvent')">{{leftBtnText}}</v-btn>
          <v-btn color="primary darken-1" text @click="$emit('rightBtnEvent')">{{rightBtnText}}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>
<script>
export default {
    props:{
        dialog:{
            type: Boolean,
            require: false
        },
        title:{
            type: String,
            require: true
        },
        content:{
            type: String,
            default: null
        },
        rightBtnText:{
            type: String,
            default: '确定'
        },
        leftBtnText:{
            type: String,
            default: '取消'
        }
    }
}
</script>