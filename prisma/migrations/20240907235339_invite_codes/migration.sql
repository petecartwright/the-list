-- CreateTable
CREATE TABLE "SignupAuthorizedEmails" (
    "email" TEXT NOT NULL PRIMARY KEY
);

-- CreateTable
CREATE TABLE "InviteCodes" (
    "code" TEXT NOT NULL PRIMARY KEY,
    "validAsOf" DATETIME NOT NULL,
    "validUntil" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "SignupAuthorizedEmails_email_key" ON "SignupAuthorizedEmails"("email");

-- CreateIndex
CREATE UNIQUE INDEX "InviteCodes_code_key" ON "InviteCodes"("code");
