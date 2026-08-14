import { HttpException, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class SendEmailService {
  constructor(
    private readonly mailerService: MailerService,
  ) { }

  public async sendEmail(data: any) {
    try {
      await this.mailerService.sendMail({
        from: `"${data.firstName} ${data.lastName}" <${data.email}>`,
        to: process.env.EMAIL_RECEIVER,
        subject: 'New Contact Form Message',
        text:
          `First Name: ${data.firstName}
                Last Name: ${data.lastName}
                Email: ${data.email}
                Phone: ${data.phone || 'No phone provided'}
                Message:${data.message}
        `,
        html: `
          <div style="font-family: Arial, sans-serif; padding:20px;">
            <h2>New Contact Form Submission</h2>

            <p>
              <strong>First Name:</strong>
              ${data.firstName}
            </p>

            <p>
              <strong>Last Name:</strong>
              ${data.lastName}
            </p>

            <p>
              <strong>Email:</strong>
              ${data.email}
            </p>

            <p>
              <strong>Phone:</strong>
              ${data.phone || 'No phone provided'}
            </p>

            <p>
              <strong>Message:</strong>
            </p>

            <div style="background:#f5f5f5;padding:15px;border-radius:8px;">
              ${data.message}
            </div>
          </div>
        `,
      });

      return {
        success: true,
        message: 'Email sent successfully',
      };
    } catch (error) {
      console.error(error);

      throw new HttpException(
        'Failed to send email',
        500,
      );
    }
  }
}