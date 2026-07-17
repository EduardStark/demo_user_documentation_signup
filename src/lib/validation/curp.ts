// Official CURP structure:
// [A-Z]{4}          — initials from name and surnames (may include X for no vowel)
// \d{6}             — date of birth YYMMDD
// [HM]              — sex
// (state code)      — 2-letter code for each Mexican state + NE (born abroad)
// [B-DF-HJ-NP-TV-Z]{3} — three internal consonants from the names
// [A-Z\d]           — alphanumeric differentiator (letter before 2000, digit from 2000)
// \d                — verification digit
const CURP_REGEX =
  /^[A-Z]{4}\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])[HM](AS|BC|BS|CC|CL|CM|CS|CH|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d]\d$/

export function isValidCurp(value: string): boolean {
  return CURP_REGEX.test(value.trim().toUpperCase())
}
