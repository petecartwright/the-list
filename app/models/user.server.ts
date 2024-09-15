import type { Password, User } from "@prisma/client";
import bcrypt from "bcryptjs";

import { prisma } from "~/db.server";
import { generateInviteCode } from "~/utils";

export type { User } from "@prisma/client";

export const getUsersForAdminPage = async (skip?: number, take?: number) => {
  return prisma.user.findMany({
    skip,
    take,
    select: {
      id: true,
      email: true,
      humanName: true,
      createdAt: true,
      _count: { select: { places: true, items: true } },
    },
  });
};

export async function getUserById(id: User["id"]) {
  return prisma.user.findUnique({ where: { id } });
}

export async function getUserByEmail(email: User["email"]) {
  return prisma.user.findUnique({ where: { email } });
}

export async function createUser(email: User["email"], password: string) {
  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });
}

export async function deleteUserByEmail(email: User["email"]) {
  return prisma.user.delete({ where: { email } });
}

export async function verifyLogin(
  email: User["email"],
  password: Password["hash"],
) {
  const userWithPassword = await prisma.user.findUnique({
    where: { email },
    include: {
      password: true,
    },
  });

  if (!userWithPassword || !userWithPassword.password) {
    return null;
  }

  const isValid = await bcrypt.compare(
    password,
    userWithPassword.password.hash,
  );

  if (!isValid) {
    return null;
  }

  const { password: _password, ...userWithoutPassword } = userWithPassword;

  return userWithoutPassword;
}

export async function emailIsInAuthorizedList({
  email,
}: { email: string }): Promise<boolean> {
  const emailAuthorized = await prisma.signupAuthorizedEmails.findUnique({
    where: { email },
  });

  return !!emailAuthorized;
}

export async function isInviteCodeValid({
  inviteCode,
}: { inviteCode: string }): Promise<boolean> {
  const existingCode = await prisma.inviteCodes.findUnique({
    where: { code: inviteCode },
  });
  if (!existingCode) return false;

  const now = new Date();
  const codeExpirationDate = new Date(existingCode.validUntil);
  const codeIsValid = codeExpirationDate > now;

  return codeIsValid;
}

export const getInviteCodes = async (skip?: number, take?: number) => {
  const rawCodes = await prisma.inviteCodes.findMany({
    skip,
    take,
  });

  const codesWithValidity = rawCodes.map((code) => {
    const now = new Date();
    const codeExpirationDate = new Date(code.validUntil);
    return {
      ...code,
      isValid: codeExpirationDate > now,
    };
  });

  return codesWithValidity;
};

export async function createInviteCode() {
  let validInviteCode = "";

  while (!validInviteCode) {
    const proposedInviteCode = generateInviteCode();
    const existingCode = await prisma.inviteCodes.findFirst({
      where: { code: proposedInviteCode },
    });
    if (!existingCode) {
      validInviteCode = proposedInviteCode;
    }
  }

  const now = new Date().toISOString();
  // TODO: maybe this isn't hardcoded
  const DAYS_UNTIL_EXPIRATION = 30;
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + DAYS_UNTIL_EXPIRATION);

  await prisma.inviteCodes.create({
    data: {
      code: validInviteCode,
      validAsOf: now,
      validUntil: expirationDate,
    },
  });
  return validInviteCode;
}

export async function deleteInviteCode({ inviteCode }: { inviteCode: string }) {
  return await prisma.inviteCodes.delete({
    where: { code: inviteCode },
  });
}
