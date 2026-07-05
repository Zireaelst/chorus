from typing import Any, cast
from typing import TypedDict

from langgraph.graph import END, START, StateGraph

from src.agents.ambiguity import run_ambiguity_check
from src.agents.extraction import CohortCriteria, run_extraction
from src.guardrails.pii_filter import scan_for_pii


class CopilotState(TypedDict, total=False):
    description: str
    existing_criteria: dict[str, Any] | None
    suggested_criteria: CohortCriteria | None
    ambiguous_fields: list[str]
    error: str | None

def filter_node(state: CopilotState) -> dict[str, Any]:
    """Entry node: PII filter."""
    try:
        scan_for_pii(state["description"])
    except Exception as e:
        return {"error": str(e)}
    return cast(dict[str, Any], {})

def extraction_node(state: CopilotState) -> dict[str, Any]:
    """Runs criteria extraction."""
    if state.get("error"):
        return cast(dict[str, Any], state)

    res = run_extraction(state["description"], state.get("existing_criteria"))
    return cast(dict[str, Any], {"suggested_criteria": res})

def ambiguity_node(state: CopilotState) -> dict[str, Any]:
    """Runs ambiguity check on extracted criteria."""
    if state.get("error"):
        return cast(dict[str, Any], state)

    crit_obj = state.get("suggested_criteria")
    crit = crit_obj.model_dump() if crit_obj else {}
    res = run_ambiguity_check(state["description"], crit)
    return cast(dict[str, Any], {"ambiguous_fields": res.ambiguousFields})

def router_after_filter(state: CopilotState) -> str:
    if state.get("error"):
        return "human_review"
    return "extract"

# Define the graph
builder = StateGraph(CopilotState)

# Add nodes
builder.add_node("filter", filter_node)
builder.add_node("extract", extraction_node)
builder.add_node("ambiguity", ambiguity_node)

# We use a dummy node for human_review to represent the gate,
# which simply ends the graph for the API to return the payload.
def human_review_gate(state: CopilotState) -> dict[str, Any]:
    return cast(dict[str, Any], state)
builder.add_node("human_review", human_review_gate)

# Build edges
builder.add_edge(START, "filter")
builder.add_conditional_edges("filter", router_after_filter, {
    "human_review": "human_review",
    "extract": "extract"
})
builder.add_edge("extract", "ambiguity")
builder.add_edge("ambiguity", "human_review")
builder.add_edge("human_review", END)

# Compile graph
graph = builder.compile()
