-- CreateTable
CREATE TABLE "payouts" (
    "id" UUID NOT NULL,
    "contribution_id" UUID NOT NULL,
    "org_id" UUID NOT NULL,
    "amount" DECIMAL NOT NULL,
    "currency" TEXT NOT NULL,
    "on_chain_tx_ref" TEXT NOT NULL,
    "settled_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payouts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "payouts_contribution_id_key" ON "payouts"("contribution_id");

-- AddForeignKey
ALTER TABLE "payouts" ADD CONSTRAINT "payouts_contribution_id_fkey" FOREIGN KEY ("contribution_id") REFERENCES "contributions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payouts" ADD CONSTRAINT "payouts_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
