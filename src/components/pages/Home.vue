
<template>
  <div>
    <div>
      <amp-state id="staticList">
        <component
          is="amp-script"
          :state="data"
          type="application/json"
        ></component>
      </amp-state>
      <amp-list width="auto" height="100" layout="fixed-height" src="/data">
        <template type="amp-mustache" v-pre>
          <div class="url-entry">
            <a href="{{url}}">{{ title }}</a>
          </div>
        </template>
      </amp-list>
    </div>
    <div>
      <amp-state id="countriesState">
        <component
          is="amp-script"
          :state="countries.value"
          type="application/json"
        ></component>
      </amp-state>
      <amp-list
        width="auto"
        height="100"
        layout="fixed-height"
        src="amp-state:countriesState"
      >
        <template type="amp-mustache" v-pre>
          <div class="url-entry">
            {{ name }}
          </div>
        </template>

        <div overflow class="list-overflow" style="background-color: red">
          See more
        </div>
      </amp-list>
    </div>
    <div>
      <amp-list
        width="auto"
        height="100"
        layout="fixed-height"
        src="/countries"
      >
        <template type="amp-mustache" v-pre>
          <div class="url-entry">
            {{ code }}
          </div>
        </template>
      </amp-list>
    </div>
  </div>
</template>

<script>
import { onServerPrefetch, ref } from "vue";
import axios from "axios";

export default {
  setup() {
    const ctx = useSSRContext();
    ctx.inject = false;
    const countries = {};
    const data = ref({
      items: [
        {
          id: 1,
          title: "AMP YouTube Channel",
          url: "https://www.youtube.com/channel/UCXPBsjgKKG2HqsKBhWA4uQw",
        },
        {
          id: 2,
          title: "AMPproject.org",
          url: "https://www.ampproject.org/",
        },
        {
          id: 3,
          title: "AMP By Example",
          url: "https://ampbyexample.com/",
        },
        {
          id: 4,
          title: "AMP Start",
          url: "https://ampstart.com/",
        },
      ],
    });

    onServerPrefetch(async () => {
      await axios
        .post("https://countries.trevorblades.com/", {
          query: "query countries {\n  countries {\n    name\n  }\n}\n",
        })
        .then(function (response) {
          countries.value = { items: response.data.data.countries };
          console.log("Lista carregada");
        })
        .catch(function (error) {
          console.log("Erro : " + countries);
        });
    });

    return {
      data,
      countries,
    };
  },
};
</script>

<style>
</style>