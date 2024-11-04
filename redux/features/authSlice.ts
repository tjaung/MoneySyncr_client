import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
    isAuthenticated: boolean;
    isLoading: boolean;
    token: string | null;
}

const initialState: AuthState = {
    isAuthenticated: false,
    isLoading: true,
    token: null,
};

// store cookies for verification
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuth: (state, action: PayloadAction<string>) => {
            if (!state.token) { // Only set the token if it's not already set
                console.log('Setting token:', action.payload);
                state.isAuthenticated = true;
                state.token = action.payload;
            }
        },
        logout: state => {
            state.isAuthenticated = false;
            state.token = null; // Clear the token on logout
        },
        finishInitialLoad: state => {
            state.isLoading = false;
        }
    }
});

export const { setAuth, logout, finishInitialLoad } = authSlice.actions;
export default authSlice.reducer;
