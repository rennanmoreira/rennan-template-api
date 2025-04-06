export const MILLISECONDS_PER_HOUR = 60 * 60 * 1000
export const MILLISECONDS_PER_DAY = 24 * MILLISECONDS_PER_HOUR

export const sum90Days = (fromTimestamp: number) => {
  return fromTimestamp + 90 * MILLISECONDS_PER_DAY
}

export const fromHoursToMilliseconds = (hours: number) => {
  return hours * 60 * 60 * 1000
}

export const isWithinNext90Days = (timestamp: number) => {
  const now = Date.now()
  const next90Days = sum90Days(now)

  return timestamp <= next90Days
}

export const getKalendMeNoPermissionMessage = (userEmail: string) => {
  return `O prescritor precisa conceder acesso ao Cuida em sua conta KalendMe para que possamos alterar a sua agenda. As demais informações não relacionadas à agenda foram atualizadas com sucesso, mas o prescritor foi alterado para NÃO LISTADO devido à falta de permissão do Cuida para manipular sua agenda. Instrua o prescritor a acessar seu e-mail (${userEmail}) e aceitar o convite do Cuida para que acessemos sua agenda KalendMe.`
}

export const getTomorrowDate = () => {
  const todayDate = new Date()
  todayDate.setHours(todayDate.getHours() + 24)
  const tomorrowDateStr = todayDate.toLocaleString('sv-SE', { timeZone: 'America/Sao_Paulo' }).split(' ')[0]

  return new Date(`${tomorrowDateStr} GMT-3`).getTime()
}
