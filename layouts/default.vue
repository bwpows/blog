<template>
  <v-app>
    <Header v-if="$route.path!='/Login'" />
    <v-main class="backgroundColor">
      <v-row justify="center" class="ma-0 pa-0" v-if="$route.path!='/Login'">
        <v-col md='12' lg='9' class="ma-0 pa-0">
          <nuxt />
        </v-col>
      </v-row>
      <nuxt v-else></nuxt>
    </v-main>

    <Overlay :overlay=overlay />

    <v-snackbar v-model="$store.state.snack.snack" :timeout="timeout" light top>
      <div class="d-flex justify-space-between align-center">
        {{ $store.state.snack.text }}
        <v-btn color="primary" text @click="closeSnack()"> 关闭 </v-btn>
      </div>
    </v-snackbar>

    <!-- <v-overlay :value="overlay.show" color="rgb(255,255,255)" opacity='.9' class="text-center overlayBox" style="z-index: 1000">
      <v-progress-circular :size="60" color="primary" indeterminate></v-progress-circular>
      <div class="primary--text mt-5">{{ overlay.text }}</div>
    </v-overlay> -->

    <v-dialog v-model="tipDialog.dialog" max-width="290" persistent>
        <v-card>
            <div class="body-1 text-center py-6 grey--text text--darken-2" v-text="tipDialog.content"></div>
            <v-divider></v-divider> 
            <v-btn color="primary" text x-large @click="$emit('BtnEvent')" style="width: 100%; height: 50px;">确定</v-btn>
        </v-card>
    </v-dialog>

  </v-app>
</template>

<script>
import Header from '@/components/Header.vue'
export default {
  name: 'App',

  data: () => ({
    snackbar: false,
    timeout: 2000
  }),

  components:{
    Header
  },

  

  computed: {
    overlay () {
      return this.$store.state.todos.overlay
    },
    tipDialog(){
      return this.$store.state.todos.tipDialog
    }

  },
};
</script>