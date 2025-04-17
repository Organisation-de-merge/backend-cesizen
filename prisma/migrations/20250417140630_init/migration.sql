-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "roleId" INTEGER NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- InsertRole
INSERT INTO "Role" ("id","label", "level", "createdAt", "updatedAt", "deletedAt")
VALUES  (1, 'Administrateur', 100, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
        (2, 'Utilisateur', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL);

-- InsertUser
INSERT INTO "User" ("email", "name", "password", "roleId", "status", "createdAt", "updatedAt", "deletedAt")
VALUES  ('admin@cesizen.fr', 'Administrateur CESIZEN', '$2b$04$f3IyvUS3CljWqHcHE6q2EeQ67k2JajGImbvPopBBCL6FPsAy8il0q', 1, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
        ('matthis.ternon@gmail.com', 'Administrateur Ternon', '$2b$04$9vuq/R9oH1UKPCfHSnvOq.LAxlyWXSTgYR.HuUX039ln/ZptX0BZK', 2, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;