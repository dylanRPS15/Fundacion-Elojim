/*
  Warnings:

  - You are about to alter the column `direccion` on the `registros_cultural` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `VarChar(70)`.
  - You are about to alter the column `direccion` on the `registros_economia_plateada` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `VarChar(70)`.
  - You are about to alter the column `direccion` on the `registros_refuerzo_escolar` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `VarChar(70)`.
  - You are about to alter the column `direccion` on the `registros_seguridad_alimentaria` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `VarChar(70)`.
  - You are about to alter the column `direccion` on the `registros_software_factory` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `VarChar(70)`.
  - You are about to alter the column `direccion` on the `registros_taller_steam` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `VarChar(70)`.
  - You are about to alter the column `direccion` on the `registros_voluntariado` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `VarChar(70)`.

*/
-- AlterTable
ALTER TABLE "registros_cultural" ALTER COLUMN "direccion" SET DATA TYPE VARCHAR(70);

-- AlterTable
ALTER TABLE "registros_economia_plateada" ALTER COLUMN "direccion" SET DATA TYPE VARCHAR(70);

-- AlterTable
ALTER TABLE "registros_mujer_vulnerable" ALTER COLUMN "direccion" SET DATA TYPE VARCHAR(70);

-- AlterTable
ALTER TABLE "registros_refuerzo_escolar" ALTER COLUMN "direccion" SET DATA TYPE VARCHAR(70);

-- AlterTable
ALTER TABLE "registros_seguridad_alimentaria" ALTER COLUMN "direccion" SET DATA TYPE VARCHAR(70);

-- AlterTable
ALTER TABLE "registros_semillero_innovacion" ALTER COLUMN "direccion" SET DATA TYPE VARCHAR(70);

-- AlterTable
ALTER TABLE "registros_software_factory" ALTER COLUMN "direccion" SET DATA TYPE VARCHAR(70);

-- AlterTable
ALTER TABLE "registros_taller_steam" ALTER COLUMN "direccion" SET DATA TYPE VARCHAR(70);

-- AlterTable
ALTER TABLE "registros_voluntariado" ALTER COLUMN "direccion" SET DATA TYPE VARCHAR(70);
