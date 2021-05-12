<template>
    <v-card elevation='0' class="my-8 rounded-lg pb-2" @click="goBlogInfo()">
        <v-card-title class="body-1 pb-2" :style="{color:(color || borderColor)}">{{ title }} </v-card-title>
        <v-divider color='' class="grey lighten-3"></v-divider>
        <v-card-subtitle class="text-over no-warp ma-0 mb-2" v-html="content"></v-card-subtitle>
        <v-card-actions class="justify-space-between mr-3 py-0">
            <v-btn text class="font-weight-regular">{{ classify || 'other' }}</v-btn>
            <span class="body-2 grey--text">{{ createTime | timeFilters }}</span>
        </v-card-actions>
    </v-card>
</template>
<script>
export default {
  props:{

    title:{
      type: String,
      require: true
    },

    content:{
      type: String,
      require: true
    },

    classify:{
      type: String,
      require: true
    },

    createTime:{
      type: String,
      require: true
    },

    color:{
      type: String
    }

  },

  mounted(){
    this.borderColor = this.$vuetify.theme.defaults.dark.primary
  },

  data:()=>({
    borderColor: '',
  }),

  methods:{
    goBlogInfo(){
      this.$emit('goBlogInfo')
    }
  },

  filters:{
      timeFilters(value){
          if(!value) return;
          return value.substring(0,10) + ' ' + value.substring(11,19)
      }
  },
}
</script>
<style scoped>
  .text-over{
    overflow: hidden;
    max-height: 40px;
  }
  .text-over /deep/ img{
    display: none;
  }
  .text-over /deep/ p{
    font-size: 14px !important;
    font-weight: normal !important;
    margin: 0;
  }
  .text-over /deep/ span{
    font-size: 14px !important;
    font-weight: normal !important;
    margin: 0;
  }
  .text-over /deep/ strong{
    font-size: 14px !important;
    font-weight: normal !important;
    margin: 0;
  }
  .text-over /deep/ h1+h2+h3+h4+h5{
    font-size: 14px !important;
    font-weight: normal !important;
  }
</style>