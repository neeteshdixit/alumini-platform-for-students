const joinName = (firstName = '', lastName = '') => {
  const combined = `${firstName} ${lastName}`.trim()
  return combined || 'User'
}

const normalizeDomain = (value) => {
  if (value === 'tech' || value === 'non-tech' || value === 'both') {
    return value
  }

  return 'both'
}

export const buildPublicUser = (user) => {
  return {
    id: user.id,
    name: joinName(user.profile?.firstName, user.profile?.lastName),
    email: user.email,
    role: user.role?.toLowerCase() || 'student',
    verified: Boolean(user.verified || user.verificationStatus === 'APPROVED'),
    enrollmentNumber: user.enrollmentNumber || null,
    collegeId: user.collegeId,
    collegeName: user.college?.name || null,
    domain: normalizeDomain(user.profile?.domain),
    skills: user.profile?.skillTags || [],
    interests: user.profile?.interestTags || [],
    avatarUrl: user.profile?.avatarUrl || null,
    profileImage: user.profile?.avatarUrl || null,
    internships: user.profile?.internships || '',
    internshipExperience: user.profile?.internships || '',
    projects: user.profile?.projects || '',
    bio: user.profile?.bio || '',
    linkedinUrl: user.profile?.linkedinUrl || '',
    githubUrl: user.profile?.githubUrl || '',
  }
}
