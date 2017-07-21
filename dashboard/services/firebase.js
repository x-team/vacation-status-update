import firebase from 'firebase'

const init = (config) => {
  const provider = new firebase.auth.GoogleAuthProvider()
  firebase.initializeApp(config)
  provider.setCustomParameters({
    'login_hint': 'X-Team'
  });
  firebase.auth()
  .signInWithPopup(provider)
  .then(result => console.log(result))
  .catch(error => console.log(error))
}

export default init
