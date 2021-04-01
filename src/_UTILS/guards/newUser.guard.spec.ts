import { NewUserGuard } from './newUser.guard'

describe('AuthsGuard', () => {
  it('should be defined', () => {
    expect(new NewUserGuard()).toBeDefined()
  })
})
