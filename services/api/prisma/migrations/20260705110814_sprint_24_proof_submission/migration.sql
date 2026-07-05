-- CreateTable
CREATE TABLE "contributions" (
    "id" UUID NOT NULL,
    "cohort_id" UUID NOT NULL,
    "org_id" UUID NOT NULL,
    "round_number" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "on_chain_tx_ref" TEXT,
    "proof_ref_hash" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verified_at" TIMESTAMP(3),

    CONSTRAINT "contributions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "contributions_org_id_verified_at_idx" ON "contributions"("org_id", "verified_at");

-- CreateIndex
CREATE UNIQUE INDEX "unique_contribution_per_round" ON "contributions"("cohort_id", "org_id", "round_number");

-- AddForeignKey
ALTER TABLE "contributions" ADD CONSTRAINT "contributions_cohort_id_fkey" FOREIGN KEY ("cohort_id") REFERENCES "cohorts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contributions" ADD CONSTRAINT "contributions_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
