<script setup>
import { onBeforeUnmount, ref } from 'vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'vue-router'

const auth = getAuth()
const router = useRouter()
const isLoading = ref(true)
const currentEmail = ref('')
const currentRole = ref('')

const stopWatching = onAuthStateChanged(auth, (user) => {
  if (!user) {
    router.push('/FireLogin')
    return
  }

  currentEmail.value = user.email
  currentRole.value = user.displayName || 'Member'
  isLoading.value = false
})

onBeforeUnmount(stopWatching)
</script>

<template>
  <section class="container py-5">
    <p v-if="isLoading" class="text-center">Loading current user...</p>

    <div v-else class="row justify-content-center">
      <div class="col-lg-8">
        <header class="text-center mb-4">
          <h1>{{ currentRole }} Dashboard</h1>
          <p class="text-secondary mb-0">Signed in as {{ currentEmail }}</p>
        </header>

        <div class="alert alert-primary" role="status">
          Current role: <strong>{{ currentRole }}</strong>
        </div>

        <section v-if="currentRole === 'Admin'" class="border-top pt-4">
          <h2 class="h4">Administrator tools</h2>
          <p>Admins can manage library records, users, and Firestore book data.</p>
          <router-link to="/addbook" class="btn btn-primary">Manage Books</router-link>
        </section>

        <section v-else class="border-top pt-4">
          <h2 class="h4">Member area</h2>
          <p>Members can browse the library catalogue and view their account.</p>
          <router-link to="/" class="btn btn-primary">Browse Library</router-link>
        </section>
      </div>
    </div>
  </section>
</template>
