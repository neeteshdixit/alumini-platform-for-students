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

const calculateProfileStrength = (user) => {
  const profile = user.profile || {}
  let score = 0

  if (profile.firstName) score += 10
  if (profile.lastName && profile.lastName !== '-') score += 5
  if (user.mobileNumber) score += 5
  if (profile.avatarUrl) score += 10
  if (profile.bio) score += 10
  if (profile.domain) score += 5
  if (profile.skillTags?.length) score += 15
  if (profile.interestTags?.length) score += 10
  if (profile.internships) score += 10
  if (profile.projects) score += 10
  if (profile.linkedinUrl) score += 5
  if (profile.githubUrl) score += 5
  if (profile.currentRole) score += 5
  if (profile.company) score += 5

  return Math.min(score, 100)
}

export const buildPublicUser = (user) => {
  const graduationYear = user.profile?.graduationYear || null
  const graduationMonth = user.profile?.graduationMonth || null
  const graduationDate =
    graduationYear && graduationMonth
      ? new Date(Number(graduationYear), Number(graduationMonth) - 1, 1)
      : null

  return {
    id: user.id,
    name: joinName(user.profile?.firstName, user.profile?.lastName),
    email: user.email,
    mobileNumber: user.mobileNumber || '',
    role: user.role?.toLowerCase() || 'student',
    verified: Boolean(user.verified || user.verificationStatus === 'APPROVED'),
    isFirstLogin: Boolean(user.isFirstLogin),
    lastLoginAt: user.lastLoginAt || null,
    enrollmentNumber: user.enrollmentNumber || null,
    collegeId: user.collegeId,
    collegeName: user.college?.name || null,
    collegeState: user.college?.state || null,
    collegeDistrict: user.college?.district || null,
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
    profileStrength: calculateProfileStrength(user),
    graduationYear,
    graduationMonth,
    graduationDate: graduationDate ? graduationDate.toISOString() : null,
    authProvider: user.authProvider || 'LOCAL',
  }
}
