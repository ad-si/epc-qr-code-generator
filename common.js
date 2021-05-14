import { stripIndent } from 'common-tags'

export function getQrCodeText(data = {}) {
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
