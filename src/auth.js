import { ref } from 'vue'

const isAuthenticated = ref(localStorage.getItem('isAuthenticated') === 'true')

const login = (username, password) => {
  if (username === 'student' && password === 'password123') {
    isAuthenticated.value = true
    localStorage.setItem('isAuthenticated', 'true')
    return true
  }

  isAuthenticated.value = false
  localStorage.removeItem('isAuthenticated')
  return false
}

const logout = () => {
  isAuthenticated.value = false
  localStorage.removeItem('isAuthenticated')
}

export { isAuthenticated, login, logout }
