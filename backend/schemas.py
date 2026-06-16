from pydantic import BaseModel, Field

from .error_types import ErrorType, ERROR_LABELS


class AnalyzeRequest(BaseModel):
    text: str = Field(
        min_length=20,
        max_length=5000,
        description="Spanish text to analyze (20-5000 characters)",
    )


class ErrorItem(BaseModel):
    type: ErrorType = Field(description="Error category")
    original: str = Field(description="The exact fragment with the error")
    correction: str = Field(description="The corrected version")
    explanation: str = Field(description="Explanation in Spanish of why it's an error")


class Summary(BaseModel):
    total: int = Field(description="Total number of errors found")
    by_type: dict[str, int] = Field(description="Error count broken down by type")


class AnalyzeResponse(BaseModel):
    errors: list[ErrorItem] = Field(description="List of detected errors")
    corrected_text: str = Field(description="Full text with all corrections applied")
    summary: Summary = Field(description="Summary statistics of errors")


class ErrorTypeInfo(BaseModel):
    type: str
    label: str
    colors: dict[str, str]


class ErrorTypesResponse(BaseModel):
    types: list[ErrorTypeInfo]
