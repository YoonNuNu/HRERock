import {createSlice, creatAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    user: null,
    token: null,
    status: 'idle',
    error: null,
};

const api = axios.create({
    baseURL: 'http://localhost:8080',
    headers:{ 'Content-Type': 'applicatio/json'},
});


// 비동기 로그인
export const login = creatAsyncThunk('auth/login', async(userCredentials) => {

    // 로그인 axios
    const response = await api.post('/auth/login', {
        memId: userCredentials.username,
        memPassword: userCredentials.password
    });

    return response.data;

});

// redux slice 생성
const loginSlice = createSlice({

    name: 'login',
    initialState,
    reducers: {
        // logout 기능
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.status = 'idle' //상태를 초기 상태로 리셋
            localStorage.removeItem('token');

        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.status = 'loading';

            })
            .addCase(login.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload.user;
                state.token = action.payload.token;
                localStorage.setItem('token', action.payload.token);
            })
            .addCase(login.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
            
    }   

});

export const {logout} = loginSlice.actions;
export default loginSlice.reducer;




    
    
