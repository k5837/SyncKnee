<template>
    <header>
      <div class="l-content">
      </div>
      <div class="r-content">
        <h3 style="color: white;"><router-link :to="{ path: '/' }" style="color: white;">Admin</router-link></h3>
        
      </div>
    </header>
  </template>
  
  <script>
  import { mapState } from "vuex";

  export default {
    data() {
      return {
        userImg: require("../assets/a.jpg"),
        a:localStorage.getItem('username')
      };
    },
    methods: {
      handleMenu() {
        this.$store.commit("collapseMenu");
      },
    },
    computed: {
      ...mapState({
        current: (state) => state.tab.currentMenu,
      }),
    },
  };
  </script>
  
  <style  scoped>
  header {
    display: flex;
    height: 100%;
    align-items: center;
    justify-content: space-between;
  }
  
 
  .l-content {
    display: flex;
    align-items: center;
  }

 

  </style>
  

  