export function capitalizeText(text) {
  if (!text) {
    return text
  }

  return text
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function removeSpecialCharacters(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9\s]/g, '')
}

export function splitUserName(name: string) {
  const allNames = name?.split(' ') || []

  return [allNames[0] || '', allNames.length > 1 ? allNames[allNames.length - 1] : '']
}
