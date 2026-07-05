# Sprint 33 — EHDS Regulatory Corpus for RAG Pipeline

## Objective

Add EHDS regulatory text to the `services/ai` RAG corpus alongside the existing HIPAA and GDPR subsets.

## Documentation to Read

1. `AI_ARCHITECTURE.md` L72 — "HIPAA text, relevant GDPR articles, the EHDS regulation."
2. `AI_ARCHITECTURE.md` L72 — Voyage AI embeddings, pgvector index, jurisdiction-scoped retrieval.
3. `PRODUCT_SPEC.md` — EHDS secondary-use provisions.
4. `docs/ai/antigravity-playbook.md`

## Scope

**In scope:**
- Curate EHDS regulation text relevant to secondary use of health data for AI training.
- Add `ehds_subset.txt` to `services/ai/src/rag/corpus/`.
- Re-embed the corpus to include EHDS chunks.
- Update the retrieval scoping to include EHDS as a jurisdiction option.
- Add EHDS-specific test cases to the golden set.

**Out of scope:**
- Multi-jurisdiction routing logic (v2.0).
- Full EHDS text — only the secondary-use provisions relevant to Chorus.

## Files

- `services/ai/src/rag/corpus/ehds_subset.txt` — [NEW]
- `services/ai/src/rag/embed.py` — update to include EHDS
- `services/ai/src/rag/retrieve.py` — add EHDS jurisdiction scope
- `services/ai/eval/golden_set.jsonl` — add EHDS test cases
- `services/ai/src/rag/starter_index.faiss` — regenerated
- `services/ai/src/rag/starter_metadata.json` — updated

## Acceptance Criteria

- [ ] `ehds_subset.txt` exists in the corpus directory.
- [ ] EHDS chunks are embedded and retrievable.
- [ ] Jurisdiction-scoped retrieval returns EHDS chunks for EU jurisdiction queries.
- [ ] Golden-set evaluation suite passes with EHDS test cases.
- [ ] Compliance Flagging Agent can surface EHDS-grounded flags.

## Definition of Done

- [ ] Corpus includes EHDS text.
- [ ] Golden-set evaluation passes.
- [ ] No patient data in the corpus.

## Stop Condition

Stop once the EHDS corpus is added, embedded, and tested via the golden set. do not begin the next numbered sprint in this same branch or session.
