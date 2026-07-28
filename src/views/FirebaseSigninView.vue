<script setup>
import { ref } from 'vue'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const isSubmitting = ref(false)
const router = useRouter()
const auth = getAuth()

const signin = async () => {
  errorMessage.value = ''
  isSubmitting.value = true

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value)
    const role = userCredential.user.displayName || 'Member'
    console.log('Firebase Login Successful!')
    console.log({
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      role
    })
    await router.push('/RoleDashboard')
  } catch (error) {
    console.error(error.code)
    errorMessage.value = error.code || 'Unable to sign in.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-sm-10 col-md-6 col-lg-5">
        <h1 class="text-center mb-4">Sign In</h1>

        <form @submit.prevent="signin">
          <div class="mb-3">
            <label for="signin-email" class="form-label">Email</label>
            <input
              id="signin-email"
              v-model="email"
              type="email"
              class="form-control"
              autocomplete="email"
              required
            />
          </div>

          <div class="mb-3">
            <label for="signin-password" class="form-label">Password</label>
            <input
              id="signin-password"
              v-model="password"
              type="password"
              class="form-control"
              autocomplete="current-password"
              required
            />
          </div>

          <p v-if="errorMessage" class="text-danger" role="alert">{{ errorMessage }}</p>

          <div class="text-center">
            <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
              {{ isSubmitting ? 'Signing in...' : 'Sign in via Firebase' }}
            </button>
          </div>
        </form>

        <p class="text-center mt-3">
          Need an account?
          <router-link to="/FireRegister">Register with Firebase</router-link>
        </p>
      </div>
    </div>
  </div>
</template>
