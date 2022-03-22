
<template>
  <div>
    <amp-list
      width="auto"
      height="100"
      layout="fixed-height"
      src="./public/json/test.json"
    >
      <template type="amp-mustache">
        <div class="url-entry">
          <a href="{{url}}" v-pre>{{ title }}</a>
        </div>
      </template>
    </amp-list>
    
  </div>
</template>
<script>
export default {
  setup() {
    const ctx = useSSRContext();
    ctx.inject = false;
  },
};
</script>

<style>
</style>