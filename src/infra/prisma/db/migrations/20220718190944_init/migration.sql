-- CreateTable
CREATE TABLE "usuarios" (
    "id" SERIAL NOT NULL,
    "nome" TEXT,
    "email" TEXT NOT NULL,
    "id_facebook" TEXT,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);
