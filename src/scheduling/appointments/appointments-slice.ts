import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import Appointment from 'model/Appointment'
import { AppThunk } from 'store'
import AppointmentRepository from 'clients/db/AppointmentsRepository'

interface AppointmentsState {
  isLoading: boolean
  appointments: Appointment[]
}

const initialState: AppointmentsState = {
  isLoading: false,
  appointments: [],
}

function startLoading(state: AppointmentsState) {
  state.isLoading = true
}

const appointmentsSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    createAppointmentStart: startLoading,
    fetchAppointmentsStart: startLoading,
    fetchAppointmentsSuccess: (state, { payload }: PayloadAction<Appointment[]>) => {
      state.isLoading = false
      state.appointments = payload
    },
  },
})

export const {
  createAppointmentStart,
  fetchAppointmentsStart,
  fetchAppointmentsSuccess,
} = appointmentsSlice.actions

export const fetchAppointments = (): AppThunk => async (dispatch) => {
  dispatch(fetchAppointmentsStart())
  const appointments = await AppointmentRepository.findAll()
  dispatch(fetchAppointmentsSuccess(appointments))
}

export const createAppointment = (appointment: Appointment, history: any): AppThunk => async (
  dispatch,
) => {
  dispatch(createAppointmentStart())
  await AppointmentRepository.save(appointment)
  history.push('/appointments')
}

export default appointmentsSlice.reducer
