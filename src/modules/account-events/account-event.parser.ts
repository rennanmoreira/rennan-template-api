import { ResponseAccountEventDTO } from '@account-events/account-event.dto'
import { AccountEventWithRelations } from '@account-events/account-event.type'

export function parseAccountEvent(accountEvent: AccountEventWithRelations): ResponseAccountEventDTO {
  if (!accountEvent) return null

  return {
    ...accountEvent,
    id: accountEvent.id,

    created_at: accountEvent.created_at
  }
}

export function parseAccountEventList(accountEvents: {
  data: AccountEventWithRelations[]
  count: number
}): ResponseAccountEventDTO[] {
  return accountEvents.data.map(parseAccountEvent)
}
