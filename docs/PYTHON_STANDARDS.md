# Chorus — Python Engineering Standards

> [!WARNING]  
> **Pending Human Confirmation**  
> This document is drafted but not yet confirmed. It formalizes conventions from Sprint 5 for `services/ai` but requires explicit team approval.

## Purpose
This document defines Python coding standards, specifically targeted at the `services/ai` service and any future Python-based backend components. Where this document is silent, the `pyproject.toml` linter configuration (`ruff` and `mypy`) acts as the ultimate arbiter.

## Language & Tooling Baseline
- **Python Version**: `>=3.12`
- **Package Management**: `uv`
- **Linting & Formatting**: `ruff` is used for both linting and formatting.
- **Type Checking**: Strict type checking is non-negotiable. `mypy` is configured with `strict = true`. Every function requires explicit type annotations, and `Any` returns are strictly barred. If a type cannot be known precisely, it must be narrowed appropriately.

## Formatting Standards
- **Line length**: 100 characters.
- **Quotes**: Double quotes for strings (`"`).
- **Indentation**: 4 spaces.
- **Imports**: Sorted by `isort` equivalent within Ruff, grouping standard libraries, third-party packages, and first-party imports (`chorus_ai`).

## Naming Conventions
| Element | Convention | Example |
|---|---|---|
| File names | `snake_case.py` | `ambiguity_resolver.py` |
| Functions & Methods | `snake_case` | `def retrieve_documents():` |
| Variables & Instances | `snake_case` | `cohort_criteria = {}` |
| Classes | `PascalCase` | `class ComplianceAgent:` |
| Constants | `SCREAMING_SNAKE_CASE` | `MAX_RETRIES = 3` |

## LangGraph & AI Conventions
As documented in `AI_ARCHITECTURE.md`, `services/ai` relies on LangGraph for deterministic, graph-based agent routing. The conventions follow these strict structural rules:

- **State Schemas**: State passed between LangGraph nodes must be strictly typed using `TypedDict` or `Pydantic` models.
- **Node Naming**: Agent nodes should be explicitly named for their role and function (e.g., `extraction_node`, `compliance_node`), operating deterministically on the defined state.
- **Structured Prompts**: Prompts are treated as code. They must be explicitly separated from application logic, injecting schemas per-request.
- **Tooling Constraints**: Agents must not hold state outside of the current request boundary. All LLM inferences must resolve to structured output and undergo hard schema validation.
