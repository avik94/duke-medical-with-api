import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    formData: "",
    machineList:[]
  },
  mutations: {
    storeFormData(state,data){
      state.formData = data
    },
    storeMachine(state,data){
      state.machineList = data
    }
  },
  actions: {

  },
});
