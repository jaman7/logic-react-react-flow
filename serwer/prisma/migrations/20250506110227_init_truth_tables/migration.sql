-- CreateTable
CREATE TABLE "TruthTable" (
    "id" SERIAL NOT NULL,
    "displayName" TEXT NOT NULL,

    CONSTRAINT "TruthTable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TruthTableEntry" (
    "id" SERIAL NOT NULL,
    "input" TEXT NOT NULL,
    "output" TEXT NOT NULL,
    "tableId" INTEGER NOT NULL,

    CONSTRAINT "TruthTableEntry_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TruthTableEntry" ADD CONSTRAINT "TruthTableEntry_tableId_fkey" FOREIGN KEY ("tableId") REFERENCES "TruthTable"("id") ON DELETE CASCADE ON UPDATE CASCADE;
