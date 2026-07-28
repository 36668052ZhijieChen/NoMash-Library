<template>
  <div class="container py-4">
    <div class="api-response">
      <pre>{{ JSON.stringify(apiResponse, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup>
import authors from '../assets/json/authors.json'

const books = authors.flatMap((author) =>
  author.famousWorks.map((book) => ({
    title: book.title,
    year: book.year,
    author: author.name
  }))
)

const apiResponse = {
  success: true,
  totalBooks: books.length,
  books
}
</script>

<style scoped>
.api-response {
  text-align: left;
}

pre {
  margin: 0;
  white-space: pre-wrap;
}
</style>
