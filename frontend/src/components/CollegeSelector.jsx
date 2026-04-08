import { useEffect, useMemo, useState } from 'react'

import { api } from '../services/api'

const states = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry',
]

const initialAddForm = {
  name: '',
  state: '',
}

const getApiMessage = (error, fallbackMessage) => {
  if (!error?.response) {
    return 'Unable to connect to backend server at http://localhost:5000. Please start backend and try again.'
  }

  return error?.response?.data?.message || fallbackMessage
}

function CollegeSelector() {
  const [selectedState, setSelectedState] = useState('')
  const [selectedCollege, setSelectedCollege] = useState('')
  const [colleges, setColleges] = useState([])
  const [isLoadingColleges, setIsLoadingColleges] = useState(false)
  const [isSubmittingCollege, setIsSubmittingCollege] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [addForm, setAddForm] = useState(initialAddForm)
  const [feedback, setFeedback] = useState({ type: '', message: '' })

  const hasStateSelected = Boolean(selectedState)
  const noCollegesFound = hasStateSelected && !isLoadingColleges && colleges.length === 0

  const selectedCollegeMessage = useMemo(() => {
    return selectedCollege
      ? `You selected: ${selectedCollege}`
      : 'No college selected yet.'
  }, [selectedCollege])

  const loadColleges = async (state) => {
    if (!state) {
      setColleges([])
      return
    }

    setIsLoadingColleges(true)
    setFeedback({ type: '', message: '' })

    try {
      const response = await api.get('/api/colleges', {
        params: { state },
      })

      const fetchedColleges = response.data?.colleges || []
      setColleges(fetchedColleges)
    } catch (error) {
      const message = getApiMessage(
        error,
        'Unable to fetch colleges right now. Please try again.',
      )

      setFeedback({ type: 'error', message })
      setColleges([])
    } finally {
      setIsLoadingColleges(false)
    }
  }

  useEffect(() => {
    loadColleges(selectedState)
  }, [selectedState])

  const handleStateChange = (event) => {
    const nextState = event.target.value
    setSelectedState(nextState)
    setSelectedCollege('')
    setAddForm((current) => ({
      ...current,
      state: nextState,
    }))
  }

  const handleCollegeChange = (event) => {
    setSelectedCollege(event.target.value)
  }

  const openAddCollegeModal = () => {
    setAddForm({
      name: '',
      state: selectedState,
    })
    setFeedback({ type: '', message: '' })
    setShowModal(true)
  }

  const closeAddCollegeModal = () => {
    setShowModal(false)
  }

  const handleAddCollege = async (event) => {
    event.preventDefault()

    const name = addForm.name.trim()
    const state = addForm.state.trim()

    if (!name || !state) {
      setFeedback({ type: 'error', message: 'College name and state are required.' })
      return
    }

    setIsSubmittingCollege(true)
    setFeedback({ type: '', message: '' })

    try {
      const response = await api.post('/api/colleges', {
        name,
        state,
      })

      const createdCollege = response.data?.college

      setFeedback({ type: 'success', message: 'College added successfully.' })
      closeAddCollegeModal()

      if (state === selectedState) {
        await loadColleges(selectedState)
        if (createdCollege?.name) {
          setSelectedCollege(createdCollege.name)
        }
      }
    } catch (error) {
      const message = getApiMessage(
        error,
        'Unable to add college right now. Please try again.',
      )

      setFeedback({ type: 'error', message })
    } finally {
      setIsSubmittingCollege(false)
    }
  }

  return (
    <div className="card bg-surface-container-lowest shadow-xl">
      <div className="card-body space-y-5 p-5 md:p-6">
        <div>
          <h3 className="text-xl font-bold text-primary">Find College by State</h3>
          <p className="mt-1 text-sm text-on-surface-variant">
            Select your state first, then choose your college or university.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text font-semibold text-on-surface">Select State</span>
            </div>
            <select
              className="select select-bordered w-full"
              onChange={handleStateChange}
              value={selectedState}
            >
              <option value="">Select State</option>
              {states.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </label>

          <label className="form-control w-full">
            <div className="label">
              <span className="label-text font-semibold text-on-surface">Select College</span>
            </div>
            <select
              className="select select-bordered w-full"
              disabled={!hasStateSelected || isLoadingColleges}
              onChange={handleCollegeChange}
              value={selectedCollege}
            >
              <option value="">
                {!hasStateSelected
                  ? 'Select State first'
                  : isLoadingColleges
                    ? 'Loading colleges...'
                    : 'Select College'}
              </option>
              {colleges.map((college) => (
                <option key={college.id} value={college.name}>
                  {college.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-medium text-on-surface-variant">{selectedCollegeMessage}</p>

          <button
            className="btn btn-outline btn-sm"
            disabled={!hasStateSelected}
            onClick={openAddCollegeModal}
            type="button"
          >
            Add your college
          </button>
        </div>

        {noCollegesFound && (
          <p className="text-sm text-on-surface-variant">
            No colleges found for this state. Use "Add your college" to add one.
          </p>
        )}

        {feedback.message && (
          <div
            className={`rounded-lg px-4 py-3 text-sm font-medium ${
              feedback.type === 'success'
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
            }`}
          >
            {feedback.message}
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal modal-open" role="dialog">
          <div className="modal-box">
            <h3 className="text-lg font-bold">Add your college</h3>
            <p className="py-2 text-sm text-on-surface-variant">
              Your college will be available to all users for this state.
            </p>

            <form className="space-y-4" onSubmit={handleAddCollege}>
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text">College name</span>
                </div>
                <input
                  className="input input-bordered w-full"
                  name="collegeName"
                  onChange={(event) => {
                    setAddForm((current) => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }}
                  placeholder="Enter college name"
                  type="text"
                  value={addForm.name}
                />
              </label>

              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text">State</span>
                </div>
                <select
                  className="select select-bordered w-full"
                  onChange={(event) => {
                    setAddForm((current) => ({
                      ...current,
                      state: event.target.value,
                    }))
                  }}
                  value={addForm.state}
                >
                  <option value="">Select State</option>
                  {states.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </label>

              <div className="modal-action">
                <button
                  className="btn"
                  onClick={closeAddCollegeModal}
                  type="button"
                >
                  Cancel
                </button>
                <button className="btn btn-primary" disabled={isSubmittingCollege} type="submit">
                  {isSubmittingCollege ? 'Saving...' : 'Save College'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default CollegeSelector
