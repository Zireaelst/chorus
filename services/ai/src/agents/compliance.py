from typing import Any
import json

from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI
from pydantic import BaseModel, Field

from src.agents.extraction import load_prompt
from src.rag.retrieve import get_retriever


class ComplianceFlag(BaseModel):
    severity: str = Field(description="Must be 'blocking' or 'advisory'")
    regulation: str
    citation: str
    explanation: str

class ComplianceCheckResponse(BaseModel):
    flags: list[ComplianceFlag]

def run_compliance_check(criteria: dict[str, Any], jurisdiction: str) -> ComplianceCheckResponse:
    # 1. Retrieve regulatory context
    # Convert criteria to string to query the index
    query_text = json.dumps(criteria)
    retriever = get_retriever()

    # Retrieve top 3 relevant chunks, scoping by jurisdiction
    chunks = retriever.retrieve(query_text, jurisdiction=jurisdiction, top_k=3)
    context_text = "\n\n---\n\n".join([f"Source: {c['metadata'].get('source', 'unknown') if isinstance(c['metadata'], dict) else 'unknown'}\n{c['text']}" for c in chunks])

    if not chunks:
        # If no context found, return no flags
        return ComplianceCheckResponse(flags=[])

    # 2. Run LLM check
    llm = ChatOpenAI(model="gpt-4o", temperature=0.1)
    prompt_text = load_prompt("compliance.txt")

    prompt = ChatPromptTemplate.from_messages([
        ("system", prompt_text),
        ("human", "Draft Criteria:\n{criteria}\n\nRetrieved Regulation Chunks:\n{context}")
    ])

    structured_llm = llm.with_structured_output(ComplianceCheckResponse)
    chain = prompt | structured_llm

    from typing import cast
    return cast(ComplianceCheckResponse, chain.invoke({
        "criteria": json.dumps(criteria, indent=2),
        "context": context_text
    }))

    
