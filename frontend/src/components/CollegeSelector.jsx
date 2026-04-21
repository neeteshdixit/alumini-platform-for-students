import { useEffect, useMemo, useState } from 'react'

import ActionButton from './ui/ActionButton'
import {
  getLocationColleges,
  getLocationDistricts,
  getLocationStates,
} from '../services/platformApi'
import { api } from '../services/api'

const initialAddForm = {
  name: '',
  stateName: '',
  districtName: '',
  emailDomain: '',
}

const getApiMessage = (error, fallbackMessage) => {
  if (!error?.response) {
    return 'Something went wrong. Please try again.'
  }

  const statusCode = Number(error.response?.status || 0)
  if (statusCode >= 500) {
    return 'Something went wrong. Please try again.'
  }

  return error?.response?.data?.message || fallbackMessage
}

function CollegeSelector({
  className = '',
  heading = 'Find College by Location',
  description = 'Select your state first, then choose your district and college.',
  onSelectionChange,
  allowCreateCollege = true,
}) {
  const [states, setStates] = useState([])
  const [districts, setDistricts] = useState([])
  const [colleges, setColleges] = useState([])
  const [selectedStateId, setSelectedStateId] = useState('')
  const [selectedDistrictId, setSelectedDistrictId] = useState('')
  const [selectedCollegeId, setSelectedCollegeId] = useState('')
  const [isLoadingStates, setIsLoadingStates] = useState(true)
  const [isLoadingDistricts, setIsLoadingDistricts] = useState(false)
  const [isLoadingColleges, setIsLoadingColleges] = useState(false)
  const [isSubmittingCollege, setIsSubmittingCollege] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [addForm, setAddForm] = useState(initialAddForm)
  const [feedback, setFeedback] = useState({ type: '', message: '' })

  const selectedState = states.find((item) => item.id === selectedStateId) || null
  const selectedDistrict = districts.find((item) => item.id === selectedDistrictId) || null
  const selectedCollege = colleges.find((item) => item.id === selectedCollegeId) || null

  const selectedCollegeMessage = useMemo(() => {
    if (!selectedCollege) {
      return 'No college selected yet.'
    }

    return [
      selectedCollege.name,
      selectedDistrict?.name || selectedCollege.district,
      selectedState?.name || selectedCollege.state,
    ]
      .filter(Boolean)
      .join(' • ')
  }, [selectedCollege, selectedDistrict?.name, selectedCollege?.district, selectedState?.name, selectedCollege?.state])

  const syncSelection = (college) => {
    if (onSelectionChange) {
      onSelectionChange(
        college
          ? {
              stateId: college.stateId || selectedStateId || '',
              districtId: college.districtId || selectedDistrictId || '',
              collegeId: college.id,
              collegeName: college.name,
              stateName: selectedState?.name || college.state || '',
              districtName: selectedDistrict?.name || college.district || '',
            }
          : null,
      )
    }
  }

  const loadStates = async () => {
    setIsLoadingStates(true)
    try {
      const response = await getLocationStates()
      setStates(response?.states || [])
    } catch (error) {
      setFeedback({
        type: 'error',
        message: getApiMessage(error, 'Unable to fetch states right now.'),
      })
    } finally {
      setIsLoadingStates(false)
    }
  }

  const loadDistricts = async (stateId) => {
    if (!stateId) {
      setDistricts([])
      return
    }

    setIsLoadingDistricts(true)
    try {
      const response = await getLocationDistricts(stateId)
      setDistricts(response?.districts || [])
    } catch (error) {
      setFeedback({
        type: 'error',
        message: getApiMessage(error, 'Unable to fetch districts right now.'),
      })
      setDistricts([])
    } finally {
      setIsLoadingDistricts(false)
    }
  }

  const loadColleges = async (districtId) => {
    if (!districtId) {
      setColleges([])
      return
    }

    setIsLoadingColleges(true)
    try {
      const response = await getLocationColleges(districtId)
      setColleges(response?.colleges || [])
    } catch (error) {
      setFeedback({
        type: 'error',
        message: getApiMessage(error, 'Unable to fetch colleges right now.'),
      })
      setColleges([])
    } finally {
      setIsLoadingColleges(false)
    }
  }

  useEffect(() => {
    loadStates()
  }, [])

  useEffect(() => {
    loadDistricts(selectedStateId)
    setSelectedDistrictId('')
    setSelectedCollegeId('')
    setColleges([])
  }, [selectedStateId])

  useEffect(() => {
    loadColleges(selectedDistrictId)
    setSelectedCollegeId('')
  }, [selectedDistrictId])

  useEffect(() => {
    syncSelection(selectedCollege)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCollege?.id])

  const handleStateChange = (event) => {
    setFeedback({ type: '', message: '' })
    setSelectedStateId(event.target.value)
  }

  const handleDistrictChange = (event) => {
    setFeedback({ type: '', message: '' })
    setSelectedDistrictId(event.target.value)
  }

  const handleCollegeChange = (event) => {
    const nextId = event.target.value
    setSelectedCollegeId(nextId)
    syncSelection(colleges.find((college) => college.id === nextId) || null)
  }

  const openAddCollegeModal = () => {
    setAddForm({
      name: '',
      stateName: selectedState?.name || '',
      districtName: selectedDistrict?.name || '',
      emailDomain: '',
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
    const stateName = addForm.stateName.trim()
    const districtName = addForm.districtName.trim()
    const emailDomain = addForm.emailDomain.trim()

    if (!name || !stateName || !districtName) {
      setFeedback({
        type: 'error',
        message: 'College name, state, and district are required.',
      })
      return
    }

    setIsSubmittingCollege(true)
    setFeedback({ type: '', message: '' })

    try {
      const response = await api.post('/api/colleges', {
        name,
        stateName,
        districtName,
        emailDomain: emailDomain || undefined,
      })

      const createdCollege = response.data?.college || null
      setFeedback({ type: 'success', message: 'College added successfully.' })
      closeAddCollegeModal()

      if (createdCollege?.id) {
        await loadStates()

        const nextState = states.find(
          (item) => item.name.toLowerCase() === stateName.toLowerCase(),
        )
        const nextDistrict = districts.find(
          (item) => item.name.toLowerCase() === districtName.toLowerCase(),
        )

        if (nextState?.id) {
          setSelectedStateId(nextState.id)
          await loadDistricts(nextState.id)
        }

        if (nextDistrict?.id) {
          setSelectedDistrictId(nextDistrict.id)
          await loadColleges(nextDistrict.id)
        }

        setSelectedCollegeId(createdCollege.id)
        syncSelection({
          ...createdCollege,
          stateId: createdCollege.stateId || nextState?.id || '',
          districtId: createdCollege.districtId || nextDistrict?.id || '',
        })
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

  const noCollegesFound =
    Boolean(selectedDistrictId) && !isLoadingColleges && colleges.length === 0

  return (
    <div className={`rounded-3xl border border-slate-200 bg-white shadow-xl ${className}`.trim()}>
      <div className="space-y-5 p-5 md:p-6">
        <div>
          <h3 className="text-xl font-black tracking-tight text-blue-950">{heading}</h3>
          <p className="mt-1 text-sm text-slate-600">{description}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text font-semibold text-slate-700">State</span>
            </div>
            <select
              className="select select-bordered w-full"
              disabled={isLoadingStates}
              onChange={handleStateChange}
              value={selectedStateId}
            >
              <option value="">{isLoadingStates ? 'Loading states...' : 'Select State'}</option>
              {states.map((state) => (
                <option key={state.id} value={state.id}>
                  {state.name}
                </option>
              ))}
            </select>
          </label>

          <label className="form-control w-full">
            <div className="label">
              <span className="label-text font-semibold text-slate-700">District</span>
            </div>
            <select
              className="select select-bordered w-full"
              disabled={!selectedStateId || isLoadingDistricts}
              onChange={handleDistrictChange}
              value={selectedDistrictId}
            >
              <option value="">
                {!selectedStateId
                  ? 'Select state first'
                  : isLoadingDistricts
                    ? 'Loading districts...'
                    : 'Select District'}
              </option>
              {districts.map((district) => (
                <option key={district.id} value={district.id}>
                  {district.name}
                </option>
              ))}
            </select>
          </label>

          <label className="form-control w-full">
            <div className="label">
              <span className="label-text font-semibold text-slate-700">College</span>
            </div>
            <select
              className="select select-bordered w-full"
              disabled={!selectedDistrictId || isLoadingColleges}
              onChange={handleCollegeChange}
              value={selectedCollegeId}
            >
              <option value="">
                {!selectedDistrictId
                  ? 'Select district first'
                  : isLoadingColleges
                    ? 'Loading colleges...'
                    : 'Select College'}
              </option>
              {colleges.map((college) => (
                <option key={college.id} value={college.id}>
                  {college.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-700">{selectedCollegeMessage}</p>
            <p className="text-xs text-slate-500">
              {selectedCollege
                ? `${selectedCollege.state || selectedState?.name || 'State'} / ${
                    selectedCollege.district || selectedDistrict?.name || 'District'
                  }`
                : 'Choose a location to continue.'}
            </p>
          </div>

          {allowCreateCollege && (
            <ActionButton
              className="bg-blue-900 text-white shadow-lg shadow-blue-900/15"
              disabled={!selectedStateId}
              onClick={openAddCollegeModal}
              type="button"
            >
              Add your college
            </ActionButton>
          )}
        </div>

        {noCollegesFound && (
          <p className="rounded-2xl border border-dashed border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            No colleges found for this district. Add yours to continue.
          </p>
        )}

        {feedback.message && (
          <div
            className={`rounded-2xl px-4 py-3 text-sm font-semibold ${
              feedback.type === 'success'
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {feedback.message}
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal modal-open" role="dialog">
          <div className="modal-box">
            <h3 className="text-xl font-black text-blue-950">Add your college</h3>
            <p className="mt-1 text-sm text-slate-600">
              Add a new college under your state and district.
            </p>

            <form className="mt-5 space-y-4" onSubmit={handleAddCollege}>
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text">College name</span>
                </div>
                <input
                  className="input input-bordered w-full"
                  onChange={(event) =>
                    setAddForm((current) => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                  placeholder="Enter college name"
                  type="text"
                  value={addForm.name}
                />
              </label>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="form-control w-full">
                  <div className="label">
                    <span className="label-text">State</span>
                  </div>
                  <input
                    className="input input-bordered w-full"
                    onChange={(event) =>
                      setAddForm((current) => ({
                        ...current,
                        stateName: event.target.value,
                      }))
                    }
                    placeholder="State name"
                    value={addForm.stateName}
                  />
                </label>

                <label className="form-control w-full">
                  <div className="label">
                    <span className="label-text">District</span>
                  </div>
                  <input
                    className="input input-bordered w-full"
                    onChange={(event) =>
                      setAddForm((current) => ({
                        ...current,
                        districtName: event.target.value,
                      }))
                    }
                    placeholder="District name"
                    value={addForm.districtName}
                  />
                </label>
              </div>

              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text">College email domain</span>
                </div>
                <input
                  className="input input-bordered w-full"
                  onChange={(event) =>
                    setAddForm((current) => ({
                      ...current,
                      emailDomain: event.target.value,
                    }))
                  }
                  placeholder="example.edu"
                  value={addForm.emailDomain}
                />
              </label>

              <div className="modal-action">
                <ActionButton className="border border-slate-300 bg-white text-slate-700" onClick={closeAddCollegeModal} type="button">
                  Cancel
                </ActionButton>
                <ActionButton
                  className="bg-blue-900 text-white"
                  disabled={isSubmittingCollege}
                  type="submit"
                >
                  {isSubmittingCollege ? 'Saving...' : 'Save College'}
                </ActionButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default CollegeSelector
