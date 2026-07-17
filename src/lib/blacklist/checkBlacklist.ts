import blacklist from '@/data/sat-blacklist.json'

function normalize(s: string): string {
  return s.trim().toUpperCase().replace(/\s+/g, ' ')
}

export function isInSatBlacklist(name: string | null, rfc: string | null): boolean {
  if (!rfc) return false
  const r = normalize(rfc)
  return blacklist.some((entry) => normalize(entry.rfc) === r)
}
