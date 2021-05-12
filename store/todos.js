export const state = () => ({
    overlay:{
        show: false,
        text: ''
    },
    tipDialog:{
        dialog: false,
        content: ''
    }
})

export const mutations = {
    updateOverlay(state, msg){
        state.overlay = msg
    },
    updateTipDialog(state, msg){
        state.tipDialog = msg
    }
}