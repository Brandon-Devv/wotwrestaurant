-- CreateTable
CREATE TABLE "Preferencia" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "ingredienteId" TEXT NOT NULL,

    CONSTRAINT "Preferencia_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Preferencia" ADD CONSTRAINT "Preferencia_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Preferencia" ADD CONSTRAINT "Preferencia_ingredienteId_fkey" FOREIGN KEY ("ingredienteId") REFERENCES "Ingredient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
