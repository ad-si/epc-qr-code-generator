import QRCode from 'qrcode'
import { stripIndent } from 'common-tags'
import { getQrCodeText } from '../common.js'


function displayQrCode() {
  const qrCodeText = getQrCodeText({
    name: data.name || data.firstname + ' ' + data.lastname,
    bic: data.bic,
    iban: data.iban.replace(/\s/g, ''),
    amount: data.amount,
    message: data.message,
  })

  console.log(request.headers)

  if (request.headers.accept.includes('image/png')) {
    response.setHeader('Content-Type', 'image/png')

    qrcode.toFileStream(
      response,
      qrCodeText,
      {
        errorCorrectionLevel: 'M',
        // version: 13, // Maximum allowed version (should be less normally)
      }
    )
  }
  else {
    response.end(qrCodeText)
    return
  }
}


document.addEventListener('submit', event => {
  event.preventDefault()
  event.stopPropagation()

  const formData = new FormData(event.srcElement)

  const qrCodeText = getQrCodeText({
    name: formData.get('name') ||
      formData.get('firstname') + ' ' + formData.get('lastname'),
    bic: formData.get('bic'),
    iban: formData.get('iban').replace(/\s/g, ''),
    amount: formData.get('amount'),
    message: formData.get('message'),
  })

  const canvas = document.getElementById('canvas')

  QRCode.toCanvas(
    canvas,
    qrCodeText,
    (error) => {
      if (error) console.error(error)
      else console.info('Success')
    },
  )
})
