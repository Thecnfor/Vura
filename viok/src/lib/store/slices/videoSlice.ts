import { createSlice } from '@reduxjs/toolkit'

interface VideoState {
  videos: string[]
  loading: boolean
}

const initialState: VideoState = {
  videos: [],
  loading: false,
}

export const videoSlice = createSlice({
  name: 'video',
  initialState,
  reducers: {
    setVideos: (state, action) => {
      state.videos = action.payload
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
  },
})

export const { setVideos, setLoading } = videoSlice.actions
export default videoSlice.reducer