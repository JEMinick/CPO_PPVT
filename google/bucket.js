require("dotenv").config()

const Cloud = require( '@google-cloud/storage' )
const path =  require( 'path' )
const serviceKey = path.join(__dirname,'./keys.json');

const { Storage } = Cloud

// projectId: 'storage'
const storage = new Storage({
  projectId: process.env.GCLOUD_PROJECT, 
  keyFilename: serviceKey
})

// projectid: process.env.GCLOUD_PROJECT, 
// const storage = new Storage({
//   projectId: 'storage', 
//   credentials: {
//     client_email: process.env.GCLOUD_CLIENT_EMAIL, 
//     private_key: process.env.GCLOUD_PRIVATE_KEY
//   } 
// });

// const bucketName = 'cpo-ppvt-bucket'

const bucket = storage.bucket(process.env.GCS_BUCKET)

module.exports = bucket
