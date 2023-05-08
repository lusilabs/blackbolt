export type Trace = {
  event: string // 
  key: string //
  code: string //
  keyCode: number // deprecated implementation-dependent numerical code
  unixTimestamp: number,
  clientId: string // full url
  personId: string, // email
  resourceId: string,
  eventId: string,
  courseId: string
}