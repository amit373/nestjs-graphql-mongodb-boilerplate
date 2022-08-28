import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';
import { Schema } from 'mongoose';

import { bcryptService } from '@app/common';

export enum UserRole {
    user = 'user',
    admin = 'admin',
}

export type UserDocument = User & Document;

registerEnumType(UserRole, { name: 'role' });

@ObjectType()
export class User {
    @Field(() => String)
    name: string;

    @Field(() => String)
    email: string;

    @Field(() => String)
    password: string;

    @Field(() => Boolean, { defaultValue: false })
    isVerified: boolean;

    @Field(() => Boolean, { defaultValue: false })
    isActive: boolean;

    @Field(() => UserRole, { defaultValue: UserRole.user })
    role: UserRole;

    @Field(() => Date, { nullable: true })
    passwordChangedAt: Date;

    @Field(() => String, { nullable: true })
    resetPasswordToken: string;

    @Field(() => Date, { nullable: true })
    resetPasswordExpire: Date;

    @Field(() => Date)
    createdAt: Date;

    @Field(() => Date)
    updatedAt: Date;
}

export const userSchemaName = 'User';

export interface IUser extends Document {
    matchPassword: (enteredPassword: string) => Promise<boolean>;
    changedPasswordAfter: (JWTTimestamp: number) => Promise<boolean>;
    getResetPasswordToken: () => Promise<string>;
}

export const userSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is Required'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Email is Required'],
            unique: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: [true, 'Password is Required'],
            minlength: 6,
            select: false,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        isActive: {
            type: Boolean,
            default: false,
        },
        role: {
            type: String,
            enum: [UserRole.admin, UserRole.user],
            default: UserRole.user,
        },
        passwordChangedAt: Date,
        resetPasswordToken: String,
        resetPasswordExpire: Date,
    },
    { timestamps: true }
);

// Encrypt password using bcrypt
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcryptService.hashPassword(this.password);
    return next();
});

// Compare password using bcrypt
userSchema.methods.matchPassword = async function (enteredPassword) {
    const isMatch: boolean = await bcryptService.comparePassword(
        enteredPassword,
        this.password
    );
    return isMatch;
};

// Check password is changed or not.
userSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew) return next();
    this.passwordChangedAt = new Date(Date.now() - 1000);
    return next();
});

// If password changed throw error
userSchema.methods.changedPasswordAfter = function (JWTTimestamp: number) {
    if (this.passwordChangedAt) {
        const changedTimestamp: number =
            this.passwordChangedAt.getTime() / 1000;
        return JWTTimestamp < changedTimestamp;
    }
    // False means NOT changed
    return false;
};

// Generate and hash password token
userSchema.methods.getResetPasswordToken = function () {
    const { resetToken, resetPasswordExpire, resetPasswordToken } =
        bcryptService.getResetPasswordToken();

    this.resetPasswordToken = resetPasswordToken;
    this.resetPasswordExpire = resetPasswordExpire;
    return resetToken;
};
