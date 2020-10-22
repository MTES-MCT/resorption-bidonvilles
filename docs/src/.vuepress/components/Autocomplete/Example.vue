<template>
  <div>
    <ValidationObserver ref="form" v-slot="{ handleSubmit, errors, failed }">
      <form class="w-full max-w-xl" @submit.prevent="handleSubmit(onSubmit)">
        <AutocompleteV2
            id="test"
            label="Search Wikipedia"
            :defaultValue="result ? resultValue(result) : ''"
            :search="search"
            v-model="result"
            @submit="result = $event"
            :getResultValue="resultValue"
            placeholder="Search Wikipedia"
            rules="required"
            :loading="loading"
            prefixIcon="search"

        />
        <div v-if="result">result: {{result.pageid}} - {{result.title}}</div>
        <Button type="submit">Submit</Button>
      </form>
    </ValidationObserver>
  </div>
</template>

<script>
export default {
  data() {
    return {
      input: 'test',
      result: '',
      loading: false
    }
  },
  methods: {
    onSubmit() {
      alert(this.result)
    },
    resultValue(input) {
      return input.title
    },
    search(input) {
      this.input = input;
      const wikiUrl = 'https://en.wikipedia.org'
      const wikiParams = 'action=query&list=search&format=json&origin=*'



      return new Promise(resolve => {
        const url = `${wikiUrl}/w/api.php?${wikiParams}&srsearch=${encodeURI(
            input
        )}`

        if (!input.length) {
          return resolve([])
        }

        this.loading = true

        fetch(url)
            .then(response => response.json())
            .then(data => {

              resolve(data.query.search)
              this.loading = false
            })
      })
    },
  }
}

</script>
