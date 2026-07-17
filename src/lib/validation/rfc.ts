// RFC structure:
// Personas físicas  (13 chars): [A-ZÑ&]{4} + \d{6} + [A-Z\d]{3}
// Personas morales  (12 chars): [A-ZÑ&]{3} + \d{6} + [A-Z\d]{3}
// Ñ and & are valid in the name portion; homoclave is alphanumeric.
const RFC_REGEX = /^[A-ZÑ&]{3,4}\d{6}[A-Z\d]{3}$/i

export function isValidRfc(value: string): boolean {
  return RFC_REGEX.test(value.trim())
}
