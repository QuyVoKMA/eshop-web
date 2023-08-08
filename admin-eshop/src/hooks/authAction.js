import { Auth } from "../constants/actionTypes";

export const loginRequest = () =>({
    type: Auth.LOGIN_REQUEST
});

export const loginSuccess = (user) => ({
    type: Auth.LOGIN_SUCCESS,
    payload: user
});

export const loginFailure = (error) =>({
    type: Auth.LOGIN_FAILURE,
    payload: error
});

export const logout = () => ({
    type: Auth.LOGOUT
})