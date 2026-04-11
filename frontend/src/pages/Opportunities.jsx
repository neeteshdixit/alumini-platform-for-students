import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useSearchParams } from 'react-router-dom'

import AppShell from '../components/layout/AppShell'
import {
  applyOpportunity,
  createOpportunity,
  getOpportunityMatches,
  getOpportunities,
} from '../services/platformApi'
import { useAuthStore } from '../store/authStore'
import { getErrorMessage } from '../utils/error'

const opportunityTypeOptions = [
  { label: 'All', value: '' },
  { label: 'Jobs', value: 'JOB' },
  { label: 'Internships', value: 'INTERNSHIP' },
  { label: 'Events', value: 'EVENT' },
]

const opportunityFormInitial = {
  type: 'JOB',
  title: '',
  companyName: '',
  targetDomain: 'both',
  description: '',
  location: '',
  compensation: '',
  deadline: '',
  applicationUrl: '',
  skillsRequired: '',
}

const applicationFormInitial = {
  coverNote: '',
}

const toSkillList = (value = '') => {
  return String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

const formatDate = (value) => {
  if (!value) return 'Not specified'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Not specified'
  return date.toLocaleString()
}

function OpportunityCard({ opportunity, isStudent, onApply, isApplying }) {
  const canApply = isStudent && opportunity.status === 'ACTIVE'

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-black text-blue-950">{opportunity.title}</h3>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-slate-600">
              {opportunity.type}
            </span>
            <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-emerald-700">
              {opportunity.status}
            </span>
          </div>
          <p className="text-sm font-semibold text-slate-700">{opportunity.companyName}</p>
          <p className="text-xs text-slate-500">
            Posted by {opportunity.creator?.name || 'Unknown'} | {opportunity.collegeName}
          </p>
        </div>
        {typeof opportunity.matchScore === 'number' && (
          <div className="rounded-2xl bg-blue-50 px-3 py-2 text-right">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-blue-700">
              Match
            </p>
            <p className="text-lg font-black text-blue-950">{opportunity.matchScore}%</p>
          </div>
        )}
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-700">{opportunity.description}</p>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
            Location
          </p>
          <p className="text-sm font-semibold text-slate-800">
            {opportunity.location || 'Flexible / Remote'}
          </p>
        </div>
        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
            Compensation
          </p>
          <p className="text-sm font-semibold text-slate-800">
            {opportunity.compensation || 'Not specified'}
          </p>
        </div>
        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
            Deadline
          </p>
          <p className="text-sm font-semibold text-slate-800">
            {formatDate(opportunity.deadline)}
          </p>
        </div>
        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
            Applications
          </p>
          <p className="text-sm font-semibold text-slate-800">{opportunity.applicationCount}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
          Domain: {opportunity.targetDomain}
        </span>
        {opportunity.skillsRequired?.length ? (
          opportunity.skillsRequired.map((skill) => (
            <span
              className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"
              key={skill}
            >
              {skill}
            </span>
          ))
        ) : (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
            No specific skills listed
          </span>
        )}
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {canApply ? (
          <button
            className="rounded-xl bg-blue-900 px-4 py-2 text-sm font-bold text-white disabled:opacity-60"
            disabled={isApplying || opportunity.appliedByMe}
            onClick={() => onApply(opportunity)}
            type="button"
          >
            {opportunity.appliedByMe
              ? 'Applied'
              : isApplying
                ? 'Applying...'
                : 'Apply Now'}
          </button>
        ) : (
          <span className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600">
            {opportunity.appliedByMe ? 'Application submitted' : 'Students only'}
          </span>
        )}

        {opportunity.applicationUrl && (
          <a
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
            href={opportunity.applicationUrl}
            rel="noreferrer"
            target="_blank"
          >
            External Apply
          </a>
        )}
      </div>
    </article>
  )
}

function Opportunities() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const queryClient = useQueryClient()
  const user = useAuthStore((state) => state.user)
  const isStudent = String(user?.role || '').toLowerCase() === 'student'
  const isAlumni = String(user?.role || '').toLowerCase() === 'alumni'

  const [feedback, setFeedback] = useState({ type: '', message: '' })
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isApplyOpen, setIsApplyOpen] = useState(false)
  const [activeOpportunity, setActiveOpportunity] = useState(null)
  const [createForm, setCreateForm] = useState(opportunityFormInitial)
  const [applicationForm, setApplicationForm] = useState(applicationFormInitial)

  const activeType = searchParams.get('type') || ''

  const opportunitiesQuery = useQuery({
    queryKey: ['opportunities', activeType],
    queryFn: () =>
      getOpportunities(
        activeType
          ? {
              type: activeType,
            }
          : {},
      ),
  })

  const matchesQuery = useQuery({
    queryKey: ['opportunities', 'matches'],
    queryFn: getOpportunityMatches,
    enabled: isStudent,
  })

  const createMutation = useMutation({
    mutationFn: createOpportunity,
    onSuccess: async (response) => {
      setFeedback({
        type: 'success',
        message: response?.message || 'Opportunity posted successfully.',
      })
      setCreateForm(opportunityFormInitial)
      setIsCreateOpen(false)
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['opportunities'] }),
      ])
    },
    onError: (error) => {
      setFeedback({
        type: 'error',
        message: getErrorMessage(error, 'Failed to post opportunity.'),
      })
    },
  })

  const applyMutation = useMutation({
    mutationFn: applyOpportunity,
    onSuccess: async (response) => {
      setFeedback({
        type: 'success',
        message: response?.message || 'Application submitted successfully.',
      })
      setIsApplyOpen(false)
      setActiveOpportunity(null)
      setApplicationForm(applicationFormInitial)
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['opportunities'] }),
      ])
    },
    onError: (error) => {
      setFeedback({
        type: 'error',
        message: getErrorMessage(error, 'Failed to submit application.'),
      })
    },
  })

  const opportunities = opportunitiesQuery.data?.opportunities || []
  const matchedOpportunities = matchesQuery.data?.opportunities || []

  const headerActions = isAlumni ? (
    <button
      className="rounded-xl bg-blue-900 px-4 py-2 text-sm font-bold text-white"
      onClick={() => setIsCreateOpen(true)}
      type="button"
    >
      Post Opportunity
    </button>
  ) : (
    <button
      className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
      onClick={() => navigate('/dashboard')}
      type="button"
    >
      Back to Dashboard
    </button>
  )

  const handleCreateSubmit = async (event) => {
    event.preventDefault()
    setFeedback({ type: '', message: '' })

    createMutation.mutate({
      ...createForm,
      location: createForm.location.trim() || undefined,
      compensation: createForm.compensation.trim() || undefined,
      applicationUrl: createForm.applicationUrl.trim() || undefined,
      skillsRequired: toSkillList(createForm.skillsRequired),
      deadline: createForm.deadline ? new Date(createForm.deadline).toISOString() : undefined,
    })
  }

  const handleApplySubmit = async (event) => {
    event.preventDefault()
    if (!activeOpportunity?.id) return

    applyMutation.mutate({
      opportunityId: activeOpportunity.id,
      coverNote: applicationForm.coverNote.trim(),
    })
  }

  return (
    <AppShell actions={headerActions} title="Opportunities">
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

      {isStudent && (
        <section className="mb-6 rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-950 via-blue-900 to-slate-900 p-6 text-white shadow-lg">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-200">
                Personalized Matches
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-tight">
                Opportunities matched to your college, domain, and skills
              </h2>
              <p className="mt-2 text-sm leading-6 text-blue-100">
                This section is ranked using your profile data so students see relevant jobs,
                internships, and events first.
              </p>
            </div>
            <div className="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-100">
                Available matches
              </p>
              <p className="text-3xl font-black">{matchedOpportunities.length}</p>
            </div>
          </div>
        </section>
      )}

      {isStudent && (
        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-lg font-black text-blue-950">Recommended For You</h2>
            <span className="text-sm font-semibold text-slate-500">
              Ranked by college, domain, and skill overlap
            </span>
          </div>

          {matchesQuery.isLoading ? (
            <p className="text-sm text-slate-600">Loading...</p>
          ) : matchesQuery.isError ? (
            <p className="text-sm text-slate-600">Something went wrong</p>
          ) : matchedOpportunities.length === 0 ? (
            <p className="text-sm text-slate-600">Data not available right now</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              {matchedOpportunities.slice(0, 4).map((opportunity) => (
                <OpportunityCard
                  isApplying={applyMutation.isPending && activeOpportunity?.id === opportunity.id}
                  isStudent={isStudent}
                  key={opportunity.id}
                  onApply={(item) => {
                    setActiveOpportunity(item)
                    setApplicationForm(applicationFormInitial)
                    setIsApplyOpen(true)
                  }}
                  opportunity={opportunity}
                />
              ))}
            </div>
          )}
        </section>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-black text-blue-950">All Opportunities</h2>
            <p className="text-sm text-slate-600">
              Alumni-posted jobs, internships, and events.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {opportunityTypeOptions.map((option) => {
              const isActive = option.value === activeType
              return (
                <button
                  className={`rounded-xl px-3 py-2 text-sm font-semibold ${
                    isActive
                      ? 'bg-blue-900 text-white'
                      : 'border border-slate-300 text-slate-700'
                  }`}
                  key={option.value || 'ALL'}
                  onClick={() => setSearchParams(option.value ? { type: option.value } : {})}
                  type="button"
                >
                  {option.label}
                </button>
              )
            })}
          </div>
        </div>

        {opportunitiesQuery.isLoading ? (
          <p className="text-sm text-slate-600">Loading...</p>
        ) : opportunitiesQuery.isError ? (
          <p className="text-sm text-slate-600">Something went wrong</p>
        ) : opportunities.length === 0 ? (
          <p className="text-sm text-slate-600">Data not available right now</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {opportunities.map((opportunity) => (
              <OpportunityCard
                isApplying={applyMutation.isPending && activeOpportunity?.id === opportunity.id}
                isStudent={isStudent}
                key={opportunity.id}
                onApply={(item) => {
                  setActiveOpportunity(item)
                  setApplicationForm(applicationFormInitial)
                  setIsApplyOpen(true)
                }}
                opportunity={opportunity}
              />
            ))}
          </div>
        )}
      </section>

      {isCreateOpen && (
        <div className="modal modal-open" role="dialog">
          <div className="modal-box max-w-3xl">
            <h3 className="text-xl font-black text-blue-950">Post Opportunity</h3>
            <p className="mt-1 text-sm text-slate-600">
              Share a job, internship, or event with your college network.
            </p>

            <form className="mt-5 space-y-4" onSubmit={handleCreateSubmit}>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <select
                  className="select select-bordered w-full"
                  onChange={(event) =>
                    setCreateForm((current) => ({ ...current, type: event.target.value }))
                  }
                  value={createForm.type}
                >
                  <option value="JOB">Job</option>
                  <option value="INTERNSHIP">Internship</option>
                  <option value="EVENT">Event</option>
                </select>
                <select
                  className="select select-bordered w-full"
                  onChange={(event) =>
                    setCreateForm((current) => ({
                      ...current,
                      targetDomain: event.target.value,
                    }))
                  }
                  value={createForm.targetDomain}
                >
                  <option value="both">Both</option>
                  <option value="tech">Tech</option>
                  <option value="non-tech">Non-Tech</option>
                </select>
              </div>

              <input
                className="input input-bordered w-full"
                onChange={(event) =>
                  setCreateForm((current) => ({ ...current, title: event.target.value }))
                }
                placeholder="Opportunity title"
                value={createForm.title}
              />

              <input
                className="input input-bordered w-full"
                onChange={(event) =>
                  setCreateForm((current) => ({
                    ...current,
                    companyName: event.target.value,
                  }))
                }
                placeholder="Company / Organization"
                value={createForm.companyName}
              />

              <textarea
                className="textarea textarea-bordered min-h-28 w-full"
                onChange={(event) =>
                  setCreateForm((current) => ({
                    ...current,
                    description: event.target.value,
                  }))
                }
                placeholder="Describe the role, eligibility, and expected outcomes."
                value={createForm.description}
              />

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <input
                  className="input input-bordered w-full"
                  onChange={(event) =>
                    setCreateForm((current) => ({
                      ...current,
                      location: event.target.value,
                    }))
                  }
                  placeholder="Location or Remote"
                  value={createForm.location}
                />
                <input
                  className="input input-bordered w-full"
                  onChange={(event) =>
                    setCreateForm((current) => ({
                      ...current,
                      compensation: event.target.value,
                    }))
                  }
                  placeholder="Compensation or stipend"
                  value={createForm.compensation}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <input
                  className="input input-bordered w-full"
                  onChange={(event) =>
                    setCreateForm((current) => ({
                      ...current,
                      deadline: event.target.value,
                    }))
                  }
                  type="datetime-local"
                  value={createForm.deadline}
                />
                <input
                  className="input input-bordered w-full"
                  onChange={(event) =>
                    setCreateForm((current) => ({
                      ...current,
                      applicationUrl: event.target.value,
                    }))
                  }
                  placeholder="External application URL (optional)"
                  value={createForm.applicationUrl}
                />
              </div>

              <input
                className="input input-bordered w-full"
                onChange={(event) =>
                  setCreateForm((current) => ({
                    ...current,
                    skillsRequired: event.target.value,
                  }))
                }
                placeholder="Required skills, comma separated"
                value={createForm.skillsRequired}
              />

              <div className="modal-action">
                <button
                  className="btn"
                  onClick={() => setIsCreateOpen(false)}
                  type="button"
                >
                  Cancel
                </button>
                <button className="btn btn-primary" disabled={createMutation.isPending} type="submit">
                  {createMutation.isPending ? 'Posting...' : 'Post Opportunity'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isApplyOpen && activeOpportunity && (
        <div className="modal modal-open" role="dialog">
          <div className="modal-box">
            <h3 className="text-xl font-black text-blue-950">Apply to Opportunity</h3>
            <p className="mt-1 text-sm text-slate-600">
              Tell the alumni why you are a good fit for {activeOpportunity.title}.
            </p>

            <form className="mt-5 space-y-4" onSubmit={handleApplySubmit}>
              <textarea
                className="textarea textarea-bordered min-h-32 w-full"
                onChange={(event) =>
                  setApplicationForm((current) => ({
                    ...current,
                    coverNote: event.target.value,
                  }))
                }
                placeholder="Short cover note or introduction"
                value={applicationForm.coverNote}
              />

              <div className="modal-action">
                <button
                  className="btn"
                  onClick={() => {
                    setIsApplyOpen(false)
                    setActiveOpportunity(null)
                  }}
                  type="button"
                >
                  Cancel
                </button>
                <button className="btn btn-primary" disabled={applyMutation.isPending} type="submit">
                  {applyMutation.isPending ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  )
}

export default Opportunities
