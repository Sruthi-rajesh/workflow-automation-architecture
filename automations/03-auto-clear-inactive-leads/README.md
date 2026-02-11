# Auto-clear Inactive Leads (Unassign Contact Owner)

## Goal
Automatically unassign inactive leads so they don’t remain stuck with one agent indefinitely and can be re-queued or redistributed for follow-up.

## What it does
This HubSpot contact workflow monitors engagement and identifies leads that have had no activity for a defined period (e.g., 21+ days or 3 weeks). When a contact becomes inactive and meets the eligibility rules, the workflow clears the **Contact owner** field and ends.

## Why it matters (real estate)
Real estate enquiries can go cold quickly. This automation reduces lead decay by ensuring inactive contacts don’t stay assigned forever. It helps teams:
- resurface stale enquiries for another attempt or a different agent
- improve fairness and workload distribution across agents
- reduce CRM clutter and improve reporting accuracy
- maintain response SLAs by keeping “active ownership” aligned with real engagement

## Tools
- HubSpot Workflows (Contact-based)

## Trigger
The workflow enrolls contacts when:
- **Last activity date** becomes **more than 21 days ago**, and
- (Recommended) the contact matches lead eligibility rules (e.g., Lead status is New / Attempted to Contact)

Re-enrollment should be enabled so the same contact can be re-processed if they become inactive again in the future.

## Output
- Contact owner is cleared (unassigned)

## Full documentation
See: `Auto-Clear-Inactive-Leads-Worfkow Guide.pdf`


