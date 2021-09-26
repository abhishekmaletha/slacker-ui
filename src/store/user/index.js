import firebase from '@/firebase';
const axios = require('axios');
const state = {
    userProfile: {},
    loggedIn: false,
    slackInt: false,
    webhookURL: '',
    tested: false,
    UID: ''
};

const getters = {
    userProfile: ({ userProfile }) => userProfile,
    loggedIn: ({ loggedIn }) => loggedIn,
    slackInt: ({ slackInt }) => slackInt,
    webhookURL: ({ webhookURL }) => webhookURL,
    tested: ({ tested }) => tested,
    UID: ({ UID }) => UID,

};

const mutations = {
    USER_DETAILS(state, userProfile) {
        state.loggedIn = true;
        state.userProfile = {
            name: userProfile.displayName,
            picture: userProfile.photoURL,
        };
        state.UID = userProfile.uid
    },
    LOGOUT(state) {
        state.loggedIn = false;
        state.userProfile = {};
    },
    WEBHOOK(state, webhook) {
        state.webhookURL = webhook;
    },
    SLACKSTATE(state) {
        state.slackInt = true;
    },
    TESTED(state) {
        state.tested = true;
    }
};

const actions = {
    async login(store) {

        if (store.state.loggedIn)
            return;

        const provider = new firebase.auth.GoogleAuthProvider();
        try {
            const data = await firebase.auth().signInWithPopup(provider);
            //console.log('data in login ', data.user.uid);
            axios.get(`http://localhost:3000/api/student/${data.user.uid}`).then(function (response) {
                // handle success
                console.log('put data ', response);
            })
                .catch(function (error) {
                    // handle error
                    console.log('new user ', error);
                    axios.post(`http://localhost:3000/api/student/${data.user.uid}`, {
                        'name': data.user.displayName,
                        'webhook': ''
                    }).then(function (response) {
                        console.log(response);
                    }).catch((error) => {
                        console.log('error adding new user', error);
                    })
                })
                .then(function () {
                    // always executed
                });

        } catch (error) {
            console.log(error);
        }
    },

    async logout() {
        try {
            await firebase.auth().signOut();
        } catch (error) {
            console.log(error);
        }
    },
    async send() {
        axios.post(`http://localhost:3000/api/mssg/${localStorage.getItem("uid")}`)
            .then(function (response) {
                console.log('mssg send successfully', response);
                return true;
            })
            .catch(function (error) {
                console.log(error);
            });
    },
    async test({ commit }, p) {
        console.log('tested ', p.name);
        commit('TESTED');
    },
    async slacker({ commit }, userData) {
        // console.log('inside slacker', userData)
        // console.log('UID in slacker', userData.uid);
        axios.put(`https://slacker-api-server.herokuapp.com/api/student/${userData.uid}`, {
            'webhook': userData.webhook
        }).then(function (response) {
            console.log(response);
            commit('WEBHOOK', 'webhook url');
            commit('SLACKSTATE');
        })
            .catch(function (error) {
                console.log(error);
            });
        // commit('user/SLACKSTATE');

    }
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
};