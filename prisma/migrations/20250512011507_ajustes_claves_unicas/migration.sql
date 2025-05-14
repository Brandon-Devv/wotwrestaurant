/*
  Warnings:

  - A unique constraint covering the columns `[nombre]` on the table `Ingredient` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nombre]` on the table `Product` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Ingredient_nombre_key" ON "Ingredient"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Product_nombre_key" ON "Product"("nombre");
