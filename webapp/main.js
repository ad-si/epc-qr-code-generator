import QRCode from 'qrcode'
import { getQrCodeText } from '../common.js'


const detailsForm = document.getElementById('transfer-details')

function setFormData(person) {
  Object.entries(person).forEach(([key, value]) => {
    if (detailsForm.elements[key]) {
      detailsForm.elements[key].value = value
    }
  })
}

const selectElement = document.getElementById('select-person')

selectElement
  .addEventListener('change', event => {
    const optionEl = event.target.options[event.target.selectedIndex]
    setFormData({ name: optionEl.dataset.name, iban: optionEl.dataset.iban })
  })


const formLoadEl = document.getElementById('load-data')
const selectPersonWrapper = document.getElementById('select-person-wrapper')


formLoadEl
  .addEventListener('submit', event => {
    event.preventDefault()
    event.stopPropagation()

    fetch('/api/persons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        password: formLoadEl?.password?.value,
      }),
    })
      .then(data => {
        if (data.status !== 200) {
          throw new Error(data.statusText)
        }
        return data.json()
      })
      .then(persons => {
        selectPersonWrapper.style.display = 'block'
        setFormData(persons[0])
        persons.forEach(person => {
          const optionEl = document.createElement('option')
          optionEl.dataset.name = person.name
          optionEl.dataset.iban = person.iban
          optionEl.text = person.name
          selectElement.appendChild(optionEl)
        })
      })
      .catch(error => {
        window.alert(error)
      })
  })



detailsForm
  .addEventListener('submit', event => {
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
