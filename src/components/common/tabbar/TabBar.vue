<template>
  <div id="tab-bar">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'TabBar',
  components: {}
}
</script >

<style scoped>
#tab-bar {
  display: flex;
  background-color: #f6f6f6;
  position: fixed;
  bottom: 0px;
  left: 0px;
  right: 0;
  box-shadow: 0px -3px 1px rgba(210, 209, 209, 0.4);
}
</style>
