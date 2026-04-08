const joinName = (firstName = '', lastName = '') => {
  const combined = `${firstName} ${lastName}`.trim()
  return combined || 'User'
}

export const buildPublicUser = (user) => {
  return {
    id: user.id,
    name: joinName(user.profile?.firstName, user.profile?.lastName),
    email: user.email,
    role: user.role?.toLowerCase() || 'student',
    verified: user.verified,
    enrollmentNumber: user.enrollmentNumber || null,
    collegeId: user.collegeId,
    collegeName: user.college?.name || null,
    skills: user.profile?.skillTags || [],
    interests: user.profile?.interestTags || [],
    avatarUrl: user.profile?.avatarUrl || null,
  }
}
