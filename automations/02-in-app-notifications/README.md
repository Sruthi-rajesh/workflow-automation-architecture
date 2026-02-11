# Deal Stage → Notifications (In-App Notifications and Email)

## Goal
Notify the right internal owner when a deal moves stages, so follow-ups happen immediately and nothing gets missed.

## What it does
When a deal’s **Deal stage** changes, this workflow:
1) checks which stage the deal moved into, then
2) sends an in-app notification (and optionally an email) to the relevant internal user.

## Tools
- HubSpot Workflows (Deal-based)
- HubSpot In-App Notifications
- (Optional) HubSpot Email notifications or internal email step

## Trigger
**Deal stage** property value changes.

## Stage routing (high-level)
The workflow branches by stage (examples):
- Open Deal → notify owner
- Negotiating → notify owner
- Contract Sent → notify owner
- Contract Signed → notify owner
- Closed Lost → notify owner

## Outputs
- In-app notification sent to a specified internal user
- Optional email notification sent to the same user
- A consistent audit trail in workflow history

## Full documentation
See: `Deal-Stage-Notifications-Documentation.pdf`

