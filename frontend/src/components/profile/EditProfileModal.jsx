import { useMemo, useState } from 'react'

const toCsv = (items = []) => items.join(', ')

const toArray = (value = '') => {
  return String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

const initialFormState = {
  name: '',
  mobileNumber: '',
  domain: 'both',
  skills: '',
  interests: '',
  internships: '',
  projects: '',
  bio: '',
  linkedinUrl: '',
  githubUrl: '',
  profileImage: '',
}

const domainOptions = [
  { label: 'Tech', value: 'tech' },
  { label: 'Non-Tech', value: 'non-tech' },
  { label: 'Both', value: 'both' },
]

const monthOptions = [
  { label: 'January', value: 1 },
  { label: 'February', value: 2 },
  { label: 'March', value: 3 },
  { label: 'April', value: 4 },
  { label: 'May', value: 5 },
  { label: 'June', value: 6 },
  { label: 'July', value: 7 },
  { label: 'August', value: 8 },
  { label: 'September', value: 9 },
  { label: 'October', value: 10 },
  { label: 'November', value: 11 },
  { label: 'December', value: 12 },
]

const buildYearOptions = () => {
  const currentYear = new Date().getFullYear()
  const years = []

  for (let year = currentYear - 6; year <= currentYear + 8; year += 1) {
    years.push(year)
  }

  return years
}

function EditProfileModal({
  initialData,
  isSaving,
  isUploadingImage,
  onClose,
  onSave,
  onUploadImage,
}) {
  const [form, setForm] = useState({
    ...initialFormState,
    name: initialData?.name || '',
    mobileNumber: initialData?.mobileNumber || '',
    domain: initialData?.domain || 'both',
    skills: toCsv(initialData?.skills || []),
    interests: toCsv(initialData?.interests || []),
    internships: initialData?.internships || '',
    projects: initialData?.projects || '',
    bio: initialData?.bio || '',
    graduationMonth: initialData?.graduationMonth || '',
    graduationYear: initialData?.graduationYear || '',
    linkedinUrl: initialData?.linkedinUrl || '',
    githubUrl: initialData?.githubUrl || '',
    profileImage: initialData?.profileImage || initialData?.avatarUrl || '',
  })
  const [localError, setLocalError] = useState('')
  const yearOptions = useMemo(() => buildYearOptions(), [])

  const skillsPreview = useMemo(() => toArray(form.skills), [form.skills])
  const interestsPreview = useMemo(() => toArray(form.interests), [form.interests])

  return (
    <div className="modal modal-open" role="dialog">
      <div className="modal-box max-w-3xl">
        <h3 className="text-xl font-black text-blue-950">Edit Profile</h3>
        <p className="mt-1 text-sm text-slate-600">
          Keep your profile updated so students and alumni can discover you better.
        </p>

        {localError && (
          <div className="mt-4 rounded-lg bg-red-100 px-3 py-2 text-sm font-semibold text-red-700">
            {localError}
          </div>
        )}

        <form
          className="mt-5 space-y-4"
          onSubmit={(event) => {
            event.preventDefault()
            setLocalError('')

            const payload = {
              name: form.name.trim(),
              domain: form.domain,
              skills: toArray(form.skills),
              interests: toArray(form.interests),
              internships: form.internships.trim(),
              projects: form.projects.trim(),
              bio: form.bio.trim(),
              graduationMonth: form.graduationMonth ? Number(form.graduationMonth) : null,
              graduationYear: form.graduationYear ? Number(form.graduationYear) : null,
              linkedinUrl: form.linkedinUrl.trim(),
              githubUrl: form.githubUrl.trim(),
              profileImage: form.profileImage.trim(),
            }

            const mobileNumber = form.mobileNumber.trim()
            if (mobileNumber) {
              payload.mobileNumber = mobileNumber
            }

            if (!payload.name) {
              setLocalError('Name is required.')
              return
            }

            onSave(payload)
          }}
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="form-control">
              <span className="mb-1 text-sm font-semibold text-slate-700">Full Name</span>
              <input
                className="input input-bordered w-full"
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
                placeholder="Your full name"
                value={form.name}
              />
            </label>

            <label className="form-control">
              <span className="mb-1 text-sm font-semibold text-slate-700">
                Mobile Number
              </span>
              <input
                className="input input-bordered w-full"
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    mobileNumber: event.target.value,
                  }))
                }
                placeholder="Your mobile number"
                value={form.mobileNumber}
              />
            </label>

            <label className="form-control">
              <span className="mb-1 text-sm font-semibold text-slate-700">Domain</span>
              <select
                className="select select-bordered w-full"
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    domain: event.target.value,
                  }))
                }
                value={form.domain}
              >
                {domainOptions.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="form-control">
              <span className="mb-1 text-sm font-semibold text-slate-700">
                Graduation Month
              </span>
              <select
                className="select select-bordered w-full"
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    graduationMonth: event.target.value,
                  }))
                }
                value={form.graduationMonth}
              >
                <option value="">Select month</option>
                {monthOptions.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="form-control">
              <span className="mb-1 text-sm font-semibold text-slate-700">
                Graduation Year
              </span>
              <select
                className="select select-bordered w-full"
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    graduationYear: event.target.value,
                  }))
                }
                value={form.graduationYear}
              >
                <option value="">Select year</option>
                {yearOptions.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="form-control">
            <span className="mb-1 text-sm font-semibold text-slate-700">
              Profile Photo
            </span>
            <div className="flex flex-wrap items-center gap-3">
              <div className="avatar">
                <div className="h-14 w-14 rounded-full border border-slate-200">
                  {form.profileImage ? (
                    <img alt="Profile preview" src={form.profileImage} />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-slate-100 text-sm font-bold text-slate-500">
                      NA
                    </div>
                  )}
                </div>
              </div>
              <input
                accept="image/png,image/jpeg,image/jpg,image/webp"
                className="file-input file-input-bordered w-full max-w-xs"
                disabled={isUploadingImage}
                onChange={async (event) => {
                  const file = event.target.files?.[0]
                  if (!file) return

                  if (file.size > 2 * 1024 * 1024) {
                    setLocalError('Image size must be 2MB or less.')
                    return
                  }

                  try {
                    const uploaded = await onUploadImage(file)
                    if (uploaded?.url) {
                      setForm((current) => ({
                        ...current,
                        profileImage: uploaded.url,
                      }))
                    }
                  } catch (error) {
                    setLocalError(
                      error?.message || 'Unable to upload image right now.',
                    )
                  }
                }}
                type="file"
              />
              {isUploadingImage && (
                <span className="text-sm font-semibold text-slate-600">Uploading...</span>
              )}
            </div>
          </label>

          <label className="form-control">
            <span className="mb-1 text-sm font-semibold text-slate-700">
              Skills (comma separated)
            </span>
            <input
              className="input input-bordered w-full"
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  skills: event.target.value,
                }))
              }
              placeholder="React, Node.js, PostgreSQL"
              value={form.skills}
            />
            <div className="mt-2 flex flex-wrap gap-2">
              {skillsPreview.length ? (
                skillsPreview.map((item) => (
                  <span className="badge badge-outline" key={item}>
                    {item}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-500">No skills added</span>
              )}
            </div>
          </label>

          <label className="form-control">
            <span className="mb-1 text-sm font-semibold text-slate-700">
              Interests (comma separated)
            </span>
            <input
              className="input input-bordered w-full"
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  interests: event.target.value,
                }))
              }
              placeholder="Open Source, Product, AI"
              value={form.interests}
            />
            <div className="mt-2 flex flex-wrap gap-2">
              {interestsPreview.length ? (
                interestsPreview.map((item) => (
                  <span className="badge badge-outline" key={item}>
                    {item}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-500">No interests added</span>
              )}
            </div>
          </label>

          <label className="form-control">
            <span className="mb-1 text-sm font-semibold text-slate-700">
              Internship Experience
            </span>
            <textarea
              className="textarea textarea-bordered min-h-24 w-full"
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  internships: event.target.value,
                }))
              }
              placeholder="Describe internships, roles, duration, and outcomes."
              value={form.internships}
            />
          </label>

          <label className="form-control">
            <span className="mb-1 text-sm font-semibold text-slate-700">Projects</span>
            <textarea
              className="textarea textarea-bordered min-h-24 w-full"
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  projects: event.target.value,
                }))
              }
              placeholder="Highlight key projects, tech stack, and impact."
              value={form.projects}
            />
          </label>

          <label className="form-control">
            <span className="mb-1 text-sm font-semibold text-slate-700">Bio / About</span>
            <textarea
              className="textarea textarea-bordered min-h-24 w-full"
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  bio: event.target.value,
                }))
              }
              placeholder="Write a short professional introduction."
              value={form.bio}
            />
          </label>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="form-control">
              <span className="mb-1 text-sm font-semibold text-slate-700">
                LinkedIn URL
              </span>
              <input
                className="input input-bordered w-full"
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    linkedinUrl: event.target.value,
                  }))
                }
                placeholder="https://linkedin.com/in/username"
                value={form.linkedinUrl}
              />
            </label>

            <label className="form-control">
              <span className="mb-1 text-sm font-semibold text-slate-700">GitHub URL</span>
              <input
                className="input input-bordered w-full"
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    githubUrl: event.target.value,
                  }))
                }
                placeholder="https://github.com/username"
                value={form.githubUrl}
              />
            </label>
          </div>

          <div className="modal-action">
            <button className="btn" onClick={onClose} type="button">
              Cancel
            </button>
            <button className="btn btn-primary" disabled={isSaving} type="submit">
              {isSaving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
      <button aria-label="Close" className="modal-backdrop" onClick={onClose} type="button">
        Close
      </button>
    </div>
  )
}

export default EditProfileModal
