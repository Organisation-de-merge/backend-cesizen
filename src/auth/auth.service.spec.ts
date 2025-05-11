import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: { user: jest.Mocked<any>; role?: jest.Mocked<any> };
  let mailService: Partial<Record<keyof MailService, jest.Mock>>;

  beforeEach(async () => {
    prisma = {
      user: {
        findUnique: jest.fn(),
        update: jest.fn(),
        create: jest.fn(),
        findFirst: jest.fn(),
      },
    } as any;

    mailService = {
      sendResetCode: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prisma },
        { provide: JwtService, useValue: { sign: jest.fn().mockReturnValue('token') } },
        { provide: MailService, useValue: mailService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should validate user with correct password', async () => {
    const mockUser = { email: 'test@example.com', password: await bcrypt.hash('pass', 10), role: {} };
    prisma.user.findUnique.mockResolvedValue(mockUser);

    const user = await service.validateUser('test@example.com', 'pass');
    expect(user).toEqual(mockUser);
  });

  it('should register new user and return token', async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    prisma.role.findFirst.mockResolvedValue({ id: 2, label: 'Utilisateur', level: 1 });
    prisma.user.create.mockResolvedValue({ id: 1, email: 'test@example.com', role: { id: 2, label: 'Utilisateur', level: 1 }, name: 'John' });

    const result = await service.register('test@example.com', 'password', 'John');
    expect(result).toHaveProperty('access_token');
  });

  it('should generate and store reset code on forgotPassword', async () => {
    prisma.user.findUnique.mockResolvedValue({ email: 'test@example.com' });
    prisma.user.update.mockResolvedValue({});

    const result = await service.forgotPassword('test@example.com');
    expect(result).toEqual({ message: 'Code de réinitialisation envoyé par email.' });
  });

  it('should reset password if code is valid', async () => {
    prisma.user.findFirst.mockResolvedValue({ id: 1 });
    prisma.user.update.mockResolvedValue({});

    const result = await service.resetPassword('123456', 'newpass');
    expect(result).toEqual({ message: 'Mot de passe réinitialisé avec succès.' });
  });
});
