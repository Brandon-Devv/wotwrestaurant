-- CreateEnum
CREATE TYPE "TipoComida" AS ENUM ('ALMUERZO', 'CENA', 'COMIDA_RAPIDA');

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "vegano" BOOLEAN NOT NULL,
    "tipo" "TipoComida" NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ingredient" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "aptoVegano" BOOLEAN NOT NULL,
    "origen" TEXT NOT NULL,
    "tipoAlimento" TEXT NOT NULL,
    "proveedor" TEXT NOT NULL,
    "lote" TEXT NOT NULL,
    "registro" TEXT NOT NULL,
    "fechaIngreso" TIMESTAMP(3) NOT NULL,
    "fechaCaducidad" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ingredient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductIngredient" (
    "id" TEXT NOT NULL,
    "productoId" TEXT NOT NULL,
    "ingredienteId" TEXT NOT NULL,

    CONSTRAINT "ProductIngredient_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProductIngredient" ADD CONSTRAINT "ProductIngredient_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductIngredient" ADD CONSTRAINT "ProductIngredient_ingredienteId_fkey" FOREIGN KEY ("ingredienteId") REFERENCES "Ingredient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
