from typing import TypedDict, Optional
from langgraph.graph import StateGraph, START, END

from src.guardrails.pii_filter import scan_for_pii
from src.agents.extraction import run_extraction, CohortCriteria
from src.agents.ambiguity import run_ambiguity_check

class CopilotState(TypedDict):
    description: str
    existing_criteria: Optional[dict]
    
    suggested_criteria: Optional[CohortCriteria]
    ambiguous_fields: list[str]
    error: Optional[str]

def filter_node(state: CopilotState):
    """Entry node: PII filter."""
    try:
        scan_for_pii(state["description"])
    except Exception as e:
        return {"error": str(e)}
    return {}

def extraction_node(state: CopilotState):
    """Runs criteria extraction."""
    if state.get("error"):
        return state
        
    res = run_extraction(state["description"], state.get("existing_criteria"))
    return {"suggested_criteria": res}

def ambiguity_node(state: CopilotState):
    """Runs ambiguity check on extracted criteria."""
    if state.get("error"):
        return state
        
    crit = state["suggested_criteria"].model_dump()
    res = run_ambiguity_check(state["description"], crit)
    return {"ambiguous_fields": res.ambiguousFields}

def router_after_filter(state: CopilotState):
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
def human_review_gate(state: CopilotState):
    return state
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
