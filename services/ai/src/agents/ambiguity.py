import json
from typing import Any
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI
from pydantic import BaseModel

from src.agents.extraction import load_prompt


class AmbiguityResponse(BaseModel):
    ambiguousFields: list[str]

def run_ambiguity_check(description: str, criteria: dict[str, Any]) -> AmbiguityResponse:
    llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.1)

    prompt_text = load_prompt("ambiguity.txt")
    prompt = ChatPromptTemplate.from_messages([
        ("system", prompt_text),
        ("human", "Description: {description}\nDraft Criteria: {criteria}")
    ])

    structured_llm = llm.with_structured_output(AmbiguityResponse)
    chain = prompt | structured_llm

    from typing import cast
    return cast(AmbiguityResponse, chain.invoke({
        "criteria": json.dumps(criteria, indent=2)
    }))

    
