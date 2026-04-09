import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import AppShell from '../components/layout/AppShell'
import { getMe, updateMe } from '../services/platformApi'
import { useAuthStore } from '../store/authStore'
import { getErrorMessage } from '../utils/error'

const toCsv = (items = []) => items.join(', ')

const toArray = (value = '') => {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

function Profile() {
  const queryClient = useQueryClient()
  const setUser = useAuthStore((state) => state.setUser)
  const [feedback, setFeedback] = useState({ type: '', message: '' })

  const meQuery = useQuery({
    queryKey: ['me'],
    queryFn: getMe,
  })

  const updateMutation = useMutation({
    mutationFn: updateMe,
    onSuccess: async (data) => {
      setFeedback({ type: 'success', message: data.message || 'Profile updated.' })
      if (data.user) {
        setUser(data.user)
      }
      await queryClient.invalidateQueries({ queryKey: ['me'] })
      await queryClient.invalidateQueries({ queryKey: ['users'] })
    },
    onError: (error) => {
      setFeedback({ type: 'error', message: getErrorMessage(error, 'Failed to update profile.') })
    },
  })

  const me = meQuery.data?.user

  return (
    <AppShell title="My Profile">
      {feedback.message && (
        <div
          className={`mb-4 rounded-xl px-4 py-3 text-sm font-semibold ${
            feedback.type === 'error'
              ? 'bg-red-100 text-red-700'
              : 'bg-emerald-100 text-emerald-700'
          }`}
        >
          {feedback.message}
        </div>
      )}

      {meQuery.isLoading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
          Loading profile...
        </div>
      ) : meQuery.isError ? (
        <div className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
          Data not available right now
        </div>
      ) : !me ? (
        <div className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
          Data not available right now
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-4">
            <h2 className="mb-3 text-lg font-black text-blue-950">Account</h2>
            <div className="space-y-2 text-sm text-slate-700">
              <p>
                <span className="font-semibold">Name:</span> {me?.name}
              </p>
              <p>
                <span className="font-semibold">Email:</span> {me?.email}
              </p>
              <p>
                <span className="font-semibold">Role:</span> {me?.role}
              </p>
              <p>
                <span className="font-semibold">College:</span> {me?.collegeName}
              </p>
              {me?.enrollmentNumber && (
                <p>
                  <span className="font-semibold">Enrollment:</span> {me.enrollmentNumber}
                </p>
              )}
              <p>
                <span className="font-semibold">Verified:</span>{' '}
                {me?.verified ? 'Yes' : 'No'}
              </p>
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-8">
            <h2 className="mb-3 text-lg font-black text-blue-950">Edit Profile</h2>
            <form
              key={me?.id || 'profile-form'}
              className="space-y-4"
              onSubmit={(event) => {
                event.preventDefault()
                const formData = new FormData(event.currentTarget)
                updateMutation.mutate({
                  name: String(formData.get('name') || ''),
                  skills: toArray(String(formData.get('skills') || '')),
                  interests: toArray(String(formData.get('interests') || '')),
                })
              }}
            >
              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-slate-700">Name</span>
                <input
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  defaultValue={me?.name || ''}
                  name="name"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-slate-700">
                  Skills (comma separated)
                </span>
                <input
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  defaultValue={toCsv(me?.skills)}
                  name="skills"
                  placeholder="React, Node.js, PostgreSQL"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-slate-700">
                  Interests (comma separated)
                </span>
                <input
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  defaultValue={toCsv(me?.interests)}
                  name="interests"
                  placeholder="Startups, AI, Open Source"
                />
              </label>

              <button
                className="rounded-lg bg-blue-900 px-4 py-2 text-sm font-bold text-white"
                disabled={updateMutation.isPending}
                type="submit"
              >
                {updateMutation.isPending ? 'Saving...' : 'Save Profile'}
              </button>
            </form>
          </section>
        </div>
      )}
    </AppShell>
  )
}

export default Profile
