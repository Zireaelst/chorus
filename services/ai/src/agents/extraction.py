import json
from pathlib import Path
from typing import Any

from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI
from pydantic import BaseModel, Field


class ClinicalCriterion(BaseModel):
    field: str
    operator: str
    value: str | int | float | list[str] | list[int]

class DemographicCriterion(BaseModel):
    field: str
    operator: str
    value: str | int | float | list[str] | list[int]

class CohortCriteria(BaseModel):
    schemaVersion: str = "1.0"
    clinical: list[ClinicalCriterion] = Field(default_factory=list)
    demographic: list[DemographicCriterion] = Field(default_factory=list)
    logicalOperator: str = "AND"

def load_prompt(filename: str) -> str:
    path = Path(__file__).parent.parent / "prompts" / filename
    with open(path, encoding="utf-8") as f:
        return f.read()

def run_extraction(description: str, existing_criteria: dict[str, Any] | None = None) -> CohortCriteria:
    # Low temperature for extraction as per AI_ARCHITECTURE.md
    llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.1)

    prompt_text = load_prompt("extraction.txt")
    prompt = ChatPromptTemplate.from_messages([
        ("system", prompt_text),
        ("human", "Description: {description}\nExisting criteria: {existing_criteria}")
    ])

    structured_llm = llm.with_structured_output(CohortCriteria)
    chain = prompt | structured_llm

    from typing import cast
    return cast(CohortCriteria, chain.invoke({
        "description": description,
        "existing_criteria": json.dumps(existing_criteria, indent=2) if existing_criteria else "None"
    }))

    existing_str = str(existing_criteria) if existing_criteria else "None"

    result = chain.invoke({"description": description, "existing_criteria": existing_str})
    if not isinstance(result, CohortCriteria):
        raise ValueError("Invalid output format")
    return result
