import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from './mail.service';
import * as nodemailer from 'nodemailer';

jest.mock('nodemailer');

const sendMailMock = jest.fn();

(nodemailer.createTransport as jest.Mock).mockReturnValue({
  sendMail: sendMailMock,
});

describe('MailService', () => {
  let service: MailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MailService],
    }).compile();

    service = module.get<MailService>(MailService);
    sendMailMock.mockClear();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should send a reset code email', async () => {
    const email = 'test@example.com';
    const code = '123456';

    await service.sendResetCode(email, code);

    expect(sendMailMock).toHaveBeenCalledWith(
      expect.objectContaining({
        from: expect.stringContaining('CesiZen'),
        to: email,
        subject: expect.stringContaining('code de réinitialisation'),
        html: expect.stringContaining(code),
      })
    );
  });
});
