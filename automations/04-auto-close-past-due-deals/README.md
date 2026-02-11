# Service Pipeline — Auto Stage Progression by Dates (Live and End)

## Goal
Automatically move service records to the correct pipeline stage when key milestone dates are reached (e.g., move to “Campaign Live” on the live date, and to “Campaign End” on the end date).

## What it does
This workflow enrolls records when they reach a “ready” pipeline stage (e.g., finalised/approved), then:
1) checks the required date property is known,
2) waits until that date/time,
3) updates the pipeline stage automatically,
4) ends safely if the date is missing or invalid.

## Why it matters
Date-driven stage updates reduce manual admin, improve pipeline accuracy, and ensure reporting reflects reality. Teams can reliably see what is upcoming, live, or completed without needing manual stage changes.

## Tools
- HubSpot Workflows (Service object or equivalent)

## Trigger (high-level)
- Enroll when: Pipeline Stage changes to a defined “ready” stage
- Gate: Required date property is known (e.g., Campaign Live Date)
- Delay: Until the date/time (e.g., 9:00 AM portal time zone)
- Action: Set Pipeline Stage to the next stage (e.g., Campaign Live)

## Outputs
- Pipeline stage updated automatically at the scheduled date/time

## Full documentation
See: `Campaign-Live-Date-Stage-Automation-Workflow Guide.pdf`

