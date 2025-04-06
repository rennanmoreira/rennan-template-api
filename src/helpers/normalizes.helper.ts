export function normalizePeople(data: any) {
  if (data.phone) {
    data.phone = data.phone.replace(/\D/g, '')
  }

  if (data.whatsapp) {
    data.whatsapp = data.whatsapp.replace(/\D/g, '')
  }

  if (data.phone) {
    data.phone = data.phone.replace(/\D/g, '')
  }

  if (data.cpf) {
    data.cpf = data.cpf.replace(/\D/g, '')
  }

  if (data.rg) {
    data.rg = data.rg.replace(/\D/g, '')
  }

  if (data.botmaker_contact_id) {
    data.botmaker_contact_id = data.botmaker_contact_id.replace(/\D/g, '')
  }

  if (data.people?.phone) {
    data.people.phone = data.people.phone.replace(/\D/g, '')
  }

  if (data.people?.whatsapp) {
    data.people.whatsapp = data.people.whatsapp.replace(/\D/g, '')
  }

  if (data.people?.botmaker_contact_id) {
    data.people.botmaker_contact_id = data.people.botmaker_contact_id.replace(/\D/g, '')
  }

  if (data.people?.cpf) {
    data.people.cpf = data.people.cpf.replace(/\D/g, '')
  }

  if (data.people?.rg) {
    data.people.rg = data.people.rg.replace(/\D/g, '')
  }

  if (data.people?.botmaker_contact_id) {
    data.people.botmaker_contact_id = data.people.botmaker_contact_id.replace(/\D/g, '')
  }

  return data
}
