import Api from './Api'

export default {
    logIn(params){
        return Api().post("auth/login", params)
    },
    signUp(params){
        return Api().post("auth/register", params)
    }
}
