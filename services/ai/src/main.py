from typing import Any, cast

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from src.agents.compliance import ComplianceCheckResponse, run_compliance_check
from src.graph import CopilotState, graph

app = FastAPI(title="Chorus AI Copilot")

class CopilotDraftRequest(BaseModel):
    description: str
    existingCriteria: dict[str, Any] | None = None

class CopilotDraftResponse(BaseModel):
    suggestedCriteria: dict[str, Any] | None = None
    ambiguousFields: list[str]
    requiresReview: bool = True

class ComplianceCheckRequest(BaseModel):
    criteria: dict[str, Any]
    jurisdiction: str

@app.post("/v1/copilot/cohort-draft", response_model=CopilotDraftResponse)
def cohort_draft(req: CopilotDraftRequest) -> CopilotDraftResponse:
    # Run the graph
    initial_state: CopilotState = {
        "description": req.description,
        "existing_criteria": req.existingCriteria,
    }

    final_state = cast(dict[str, Any], graph.invoke(initial_state))

    if final_state.get("error"):
        if "PII detected" in final_state["error"] or "detected" in final_state["error"]:
            raise HTTPException(status_code=422, detail="PII_DETECTED")
        raise HTTPException(status_code=400, detail=final_state["error"])

    crit = final_state.get("suggested_criteria")
    return CopilotDraftResponse(
        suggestedCriteria=crit.model_dump() if crit else None,
        ambiguousFields=final_state.get("ambiguous_fields", []),
        requiresReview=True
    )

@app.post("/v1/copilot/compliance-check", response_model=ComplianceCheckResponse)
def compliance_check(req: ComplianceCheckRequest) -> ComplianceCheckResponse:
    # Run the compliance agent directly
    try:
        res = run_compliance_check(req.criteria, req.jurisdiction)
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
