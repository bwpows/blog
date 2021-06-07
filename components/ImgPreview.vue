<template>
    <v-dialog v-model="imgPreview.show" scrollable fullscreen :overlay="false" overlay-color='black'>
        <div class="imgDolg" v-show="imgPreview.show" @click="imgPreview.show = false">
            <v-icon id="imgDolgClose" @click="imgPreview.show = false">mdi-close</v-icon>
            <img @click.stop="imgPreview.show = !imgPreview.show" :src="imgPreview.img" />
        </div>
    </v-dialog>
</template>
<script>
export default {
    props:{
        imgPreview:{
            type: Object,
            require: true
        }
    }
}
</script>
<style scoped>
.imgDolg {
  width: 100vw;
  height: 100vh;
  position: fixed;
  z-index: 99999;
  background-color: rgba(0, 0, 0, 0.7);
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
#imgDolgClose {
  position: fixed;
  top: 35px;
  cursor: pointer;
  right: 7%;
  font-size: 50px;
  color: white;
}
.imgDolg img{
  max-height: 90%;
  max-width: 90%;
}
</style>