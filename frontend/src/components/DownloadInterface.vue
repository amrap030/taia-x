<template>
  <form @submit.prevent="onSubmit">
    <label>Select the format of the dataset:</label>
    <br />
    <select v-model="selected">
      <option>XLSX</option>
      <option>CSV</option>
      <option>JSON</option>
    </select>
    <br />
    <button type="submit">Download</button>
  </form>
</template>

<script lang="ts">
export default {
  methods: {
    onSubmit() {
      console.log('Label value: ',);
    }
  },
  data() {
    return {
      selected: ""
    };
  }
};
</script>
