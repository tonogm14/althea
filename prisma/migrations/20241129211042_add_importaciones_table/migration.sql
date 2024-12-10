-- CreateTable
CREATE TABLE "Importaciones" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "shop" TEXT NOT NULL,
    "fechaImportacion" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "totalProductos" INTEGER NOT NULL,
    "productosActualizados" INTEGER NOT NULL,
    "productosConErrores" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "ImportacionesLog" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "importacionId" INTEGER NOT NULL,
    "productoId" TEXT NOT NULL,
    "resultado" TEXT NOT NULL,
    "mensajeError" TEXT,
    CONSTRAINT "ImportacionesLog_importacionId_fkey" FOREIGN KEY ("importacionId") REFERENCES "Importaciones" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
