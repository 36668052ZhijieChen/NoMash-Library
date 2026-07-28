<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '../auth'

const router = useRouter()

const username = ref('')
const password = ref('')
const errorMessage = ref('')

const submitLogin = () => {
  if (login(username.value, password.value)) {
    errorMessage.value = ''
    router.push('/about')
  } else {
    errorMessage.value = 'Invalid username or password.'
    router.push('/access-denied')
  }
}
</script>

<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-6 offset-md-3">
        <h1 class="text-center">Member Login</h1>
        <p class="text-center">Please log in to access the secure members area.</p>

        <form @submit.prevent="submitLogin">
          <div class="mb-3">
            <label for="login-username" class="form-label">Username</label>
            <input
              id="login-username"
              v-model="username"
              type="text"
              class="form-control"
            />
          </div>

          <div class="mb-3">
            <label for="login-password" class="form-label">Password</label>
            <input
              id="login-password"
              v-model="password"
              type="password"
              class="form-control"
            />
          </div>

          <p v-if="errorMessage" class="text-danger">{{ errorMessage }}</p>

          <div class="text-center">
            <button type="submit" class="btn btn-primary">Login</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
