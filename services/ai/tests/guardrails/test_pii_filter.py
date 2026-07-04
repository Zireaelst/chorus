import pytest
from src.guardrails.pii_filter import scan_for_pii, PIIDetectedError

def test_clean_input():
    text = "We are looking for patients over 18 with type 2 diabetes."
    assert scan_for_pii(text) is None

def test_ssn_detected():
    text = "Patient SSN is 123-45-6789."
    with pytest.raises(PIIDetectedError, match="SSN detected"):
        scan_for_pii(text)

def test_dob_detected():
    text = "Their dob: 01/01/1980"
    with pytest.raises(PIIDetectedError, match="Date of Birth detected"):
        scan_for_pii(text)

def test_mrn_detected():
    text = "MRN: A1234567"
    with pytest.raises(PIIDetectedError, match="MRN detected"):
        scan_for_pii(text)

def test_email_detected():
    text = "Contact john.doe@example.com for info"
    with pytest.raises(PIIDetectedError, match="Email detected"):
        scan_for_pii(text)

def test_phone_detected():
    text = "Call 555-123-4567"
    with pytest.raises(PIIDetectedError, match="Phone number detected"):
        scan_for_pii(text)
