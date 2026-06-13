import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosClient from './utils/axiosClient';

export const registerUser = createAsyncThunk(
    'auth/register',
    async (useRouteLoaderData, { rejectWithValue }) => {
        try {
            const response = await axiosClient.post('/user/register', userData);
            return response.data.user;
        }
        catch(error) {
            return rejectWithValue(error);
        }
    }
);


const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder
        // Register User Cases
        .addCase(registerUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(registerUser.fulfilled, (state) => {
            state.loading = false;
            state.isAuthenticated = !!action.payload;
            state.user = action.payload;
        })
        .addCase(registerUser.rejected, (state) => {
            state.loading = false;
            state.error = action.payload?.message || 'Something went wrong';
        })
    }
})