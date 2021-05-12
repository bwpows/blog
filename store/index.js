const state = () => ({
  snack:{
    text: '',
    show: false,
  },
  overlay:{
    text: '',
    show: false
  },
  configURL:'https://bwpow.com:8746'
})

const mutations = () => ({
  updateSnack(state, msg){
    state.snack.text = msg
  },
  updateOverlay(state, msg){
    state.overlay.show = msg
  }
})

export default {
	namespaced:true,
	state,
	mutations
}