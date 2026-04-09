import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

import EditProfileModal from '../components/profile/EditProfileModal'
import AppShell from '../components/layout/AppShell'
import {
  deleteMe,
  getMe,
  updateMe,
  uploadProfileImage,
} from '../services/platformApi'
import { useAuthStore } from '../store/authStore'
import { getErrorMessage } from '../utils/error'

const domainLabelMap = {
  tech: 'Tech',
  'non-tech': 'Non-Tech',
  both: 'Both',
}

const getDomainLabel = (domain) => {
  return domainLabelMap[domain] || 'Both'
}

const Avatar = ({ name, image }) => {
  if (image) {
    return (
      <div className="avatar">
        <div className="h-24 w-24 rounded-full border border-slate-200">
          <img alt={name || 'Profile'} src={image} />
        </div>
      </div>
    )
  }

  const initial = String(name || 'U').slice(0, 1).toUpperCase()
  return (
    <div className="avatar placeholder">
      <div className="h-24 w-24 rounded-full bg-blue-100 text-3xl font-black text-blue-900">
        <span>{initial}</span>
      </div>
    </div>
  )
}

function Profile() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const setUser = useAuthStore((state) => state.setUser)
  const clearSession = useAuthStore((state) => state.clearSession)

  const [feedback, setFeedback] = useState({ type: '', message: '' })
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [deleteForm, setDeleteForm] = useState({
    confirmText: '',
    password: '',
  })

  const meQuery = useQuery({
    queryKey: ['me'],
    queryFn: getMe,
  })

  const updateMutation = useMutation({
    mutationFn: updateMe,
    onSuccess: async (data) => {
      if (data.user) {
        setUser(data.user)
      }
      setFeedback({
        type: 'success',
        message: data.message || 'Profile updated successfully',
      })
      setIsEditOpen(false)
      await queryClient.invalidateQueries({ queryKey: ['me'] })
      await queryClient.invalidateQueries({ queryKey: ['users'] })
      await queryClient.invalidateQueries({ queryKey: ['suggestions'] })
    },
    onError: (error) => {
      setFeedback({
        type: 'error',
        message: getErrorMessage(error, 'Failed to update profile.'),
      })
    },
  })

  const uploadMutation = useMutation({
    mutationFn: uploadProfileImage,
  })

  const deleteMutation = useMutation({
    mutationFn: deleteMe,
    onSuccess: async () => {
      clearSession()
      queryClient.clear()
      navigate('/login', { replace: true })
    },
    onError: (error) => {
      setFeedback({
        type: 'error',
        message: getErrorMessage(error, 'Failed to delete account.'),
      })
    },
  })

  const me = meQuery.data?.user

  const skills = useMemo(() => me?.skills || [], [me?.skills])
  const interests = useMemo(() => me?.interests || [], [me?.interests])

  const headerActions = (
    <button className="btn btn-primary" onClick={() => setIsEditOpen(true)} type="button">
      Edit Profile
    </button>
  )

  return (
    <AppShell actions={headerActions} title="My Profile">
      {feedback.message && (
        <div
          className={`mb-4 rounded-lg px-4 py-3 text-sm font-semibold ${
            feedback.type === 'error'
              ? 'bg-red-100 text-red-700'
              : 'bg-emerald-100 text-emerald-700'
          }`}
        >
          {feedback.message}
        </div>
      )}

      {meQuery.isLoading ? (
        <div className="card border border-slate-200 bg-white p-5 text-sm text-slate-600 shadow-sm">
          Loading profile...
        </div>
      ) : meQuery.isError ? (
        <div className="card border border-slate-200 bg-white p-5 text-sm text-slate-600 shadow-sm">
          Data not available right now
        </div>
      ) : !me ? (
        <div className="card border border-slate-200 bg-white p-5 text-sm text-slate-600 shadow-sm">
          Data not available right now
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <section className="card border border-slate-200 bg-white p-5 shadow-sm lg:col-span-4">
            <div className="mb-4 flex items-center gap-4">
              <Avatar image={me.profileImage || me.avatarUrl} name={me.name} />
              <div>
                <h2 className="text-xl font-black text-blue-950">{me.name}</h2>
                <p className="text-sm font-semibold capitalize text-slate-700">{me.role}</p>
                <p className="text-sm text-slate-600">{me.collegeName || 'College not set'}</p>
              </div>
            </div>

            <div className="space-y-2 text-sm text-slate-700">
              <p>
                <span className="font-semibold">Email:</span> {me.email}
              </p>
              <p>
                <span className="font-semibold">Domain:</span>{' '}
                <span className="badge badge-outline">{getDomainLabel(me.domain)}</span>
              </p>
              <p>
                <span className="font-semibold">Verified:</span>{' '}
                {me.verified ? 'Yes' : 'No'}
              </p>
              {me.enrollmentNumber && (
                <p>
                  <span className="font-semibold">Enrollment:</span> {me.enrollmentNumber}
                </p>
              )}
            </div>
          </section>

          <section className="space-y-6 lg:col-span-8">
            <article className="card border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="mb-2 text-lg font-black text-blue-950">About</h3>
              <p className="text-sm text-slate-700">
                {me.bio || 'Bio not added yet.'}
              </p>
            </article>

            <article className="card border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="mb-3 text-lg font-black text-blue-950">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {skills.length ? (
                  skills.map((skill) => (
                    <span className="badge badge-primary badge-outline" key={skill}>
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-slate-600">No skills added</p>
                )}
              </div>
            </article>

            <article className="card border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="mb-3 text-lg font-black text-blue-950">Interests</h3>
              <div className="flex flex-wrap gap-2">
                {interests.length ? (
                  interests.map((item) => (
                    <span className="badge badge-accent badge-outline" key={item}>
                      {item}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-slate-600">No interests added</p>
                )}
              </div>
            </article>

            <article className="card border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="mb-2 text-lg font-black text-blue-950">Internship Experience</h3>
              <p className="text-sm text-slate-700">
                {me.internships || 'Internship details not added yet.'}
              </p>
            </article>

            <article className="card border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="mb-2 text-lg font-black text-blue-950">Projects</h3>
              <p className="text-sm text-slate-700">
                {me.projects || 'Project details not added yet.'}
              </p>
            </article>

            <article className="card border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="mb-3 text-lg font-black text-blue-950">Social Links</h3>
              <div className="flex flex-wrap gap-2">
                {me.linkedinUrl ? (
                  <a
                    className="btn btn-sm"
                    href={me.linkedinUrl}
                    rel="noreferrer"
                    target="_blank"
                  >
                    LinkedIn
                  </a>
                ) : (
                  <span className="text-sm text-slate-600">LinkedIn not added</span>
                )}
                {me.githubUrl ? (
                  <a
                    className="btn btn-sm"
                    href={me.githubUrl}
                    rel="noreferrer"
                    target="_blank"
                  >
                    GitHub
                  </a>
                ) : (
                  <span className="text-sm text-slate-600">GitHub not added</span>
                )}
              </div>
            </article>

            <article className="card border border-red-200 bg-red-50 p-5 shadow-sm">
              <h3 className="text-lg font-black text-red-900">Delete Account</h3>
              <p className="mt-1 text-sm text-red-800">
                This action is permanent and cannot be undone.
              </p>
              <form
                className="mt-4 space-y-3"
                onSubmit={(event) => {
                  event.preventDefault()
                  setFeedback({ type: '', message: '' })

                  if (deleteForm.confirmText.trim().toUpperCase() !== 'DELETE') {
                    setFeedback({
                      type: 'error',
                      message: 'Type DELETE to confirm account deletion.',
                    })
                    return
                  }

                  const confirmed = window.confirm(
                    'Are you sure? This account deletion cannot be undone.',
                  )
                  if (!confirmed) {
                    return
                  }

                  deleteMutation.mutate({
                    confirmText: deleteForm.confirmText,
                    password: deleteForm.password,
                  })
                }}
              >
                <input
                  className="input input-bordered w-full border-red-200"
                  onChange={(event) =>
                    setDeleteForm((current) => ({
                      ...current,
                      confirmText: event.target.value,
                    }))
                  }
                  placeholder="Type DELETE to confirm"
                  value={deleteForm.confirmText}
                />
                <input
                  className="input input-bordered w-full border-red-200"
                  onChange={(event) =>
                    setDeleteForm((current) => ({
                      ...current,
                      password: event.target.value,
                    }))
                  }
                  placeholder="Current password"
                  type="password"
                  value={deleteForm.password}
                />
                <button
                  className="btn btn-error"
                  disabled={deleteMutation.isPending}
                  type="submit"
                >
                  {deleteMutation.isPending ? 'Deleting...' : 'Delete My Account'}
                </button>
              </form>
            </article>
          </section>
        </div>
      )}

      <EditProfileModal
        initialData={me}
        isOpen={isEditOpen}
        isSaving={updateMutation.isPending}
        isUploadingImage={uploadMutation.isPending}
        onClose={() => setIsEditOpen(false)}
        onSave={(payload) => updateMutation.mutate(payload)}
        onUploadImage={async (file) => uploadMutation.mutateAsync(file)}
      />
    </AppShell>
  )
}

export default Profile
