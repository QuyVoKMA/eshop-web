import { Auth } from '../constants/actionTypes.js'

const initialState = {
    user: null,
    loading: false,
    error: null
}

const authReducer = (state = initialState, action) =>{
    switch (action.type){
        case Auth.LOGIN_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            };
        case Auth.LOGIN_SUCCESS:
            return {
                ...state,
                user: action.payload,
                loading: false,
                error: null
            };
        case Auth.LOGIN_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        case Auth.LOGOUT:
            return {
                ...state,
                user: null,
                loading: false,
                error: null
            };
        default:
            return state
    }
}

export default authReducer;