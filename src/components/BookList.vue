<script setup>
import { onMounted, ref, watch } from 'vue'
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  updateDoc,
  where
} from 'firebase/firestore'
import db from '../Firebase/init.js'

const props = defineProps({
  refreshKey: {
    type: Number,
    default: 0
  }
})

const books = ref([])
const message = ref('')
const errorMessage = ref('')
const minimumIsbn = ref(1000)
const maximumResults = ref(5)
const editingId = ref(null)
const editIsbn = ref('')
const editName = ref('')

const fetchBooks = async () => {
  errorMessage.value = ''

  try {
    const booksQuery = query(
      collection(db, 'books'),
      where('isbn', '>', Number(minimumIsbn.value)),
      orderBy('isbn', 'asc'),
      limit(Number(maximumResults.value))
    )
    const querySnapshot = await getDocs(booksQuery)
    books.value = querySnapshot.docs.map((bookDocument) => ({
      id: bookDocument.id,
      ...bookDocument.data()
    }))
  } catch (error) {
    console.error('Error fetching books:', error)
    errorMessage.value = error.message || 'Unable to fetch books.'
  }
}

const startEditing = (book) => {
  message.value = ''
  editingId.value = book.id
  editIsbn.value = book.isbn
  editName.value = book.name
}

const cancelEditing = () => {
  editingId.value = null
}

const saveBook = async () => {
  const isbnNumber = Number(editIsbn.value)
  if (Number.isNaN(isbnNumber)) {
    errorMessage.value = 'ISBN must be a valid number.'
    return
  }

  try {
    await updateDoc(doc(db, 'books', editingId.value), {
      isbn: isbnNumber,
      name: editName.value.trim()
    })
    editingId.value = null
    await fetchBooks()
    message.value = 'Book updated successfully!'
  } catch (error) {
    console.error('Error updating book:', error)
    errorMessage.value = error.message || 'Unable to update the book.'
  }
}

const removeBook = async (book) => {
  const shouldDelete = window.confirm(`Delete "${book.name}"?`)
  if (!shouldDelete) return

  try {
    await deleteDoc(doc(db, 'books', book.id))
    await fetchBooks()
    message.value = 'Book deleted successfully!'
  } catch (error) {
    console.error('Error deleting book:', error)
    errorMessage.value = error.message || 'Unable to delete the book.'
  }
}

onMounted(fetchBooks)
watch(() => props.refreshKey, fetchBooks)
</script>

<template>
  <section class="mt-5">
    <h2 class="h3">Firestore Books</h2>

    <form class="border rounded p-3 mb-3" @submit.prevent="fetchBooks">
      <div class="row g-3 align-items-end">
        <div class="col-sm-5">
          <label for="minimum-isbn" class="form-label">ISBN greater than</label>
          <input
            id="minimum-isbn"
            v-model.number="minimumIsbn"
            type="number"
            class="form-control"
            required
          />
        </div>
        <div class="col-sm-4">
          <label for="maximum-results" class="form-label">Result limit</label>
          <input
            id="maximum-results"
            v-model.number="maximumResults"
            type="number"
            class="form-control"
            min="1"
            max="20"
            required
          />
        </div>
        <div class="col-sm-3">
          <button type="submit" class="btn btn-primary w-100">Run Query</button>
        </div>
      </div>
      <p class="text-secondary mt-3 mb-0">
        Using <code>where(isbn &gt; {{ minimumIsbn }})</code>,
        <code>orderBy(isbn, asc)</code>, and <code>limit({{ maximumResults }})</code>.
      </p>
    </form>

    <p v-if="message" class="alert alert-success" role="status">{{ message }}</p>
    <p v-if="errorMessage" class="alert alert-danger" role="alert">{{ errorMessage }}</p>

    <div v-if="books.length" class="table-responsive border rounded">
      <table class="table table-striped align-middle mb-0">
        <thead class="table-light">
          <tr>
            <th>Name</th>
            <th>ISBN</th>
            <th class="text-end">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="book in books" :key="book.id">
            <td>{{ book.name }}</td>
            <td>{{ book.isbn }}</td>
            <td class="text-end text-nowrap">
              <button
                type="button"
                class="btn btn-sm btn-outline-primary me-2"
                @click="startEditing(book)"
              >
                Edit
              </button>
              <button
                type="button"
                class="btn btn-sm btn-outline-danger"
                @click="removeBook(book)"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <p v-else-if="!errorMessage" class="text-secondary">No matching books found.</p>

    <form v-if="editingId" class="border rounded p-3 mt-3" @submit.prevent="saveBook">
      <h3 class="h5">Edit Book</h3>
      <div class="row g-3">
        <div class="col-sm-5">
          <label for="edit-isbn" class="form-label">ISBN</label>
          <input id="edit-isbn" v-model="editIsbn" class="form-control" required />
        </div>
        <div class="col-sm-7">
          <label for="edit-name" class="form-label">Name</label>
          <input id="edit-name" v-model="editName" class="form-control" required />
        </div>
      </div>
      <div class="d-flex gap-2 mt-3">
        <button type="submit" class="btn btn-primary">Save Changes</button>
        <button type="button" class="btn btn-secondary" @click="cancelEditing">Cancel</button>
      </div>
    </form>
  </section>
</template>
