import { Appointment } from './_MODEL/appointment.entity'

describe('Appointment', () => {
  it('should be defined', () => {
    expect(new Appointment()).toBeDefined()
  })
})
