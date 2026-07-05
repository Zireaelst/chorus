import re

# Very basic PII patterns for the pre-filter gate
# In a real system this would use Presidio or a dedicated NER model,
# but for Sprint 5 this proves the architectural boundary exists.

SSN_PATTERN = re.compile(r'\b\d{3}-\d{2}-\d{4}\b')
DOB_PATTERN = re.compile(r'\b(dob|date of birth)[\s:]*\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b', re.IGNORECASE)
MRN_PATTERN = re.compile(r'\bmrn[\s:]*[a-z0-9-]+\b', re.IGNORECASE)
EMAIL_PATTERN = re.compile(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b')
PHONE_PATTERN = re.compile(r'\b\d{3}[-.\s]??\d{3}[-.\s]??\d{4}\b')


class PIIDetectedError(ValueError):
    """Raised when PII is detected in the input, preventing model invocation."""
    pass


def scan_for_pii(text: str) -> None:
    """
    Scans the input text for common PII patterns.
    Raises PIIDetectedError if any are found.
    """
    if SSN_PATTERN.search(text):
        raise PIIDetectedError("SSN detected")

    if DOB_PATTERN.search(text):
        raise PIIDetectedError("Date of Birth detected")

    if MRN_PATTERN.search(text):
        raise PIIDetectedError("MRN detected")

    if EMAIL_PATTERN.search(text):
        raise PIIDetectedError("Email detected")

    if PHONE_PATTERN.search(text):
        raise PIIDetectedError("Phone number detected")

    # If clean, return None
    return None
