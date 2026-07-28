<script setup>
import { ref } from 'vue'
import { addDoc, collection } from 'firebase/firestore'
import db from '../Firebase/init.js'
import BookList from '../components/BookList.vue'

const isbn = ref('')
const name = ref('')
const message = ref('')
const errorMessage = ref('')
const refreshKey = ref(0)

const addBook = async () => {
  message.value = ''
  errorMessage.value = ''
  const isbnNumber = Number(isbn.value)

  if (Number.isNaN(isbnNumber)) {
    errorMessage.value = 'ISBN must be a valid number.'
    return
  }

  try {
    await addDoc(collection(db, 'books'), {
      isbn: isbnNumber,
      name: name.value.trim()
    })

    isbn.value = ''
    name.value = ''
    message.value = 'Book added successfully!'
    refreshKey.value += 1
  } catch (error) {
    console.error('Error adding book:', error)
    errorMessage.value = error.message || 'Unable to add the book.'
  }
}
</script>

<template>
  <section class="container py-4">
    <div class="row justify-content-center">
      <div class="col-lg-10 col-xl-8">
        <h1 class="text-center mb-4">Add Book</h1>

        <form class="border rounded p-4" @submit.prevent="addBook">
          <div class="mb-3">
            <label for="isbn" class="form-label">ISBN</label>
            <input id="isbn" v-model="isbn" type="text" class="form-control" required />
          </div>

          <div class="mb-3">
            <label for="name" class="form-label">Name</label>
            <input id="name" v-model="name" type="text" class="form-control" required />
          </div>

          <p v-if="message" class="alert alert-success" role="status">{{ message }}</p>
          <p v-if="errorMessage" class="alert alert-danger" role="alert">{{ errorMessage }}</p>

          <button type="submit" class="btn btn-primary">Add Book</button>
        </form>

        <BookList :refresh-key="refreshKey" />
      </div>
    </div>
  </section>
</template>
