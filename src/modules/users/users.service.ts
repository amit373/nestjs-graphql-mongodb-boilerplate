import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { bcryptService, EmailService, IContext, JwtService } from '@app/common';
import { generateOtp } from '@app/shared';
import {
  CreateAccountInput,
  CreateAccountOutput,
  ForgotPasswordInput,
  ForgotPasswordOutput,
  LoginInput,
  LoginOutput,
  ResetPasswordInput,
  ResetPasswordOutput,
  UserProfileOutput,
  VerifyEmailOutput,
} from './dto';
import { IUser, UserDocument, userSchemaName } from './schema';
import { COOKIE_NAME } from '@app/constants';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(userSchemaName)
    private readonly userModel: Model<UserDocument>,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async createAccount({
    name,
    email,
    password,
  }: CreateAccountInput): Promise<CreateAccountOutput> {
    try {
      const isExists: UserDocument = await this.userModel.findOne({ email });
      if (isExists) {
        return { ok: false, error: 'There is a user with that email already' };
      }

      const createdUser = await this.userModel.create({
        name,
        email,
        password,
      });

      if (this.configService.get<boolean>('app.isProduction')) {
        const { resetPasswordExpire, resetToken } =
          bcryptService.getResetPasswordToken(10, true);
        const isMailSent: boolean = await this.emailService.sendEmail(
          {
            to: createdUser.email,
          },
          {
            brand: 'NestJS',
            minutes: 10,
            opt: resetToken,
          },
        );
        if (isMailSent) {
          createdUser.resetPasswordToken = resetToken;
          createdUser.resetPasswordExpire = resetPasswordExpire;
          await createdUser.save();
          return { ok: true };
        }
        await this.userModel.findOneAndRemove({ _id: createdUser._id });
        return { ok: false, error: 'Something went wrong! Please try again!' };
      }
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err?.message || "Couldn't create account" };
    }
  }

  async login(
    { email, password }: LoginInput,
    { res }: IContext,
  ): Promise<LoginOutput> {
    try {
      const user: IUser = await this.userModel.findOne(
        { email, isVerified: false, isActive: false },
        ['_id', 'password'],
      );
      if (!user) {
        return {
          ok: false,
          error: 'User not found',
        };
      }
      const passwordCorrect: boolean = await user.matchPassword(password);
      if (!passwordCorrect) {
        return {
          ok: false,
          error: 'Please provide credentials',
        };
      }

      const token: string = this.jwtService.signToken(user['_id']);
      res.setHeader(COOKIE_NAME, token);
      res.cookie(COOKIE_NAME, token, {
        httpOnly: true,
        secure: this.configService.get<boolean>('app.isProduction'),
        maxAge: new Date().getTime(),
      });

      return {
        ok: true,
        token,
      };
    } catch (error) {
      return {
        ok: false,
        error: error?.message || "Can't log user in.",
      };
    }
  }

  async verifyEmail(code: string): Promise<VerifyEmailOutput> {
    try {
      const foundUser = await this.userModel.findOne({
        resetPasswordToken: code,
        resetPasswordExpire: { $gt: Date.now() },
      });
      if (foundUser) {
        foundUser.isVerified = true;
        foundUser.resetPasswordExpire = undefined;
        foundUser.resetPasswordToken = undefined;
        await foundUser.save();
        return { ok: true };
      }
      return { ok: false, error: 'Verification not found.' };
    } catch (error) {
      return { ok: false, error: 'Could not verify email.' };
    }
  }

  async findById(_id: string): Promise<UserProfileOutput> {
    try {
      const user = await this.userModel.findOne({
        _id,
      });
      if (!user) {
        return {
          ok: false,
          error: 'User not found',
        };
      }
      return {
        ok: true,
        user,
      };
    } catch (error) {
      return { ok: false, error: error?.message };
    }
  }

  async forgotPassword({
    email,
  }: ForgotPasswordInput): Promise<ForgotPasswordOutput> {
    try {
      const user = await this.userModel.findOne({ email });

      if (!user) {
        throw new NotFoundException('There is no user with that email');
      }

      // Get reset token
      if (this.configService.get<boolean>('app.isProduction')) {
        const { resetPasswordExpire, resetToken } =
          bcryptService.getResetPasswordToken(10, true);
        const isMailSent: boolean = await this.emailService.sendEmail(
          {
            to: user.email,
          },
          {
            brand: 'NestJS',
            minutes: 10,
            opt: resetToken,
          },
        );
        if (isMailSent) {
          user.resetPasswordToken = resetToken;
          user.resetPasswordExpire = resetPasswordExpire;
          await user.save();
          return { ok: true };
        }
        return { ok: false, error: 'Something went wrong! Please try again!' };
      }
    } catch (error) {
      return { ok: false, error: error?.message };
    }
  }

  async resetPassword({
    password,
    resetPasswordToken,
  }: ResetPasswordInput): Promise<ResetPasswordOutput> {
    try {
      const user = await this.userModel.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
      });

      if (!user) {
        throw new BadRequestException('Invalid token');
      }
      // Set new password
      user.password = password;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
      return {
        ok: true,
      };
    } catch (error) {
      return { ok: false, error: error?.message };
    }
  }

  logout() {
    return {
      ok: true,
    };
  }
}
