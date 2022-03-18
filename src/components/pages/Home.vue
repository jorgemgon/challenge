
<template>
  <div>
   Hey
   <amp-list>
   </amp-list> 
  </div>
</template>
<script setup>
const ctx = useSSRContext();
ctx.inject = false;
</script>

<style>
</style>