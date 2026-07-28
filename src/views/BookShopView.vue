<script setup>
import axios from 'axios'
import { onMounted, ref } from 'vue'

const bookStoreUrl = import.meta.env.VITE_BOOK_STORE_URL
const books = ref([])
const buyerName = ref('')
const loading = ref(true)
const purchasingId = ref(null)
const errorMessage = ref('')
const receipt = ref(null)

const loadBooks = async () => {
  loading.value = true
  errorMessage.value = ''

  if (!bookStoreUrl) {
    errorMessage.value = 'Book Store Cloud Function URL has not been configured.'
    loading.value = false
    return
  }

  try {
    const response = await axios.get(bookStoreUrl)
    books.value = response.data.books
  } catch (error) {
    console.error('Unable to load the book shop:', error)
    errorMessage.value = 'Unable to load books from the cloud function.'
  } finally {
    loading.value = false
  }
}

const buyBook = async (book) => {
  errorMessage.value = ''
  receipt.value = null

  if (!buyerName.value.trim()) {
    errorMessage.value = 'Enter the buyer name before purchasing.'
    return
  }

  purchasingId.value = book.id

  try {
    const response = await axios.post(bookStoreUrl, {
      bookId: book.id,
      buyerName: buyerName.value.trim()
    })
    receipt.value = response.data.receipt
  } catch (error) {
    console.error('Unable to complete the purchase:', error)
    errorMessage.value = error.response?.data?.error || 'Unable to complete the purchase.'
  } finally {
    purchasingId.value = null
  }
}

onMounted(loadBooks)
</script>

<template>
  <main class="container py-4">
    <div class="shop-heading text-center">
      <h1>Cloud Book Shop</h1>
      <p class="text-secondary">Purchase a digital book stored in Firestore.</p>
    </div>

    <div class="buyer-field mx-auto mb-4">
      <label for="buyer-name" class="form-label">Buyer name</label>
      <input
        id="buyer-name"
        v-model="buyerName"
        type="text"
        class="form-control"
        placeholder="Enter your name"
      />
    </div>

    <p v-if="loading" class="text-center">Loading Firestore catalogue...</p>
    <p v-if="errorMessage" class="alert alert-danger mx-auto" role="alert">
      {{ errorMessage }}
    </p>

    <div v-if="books.length" class="row g-3 justify-content-center">
      <div v-for="book in books" :key="book.id" class="col-sm-6 col-lg-4">
        <article class="card h-100">
          <div class="card-body d-flex flex-column">
            <h2 class="h5 card-title">{{ book.name }}</h2>
            <p class="card-text text-secondary mb-2">ISBN: {{ book.isbn }}</p>
            <p class="h4 mt-auto">${{ book.price.toFixed(2) }}</p>
            <button
              type="button"
              class="btn btn-primary"
              :disabled="purchasingId !== null"
              @click="buyBook(book)"
            >
              {{ purchasingId === book.id ? 'Processing...' : 'Buy Book' }}
            </button>
          </div>
        </article>
      </div>
    </div>

    <section v-if="receipt" class="receipt mx-auto mt-4" aria-live="polite">
      <h2 class="h4">Purchase Successful</h2>
      <dl class="row mb-0">
        <dt class="col-sm-5">Receipt</dt>
        <dd class="col-sm-7">{{ receipt.receiptNumber }}</dd>
        <dt class="col-sm-5">Buyer</dt>
        <dd class="col-sm-7">{{ receipt.buyerName }}</dd>
        <dt class="col-sm-5">Book</dt>
        <dd class="col-sm-7">{{ receipt.bookName }}</dd>
        <dt class="col-sm-5">Price</dt>
        <dd class="col-sm-7">${{ receipt.price.toFixed(2) }}</dd>
      </dl>
    </section>
  </main>
</template>

<style scoped>
.shop-heading,
.alert,
.receipt {
  max-width: 760px;
}

.buyer-field {
  max-width: 480px;
}

.card {
  border-radius: 8px;
}

.receipt {
  padding: 1.25rem;
  border: 2px solid #198754;
  border-radius: 8px;
  background: #f3fff7;
}
</style>
