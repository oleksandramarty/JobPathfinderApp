import { StatusEnum, UserAuthMethodEnum, UserResponse, UserSettingResponse } from '@amarty/api';

export const mockUserResponse: UserResponse = new UserResponse({
  id: '123e4567-e89b-12d3-a456-426614174000',
  createdAt: new Date('2024-01-01T10:00:00Z'),
  updatedAt: new Date('2024-02-01T10:00:00Z'),
  login: 'john.doe',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '+1234567890',
  status: StatusEnum.Active,
  isTemporaryPassword: false,
  authType: UserAuthMethodEnum.Base,
  lastForgotPassword: new Date('2024-03-01T12:00:00Z'),
  lastForgotPasswordRequest: new Date('2024-03-01T11:00:00Z'),
  roles: [],
  languages: [],
  skills: [],
  profileItems: [],
  userSetting: {
    id: 'setting-id-123',
    defaultLocale: 'en',
    timeZone: -5,
    countryId: 1,
    currencyId: 1,
    applicationAiPrompt: true,
    userId: '123e4567-e89b-12d3-a456-426614174000',
    linkedInUrl: 'https://linkedin.com/in/johndoe',
    npmUrl: 'https://www.npmjs.com/~johndoe',
    gitHubUrl: 'https://github.com/johndoe',
    portfolioUrl: 'https://johndoe.dev',
    version: '1'
  } as UserSettingResponse,
  version: '1'
});
