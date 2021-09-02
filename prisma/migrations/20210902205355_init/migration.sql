-- CreateTable
CREATE TABLE "Block" (
    "id" SERIAL NOT NULL,
    "hash" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Token" (
    "id" SERIAL NOT NULL,
    "hash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reserves" (
    "id" SERIAL NOT NULL,
    "blockNumber" INTEGER NOT NULL,
    "pairHash" TEXT NOT NULL,
    "reserve0" TEXT NOT NULL,
    "reserve1" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pair" (
    "id" SERIAL NOT NULL,
    "hash" TEXT NOT NULL,
    "factory" TEXT NOT NULL,
    "token0" TEXT NOT NULL,
    "token1" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" SERIAL NOT NULL,
    "hash" TEXT NOT NULL,
    "blockNumber" INTEGER NOT NULL,
    "index" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mint" (
    "id" SERIAL NOT NULL,
    "transactionHash" TEXT NOT NULL,
    "pairHash" TEXT NOT NULL,
    "index" INTEGER NOT NULL,
    "sender" TEXT NOT NULL,
    "amount0" TEXT NOT NULL,
    "amount1" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Burn" (
    "id" SERIAL NOT NULL,
    "transactionHash" TEXT NOT NULL,
    "pairHash" TEXT NOT NULL,
    "index" INTEGER NOT NULL,
    "sender" TEXT NOT NULL,
    "amount0" TEXT NOT NULL,
    "amount1" TEXT NOT NULL,
    "to" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sync" (
    "id" SERIAL NOT NULL,
    "transactionHash" TEXT NOT NULL,
    "pairHash" TEXT NOT NULL,
    "index" INTEGER NOT NULL,
    "reserve0" TEXT NOT NULL,
    "reserve1" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Swap" (
    "id" SERIAL NOT NULL,
    "transactionHash" TEXT NOT NULL,
    "pairHash" TEXT NOT NULL,
    "index" INTEGER NOT NULL,
    "sender" TEXT NOT NULL,
    "amount0In" TEXT NOT NULL,
    "amount1In" TEXT NOT NULL,
    "amount0Out" TEXT NOT NULL,
    "amount1Out" TEXT NOT NULL,
    "to" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Block.hash_unique" ON "Block"("hash");

-- CreateIndex
CREATE UNIQUE INDEX "Block.number_unique" ON "Block"("number");

-- CreateIndex
CREATE UNIQUE INDEX "Token.hash_unique" ON "Token"("hash");

-- CreateIndex
CREATE UNIQUE INDEX "Reserves.blockNumber_pairHash_unique" ON "Reserves"("blockNumber", "pairHash");

-- CreateIndex
CREATE UNIQUE INDEX "Pair.hash_unique" ON "Pair"("hash");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction.hash_unique" ON "Transaction"("hash");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction.hash_index_unique" ON "Transaction"("hash", "index");

-- CreateIndex
CREATE UNIQUE INDEX "Mint.transactionHash_index_unique" ON "Mint"("transactionHash", "index");

-- CreateIndex
CREATE UNIQUE INDEX "Burn.transactionHash_index_unique" ON "Burn"("transactionHash", "index");

-- CreateIndex
CREATE UNIQUE INDEX "Sync.transactionHash_index_unique" ON "Sync"("transactionHash", "index");

-- CreateIndex
CREATE UNIQUE INDEX "Swap.transactionHash_index_unique" ON "Swap"("transactionHash", "index");

-- AddForeignKey
ALTER TABLE "Reserves" ADD FOREIGN KEY ("blockNumber") REFERENCES "Block"("number") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reserves" ADD FOREIGN KEY ("pairHash") REFERENCES "Pair"("hash") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pair" ADD FOREIGN KEY ("token0") REFERENCES "Token"("hash") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pair" ADD FOREIGN KEY ("token1") REFERENCES "Token"("hash") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD FOREIGN KEY ("blockNumber") REFERENCES "Block"("number") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mint" ADD FOREIGN KEY ("transactionHash") REFERENCES "Transaction"("hash") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mint" ADD FOREIGN KEY ("pairHash") REFERENCES "Pair"("hash") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Burn" ADD FOREIGN KEY ("transactionHash") REFERENCES "Transaction"("hash") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Burn" ADD FOREIGN KEY ("pairHash") REFERENCES "Pair"("hash") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sync" ADD FOREIGN KEY ("transactionHash") REFERENCES "Transaction"("hash") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sync" ADD FOREIGN KEY ("pairHash") REFERENCES "Pair"("hash") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Swap" ADD FOREIGN KEY ("transactionHash") REFERENCES "Transaction"("hash") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Swap" ADD FOREIGN KEY ("pairHash") REFERENCES "Pair"("hash") ON DELETE CASCADE ON UPDATE CASCADE;
