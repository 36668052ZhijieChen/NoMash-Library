<template>
  <div class="container py-4">
    <p v-if="loading">Loading API data...</p>
    <p v-else-if="error" class="text-danger">{{ error }}</p>
    <div v-else-if="apiResponse" class="api-response">
      <pre>{{ JSON.stringify(apiResponse, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'

const authors = ref([])
const loading = ref(false)
const error = ref(null)
const apiResponse = ref(null)

const authorsCount = ref(0)
const totalBooks = ref(0)

const calculateStats = () => {
  authorsCount.value = authors.value.length
  totalBooks.value = authors.value.reduce((total, author) => {
    return total + author.famousWorks.length
  }, 0)
}

const getApiData = async () => {
  loading.value = true
  error.value = null

  try {
    const authorsUrl = new URL('../assets/json/authors.json', import.meta.url)
    const response = await fetch(authorsUrl)

    if (!response.ok) {
      throw new Error('Unable to load author data.')
    }

    authors.value = await response.json()
    calculateStats()

    apiResponse.value = {
      success: true,
      data: {
        authorsCount: authorsCount.value,
        totalBooks: totalBooks.value,
        authors: authors.value.map((author) => ({
          name: author.name,
          bookCount: author.famousWorks.length
        }))
      },
      timestamp: new Date().toISOString()
    }
  } catch (requestError) {
    error.value = requestError.message
    apiResponse.value = null
  } finally {
    loading.value = false
  }
}

onMounted(getApiData)
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
