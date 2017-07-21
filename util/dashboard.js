const generateConfigForDashboard = () => ({
  apiKey: process.env.firebase_config_apikey,
  authDomain: process.env.firebase_config_authdomain,
  databaseURL: process.env.firebase_config_databaseurl,
  projectId: process.env.firebase_config_projectid,
  storageBucket: process.env.firebase_config_storagebucket,
  messagingSenderId: process.env.firebase_config_messagingsenderid,
})

export default generateConfigForDashboard
