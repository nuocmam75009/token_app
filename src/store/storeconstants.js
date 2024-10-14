/*
    This file stores the getter and setter constants
*/


export const SET_AUTHENTICATION = '[mutations] set authentication';
export const IS_USER_AUTHENTICATED = '[getters] is user authenticated';
export const SET_USERNAME = '[mutations] set username';
export const GET_USERNAME = '[getters] get username';

const state = {
    isAuthenticated: false,
    username: '',
}

const mutations = {
    [SET_AUTHENTICATION](state, value) {
        state.isAuthenticated = value;
    },
    [SET_USERNAME](state, value) {
        state.username = value;
    },
}

export default {
    state,
    mutations,
}