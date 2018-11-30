<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  created() {
    this.$http({
      method: "get",
      url: "/config/config/getConfig",
    })
    .then(res=>{
      document.title = res.data.data.site_name
    })
  }
}
</script>

<style lang="scss">
body {
  background-color: #fbfbfb;
  font-size: 16px;
  user-select: none;
}
* {
  padding: 0;
  margin: 0;
}
a {
  text-decoration: none;
  color: #fff;
}
.pagation {
    text-align: right;
    margin-top: 10px;
}

::-webkit-scrollbar {
  width: 2px;
  height: 2px;
}
::-webkit-scrollbar-thumb {
  border-radius: 2px;
  background: rgba(0,0,0,.2);
}
::-webkit-scrollbar-track {
  border-radius: 0;
  background: rgba(0,0,0,.1);
}
</style>

