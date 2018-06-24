/* global Vue, VueTypes, R */

const SAMPLE_LENGTH = 36;
const STRING_LENGTH = 8;
function randomString() {
  return Math.random()
    .toString(SAMPLE_LENGTH)
    .replace(/[^a-z]+/g, '')
    .substr(0, STRING_LENGTH - 1);
}

Vue.component('view-samples', {
  props: {
    samples: VueTypes.arrayOf(String),
  },
  template: '<ul><li v-for="sample in samples">{{sample}}</li></ul>',
});

Vue.component('my-button', {
  props: {
    action: VueTypes.func,
  },
  template: '<button @click="action"><slot/></button>',
});

Vue.component('my-form', {
  data: function data() {
    return {
      samples: [],
    };
  },
  methods: {
    addSample: function addSample() {
      this.samples = R.append(randomString(), this.samples);
    },
    reset: function reset() {
      this.samples = [];
    },
    submitForm: function submitForm() {
      return false;
    },
  },
  template: '#my-form-template',
});

// eslint-disable-next-line no-new
new Vue({
  el: '#root',
});
