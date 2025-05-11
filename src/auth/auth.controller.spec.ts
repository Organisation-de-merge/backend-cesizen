import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';
import { IsMatchFields } from 'src/common/decorators/isMatchFields.decorator';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            validateUser: jest.fn(),
            login: jest.fn(),
            register: jest.fn(),
            forgotPassword: jest.fn(),
            resetPassword: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call validateUser and login on login()', async () => {
    const loginDto = { email: 'test@example.com', password: '123456' };
    const mockUser = { 
      id: 1, 
      email: loginDto.email, 
      password: 'hashed', 
      name: 'Test User',
      roleId: 1,
      isActive: true,
      createdAt: null,
      updatedAt: null,
      deletedAt: null,
      resetToken: null,
      resetTokenExpiry: null,
      role: {
        id: 1,
        label: 'User',
        level: 1,
        createdAt: null,
        updatedAt: null,
        deletedAt: null
      } 
    };
    const mockToken = { 
      access_token: 'jwt',
      user: {
        id: mockUser.id,
        email: mockUser.email,
        name: 'Test User',
        role: {
          id: 1,
          label: 'User',
          level: 1
        }
      }
    };

    jest.spyOn(authService, 'validateUser').mockResolvedValue(mockUser);
    jest.spyOn(authService, 'login').mockResolvedValue(mockToken);

    const result = await controller.login(loginDto);
    expect(result).toEqual(mockToken);
  });

  it('should call register on register()', async () => {
    const registerDto = {
      email: 'test@example.com',
      password: 'password',
      confirmPassword: 'password',
      name: 'Test User',
    };
    const mockResponse = { 
      access_token: 'jwt',
      user: {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        role: {
          id: 2,
          label: 'User',
          level: 1
        }
      }
    };
    jest.spyOn(authService, 'register').mockResolvedValue(mockResponse);

    const result = await controller.register(registerDto);
    expect(result).toEqual(mockResponse);
  });

  it('should call forgotPassword()', async () => {
    const dto = { email: 'test@example.com' };
    const message = { message: 'Code envoyé' };
    jest.spyOn(authService, 'forgotPassword').mockResolvedValue(message);

    const result = await controller.forgotPassword(dto);
    expect(result).toEqual(message);
  });

  it('should call resetPassword()', async () => {
    const dto = { code: '123456', newPassword: 'newpass' };
    const message = { message: 'Mot de passe réinitialisé' };
    jest.spyOn(authService, 'resetPassword').mockResolvedValue(message);

    const result = await controller.resetPassword(dto);
    expect(result).toEqual(message);
  });
});
