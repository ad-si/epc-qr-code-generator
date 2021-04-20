import QRCode from 'qrcode'
import { stripIndent } from 'common-tags'


function getQrCodeText(data = {}) {
  if (!data.name) throw new Error('Name of receiver must be set')

  if (!data.message) throw new Error('Message must be set')
  if (data.message.length > 140) throw new Error('Message must not be longer than 140 characters')

  if (!data.iban) throw new Error('IBAN must be set')
  if (data.iban.length !== 22) throw new Error('IBAN must be 22 characters long')

  if (data.amount <= 0) throw new Error('Amount must be a positive number')

  return stripIndent`
    BCD
    002
    1
    SCT
    ${// BIC needs to be set for some apps,
      // even though it is overwritten by the IBAN anyways.
      data.bic || 'AAAAAAAAAAA'
    }
    ${data.name}
    ${data.iban}
    EUR${data.amount}
    ${/* Unused field "purpose" */ ''}
    ${/* Unused field "reference" */ ''}
    ${data.message}
    ${/* Unused field "note to user" */ ''}
  `
}


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
