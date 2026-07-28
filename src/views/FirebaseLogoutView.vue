<script setup>
import { onMounted, ref } from 'vue'
import { getAuth, signOut } from 'firebase/auth'

const auth = getAuth()
const isComplete = ref(false)
const errorMessage = ref('')

onMounted(async () => {
  try {
    const user = auth.currentUser
    console.log('Signing out user:', user ? { uid: user.uid, email: user.email } : null)
    await signOut(auth)
    console.log('Current user:', auth.currentUser)
    isComplete.value = true
  } catch (error) {
    console.error(error.code)
    errorMessage.value = error.code || 'Unable to sign out.'
  }
})
</script>

<template>
  <section class="container py-5 text-center">
    <h1>Firebase Logout</h1>
    <p v-if="!isComplete && !errorMessage">Signing out...</p>
    <div v-if="isComplete" class="alert alert-success mx-auto logout-message" role="status">
      You have been logged out.<br />
      Current user: <strong>null</strong>
    </div>
    <p v-if="errorMessage" class="alert alert-danger" role="alert">{{ errorMessage }}</p>
    <router-link v-if="isComplete" to="/FireLogin" class="btn btn-primary">
      Return to Firebase Login
    </router-link>
  </section>
</template>

<style scoped>
.logout-message {
  max-width: 32rem;
}
</style>
