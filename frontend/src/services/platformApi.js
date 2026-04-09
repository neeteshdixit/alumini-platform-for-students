import { api } from './api'

const getData = (response) => response.data

const fileToDataUrl = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Unable to read file.'))
    reader.onload = () => resolve(String(reader.result || ''))
    reader.readAsDataURL(file)
  })
}

export const signup = (payload) => {
  return api.post('/api/signup', payload).then(getData)
}

export const verifyOtp = (payload) => {
  return api.post('/api/verify-otp', payload).then(getData)
}

export const resendOtp = (payload) => {
  return api.post('/api/resend-otp', payload).then(getData)
}

export const login = (payload) => {
  return api.post('/api/login', payload).then(getData)
}

export const logout = () => {
  return api.post('/api/logout', {}).then(getData)
}

export const getMe = () => {
  return api.get('/api/user/me').then(getData)
}

export const getUserSuggestions = async () => {
  try {
    const suggestionsResponse = await api.get('/api/users/suggestions')
    const suggestions =
      suggestionsResponse.data?.users ||
      suggestionsResponse.data?.suggestions ||
      []
    return { users: suggestions }
  } catch (error) {
    if (error?.response?.status && error.response.status !== 404) {
      throw error
    }

    const [sameCollegeResponse, otherUsersResponse] = await Promise.all([
      api.get('/api/users/same-college'),
      api.get('/api/users/other'),
    ])

    const merged = [
      ...(sameCollegeResponse.data?.users || []),
      ...(otherUsersResponse.data?.users || []),
    ]

    return { users: merged }
  }
}

export const updateMe = (payload) => {
  return api.put('/api/user/update', payload).then(getData)
}

export const deleteMe = (payload) => {
  return api
    .delete('/api/me', {
      data: payload,
    })
    .then(getData)
}

export const getSameCollegeUsers = () => {
  return api.get('/api/users/same-college').then(getData)
}

export const getOtherUsers = () => {
  return api.get('/api/users/other').then(getData)
}

export const getConnections = () => {
  return api.get('/api/connections').then(getData)
}

export const sendConnectionRequest = (targetUserId) => {
  return api.post('/api/connect', { targetUserId }).then(getData)
}

export const respondConnectionRequest = ({ requestId, action }) => {
  return api.post('/api/accept', { requestId, action }).then(getData)
}

export const fetchMessages = (withUserId) => {
  return api
    .get('/api/messages', {
      params: withUserId ? { withUserId } : undefined,
    })
    .then(getData)
}

export const sendMessage = ({ toUserId, content }) => {
  return api.post('/api/message', { toUserId, content }).then(getData)
}

export const createPost = (payload) => {
  return api.post('/api/post', payload).then(getData)
}

export const getPosts = () => {
  return api.get('/api/posts').then(getData)
}

export const uploadProfileImage = async (file) => {
  const fileData = await fileToDataUrl(file)
  return api
    .post('/api/upload', {
      fileName: file?.name || 'profile-image',
      fileData,
    })
    .then(getData)
}
