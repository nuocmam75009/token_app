/*
    This file contains the authentication and username state variables.
*/

import  {IS_USER_AUTHENTICATED, GET_USERNAME} from '../storeconstants';

export default {
    [IS_USER_AUTHENTICATED](state) {
        return state.isAuthenticated;
    },
    [GET_USERNAME](state) {
        return state.username;
    }
}