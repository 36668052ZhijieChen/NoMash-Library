<template>
  <div class="book-counter">
    <h1>Book Counter</h1>
    <button type="button" class="btn btn-primary" @click="getBookCount">Get Book Count</button>

    <p v-if="count !== null" class="result">Total number of books: {{ count }}</p>
    <p v-else-if="error" class="result text-danger">
      {{ error }}
    </p>
  </div>
</template>

<script>
import axios from 'axios'

const countBooksUrl = import.meta.env.VITE_COUNT_BOOKS_URL

export default {
  name: 'GetBookCountView',
  data() {
    return {
      count: null,
      error: null
    }
  },
  methods: {
    async getBookCount() {
      this.count = null
      this.error = null

      if (!countBooksUrl) {
        this.error = 'Cloud Function URL has not been configured yet.'
        return
      }

      try {
        const response = await axios.get(countBooksUrl)
        this.count = response.data.count
      } catch (error) {
        console.error('Error fetching book count:', error)
        this.error = 'Error fetching book count.'
      }
    }
  }
}
</script>

<style scoped>
.book-counter {
  width: min(100% - 2rem, 720px);
  margin: 3rem auto;
  text-align: center;
}

.result {
  margin-top: 1rem;
}
</style>
