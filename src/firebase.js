import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
// import { ref, onUnmounted } from 'vue'

firebase.initializeApp({
    apiKey: process.env.VUE_API_KEY,
    authDomain: process.env.VUE_AUTH_DOMAIN,
    projectId: process.env.VUE_PROJECT_ID,
    storageBucket: process.env.VUE_STORAGE_BUCKET,
    messagingSenderId: process.env.VUE_MESSAGING_SENDER_ID,
    appId: process.env.VUE_APP_ID,
    measurementId: process.env.VUE_MEASUREMENT_ID
});
const db = firebase.firestore();
const usersCollection = db.collection('users');
export const createUser = user => {
    return usersCollection.add(user)
}

export const getUser = async id => {
    const user = await usersCollection.doc(id).get()
    return user.exists ? user.data() : null
}

export const updateUser = (id, user) => {
    return usersCollection.doc(id).update(user)
}

export const deleteUser = id => {
    return usersCollection.doc(id).delete()
}
// export const useLoadUsers = () => {
//     const users = ref([])
//     const close = usersCollection.onSnapshot(snapshot => {
//         users.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
//     })
//     onUnmounted(close)
//     return users
// }

export default firebase;