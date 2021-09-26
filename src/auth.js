import firebase from './firebase';
import store from './store';

// https://firebase.google.com/docs/auth/web/manage-users
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        console.log('in auth.js ', user);
        localStorage.setItem("uid", user.uid);
        store.commit(`user/USER_DETAILS`, user);
    } else {
        store.commit(`user/LOGOUT`);
    }
});