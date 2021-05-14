const QRCode = require('qrcode')
const { stripIndent } = require('common-tags')

const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const db = require('./db')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.static('dist'))

// app.get('/', (req, res) => {
// 	res.sendFile(path.join(__dirname + '/index.html'))
// })

app.listen(3000, () => console.log('server started'))

// const persons = JSON.parse(process.env['persons'])

// persons.forEach(person => {
  
// })


// function displayQrCode () {
//   const qrCodeText = getQrCodeText({
//     name: data.name || data.firstname + ' ' + data.lastname,
//     bic: data.bic,
//     iban: data.iban,
//     amount: data.amount,
//     message: data.message,
//   })

//   console.log(request.headers)

//   if (request.headers.accept.includes('image/png')) {
//     response.setHeader('Content-Type', 'image/png')

//     qrcode.toFileStream(
//       response,
//       qrCodeText,
//       {
//         errorCorrectionLevel: 'M',
//         // version: 13, // Maximum allowed version (should be less normally)
//       }
//     )
//   }
//   else {
//     response.end(qrCodeText)
//     return
//   }
// }