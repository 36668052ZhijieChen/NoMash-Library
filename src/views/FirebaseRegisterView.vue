<script setup>
import { ref } from 'vue'
import {
  createUserWithEmailAndPassword,
  getAuth,
  signOut,
  updateProfile
} from 'firebase/auth'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const role = ref('Member')
const errorMessage = ref('')
const isSubmitting = ref(false)
const router = useRouter()
const auth = getAuth()

const register = async () => {
  errorMessage.value = ''
  isSubmitting.value = true

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value)
    await updateProfile(userCredential.user, { displayName: role.value })
    console.log('Firebase Register Successful!')
    console.log({ email: userCredential.user.email, role: role.value })
    await signOut(auth)
    await router.push('/FireLogin')
  } catch (error) {
    console.error(error.code)
    errorMessage.value = error.code || 'Unable to create account.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-sm-10 col-md-6 col-lg-5">
        <h1 class="text-center mb-4">Create an Account</h1>

        <form @submit.prevent="register">
          <div class="mb-3">
            <label for="register-email" class="form-label">Email</label>
            <input
              id="register-email"
              v-model="email"
              type="email"
              class="form-control"
              autocomplete="email"
              required
            />
          </div>

          <div class="mb-3">
            <label for="register-password" class="form-label">Password</label>
            <input
              id="register-password"
              v-model="password"
              type="password"
              class="form-control"
              autocomplete="new-password"
              minlength="6"
              required
            />
          </div>

          <div class="mb-3">
            <label for="register-role" class="form-label">Role</label>
            <select id="register-role" v-model="role" class="form-select">
              <option value="Member">Member</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <p v-if="errorMessage" class="text-danger" role="alert">{{ errorMessage }}</p>

          <div class="text-center">
            <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
              {{ isSubmitting ? 'Saving...' : 'Save to Firebase' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
