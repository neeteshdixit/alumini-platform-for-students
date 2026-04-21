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

export const googleAuth = (payload) => {
  return api.post('/api/google', payload).then(getData)
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

export const forgotPassword = (payload) => {
  return api.post('/api/forgot-password', payload).then(getData)
}

export const resetPassword = (payload) => {
  return api.post('/api/reset-password', payload).then(getData)
}

export const logout = () => {
  return api.post('/api/logout', {}).then(getData)
}

export const getMe = () => {
  return api.get('/api/user/me').then(getData)
}

export const getLocationStates = () => {
  return api.get('/api/locations/states').then(getData)
}

export const getLocationDistricts = (stateId) => {
  return api
    .get('/api/locations/districts', {
      params: { stateId },
    })
    .then(getData)
}

export const getLocationColleges = (districtId) => {
  return api
    .get('/api/locations/colleges', {
      params: { districtId },
    })
    .then(getData)
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

export const getNotifications = () => {
  return api.get('/api/notifications').then(getData)
}

export const readNotification = (notificationId) => {
  return api.post(`/api/notifications/${notificationId}/read`, {}).then(getData)
}

export const readAllNotifications = () => {
  return api.post('/api/notifications/read-all', {}).then(getData)
}

export const getLeaderboard = () => {
  return api.get('/api/leaderboard').then(getData)
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

export const togglePostLike = (postId) => {
  return api.post(`/api/posts/${postId}/like`, {}).then(getData)
}

export const addPostComment = ({ postId, content }) => {
  return api.post(`/api/posts/${postId}/comment`, { content }).then(getData)
}

export const sharePost = (postId) => {
  return api.post(`/api/posts/${postId}/share`, {}).then(getData)
}

export const getOpportunities = (params = {}) => {
  return api.get('/api/opportunities', { params }).then(getData)
}

export const getOpportunityMatches = () => {
  return api.get('/api/opportunities/matches/me').then(getData)
}

export const createOpportunity = (payload) => {
  return api.post('/api/opportunities', payload).then(getData)
}

export const applyOpportunity = ({ opportunityId, coverNote }) => {
  return api
    .post(`/api/opportunities/${opportunityId}/apply`, { coverNote })
    .then(getData)
}

export const startCall = ({ toUserId, mode }) => {
  return api.post('/api/calls', { toUserId, mode }).then(getData)
}

export const getCallSession = (callId) => {
  return api.get(`/api/calls/${callId}`).then(getData)
}

export const acceptCall = (callId) => {
  return api.post(`/api/calls/${callId}/accept`, {}).then(getData)
}

export const rejectCall = (callId) => {
  return api.post(`/api/calls/${callId}/reject`, {}).then(getData)
}

export const endCall = (callId) => {
  return api.post(`/api/calls/${callId}/end`, {}).then(getData)
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

export const uploadMediaFile = uploadProfileImage

export const uploadPdfFiles = async (files) => {
  const selectedFiles = Array.from(files || []).filter(Boolean)
  const formData = new FormData()

  for (const file of selectedFiles) {
    formData.append('files', file)
  }

  return api.post('/api/upload/pdf', formData).then(getData)
}
