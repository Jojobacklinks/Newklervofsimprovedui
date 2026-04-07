# Lead Management System - Developer Notes Documentation

This document contains all automation logic, business rules, and backend workflow requirements for the Lead Management System.

---

## Legend

📱 = SMS Automation  
📧 = Email Automation  
🔔 = In-App Notification  
🤖 = Auto-Action/Automation  
⚠️ = Critical Guardrail  
🔒 = Permission Required  
💰 = Payment Related  
📝 = Activity Timeline Logging  
📅 = Task/Calendar Item  
⚡ = Trigger Event  
🔄 = Status Change

---

## Table of Contents

1. [Call Made Button Logic](#1-call-made-button-logic)
2. [Convert to Job Button Visibility Logic](#2-convert-to-job-button-visibility-logic)
3. [Price Shared Status Logic](#3-price-shared-status-logic)
4. [Follow-Up Status Logic](#4-follow-up-status-logic)
5. [Won Status Logic (Payment-Based)](#5-won-status-logic-payment-based)
6. [Reopen Lead Logic](#6-reopen-lead-logic)

---

## 1. Call Made Button Logic

### Status Automation

⚡ **Trigger:** User clicks Call Made on a lead card

🤖 **Automation Action:** Move lead to Contacted

📝 **Display the call note in Activity Timeline with a timestamp**

### Guardrails

⚠️ Only auto-move if the current status is: **New**

⚠️ Don't auto-move if status is already: **Scheduled / Pricing Discussed / Won / Lost**

---

## 2. Convert to Job Button Visibility Logic

### Show "Convert to Job" only when:

• Lead is not Lost

• Lead has not already been converted to a job

### Hide "Convert to Job" when:

• Lead status = Lost

• Lead has already been converted to a job

• Lead status = Won (since payment has been received)

---

## 3. Price Shared Status Logic

### 1. Manual Status Change

**Contacted → Price Shared**

⚡ **Trigger:**
- Manual only

🤖 **Automation Action:**
- None

📝 **System actions:**
- ✓ Log activity: **Stage changed to Price Shared**
- ✓ Include timestamp + user

---

### 2. Auto Status Update (Job + Estimate)

⚡ **Trigger (both required):**
- Lead converts to a job
- Job has at least one estimate

🤖 **Automation Action:**
- If lead status is **New** or **Contacted** → set to **Price Shared**
- If lead status is **Price Shared, Follow-Up, Won, or Lost** → do nothing

📝 **System Actions:**
- ✓ Log activity: **Stage changed to Price Shared**
- ✓ Log activity: **Estimate recorded on the job**
- ✓ Store timestamps

---

### 3. Auto SMS Follow-Up (24 Business Hours) 📱

⚡ **Trigger (ALL conditions must be true):**
- Lead status = **Price Shared**
- Job has at least one estimate
- 24 business hours have passed since estimate was sent
- Estimate has not been approved
- Estimate has not been declined
- No internal activity since estimate was sent (no call logged, no manual SMS/email sent, no note added, no status change)
- Auto SMS has not already been sent for this estimate

🤖 **Automation Action:**
- 📱 Send one (1) SMS follow-up
- ⚠️ Do NOT change lead status

📱 **SMS Template (No-Reply Safe):**

> Hi {{FirstName}}, this is {{CompanyName}}. Just checking in regarding the service we discussed. If you'd like to move forward, please contact our office at {{CompanyPhone}}.

📝 **System Logging:**
- ✓ Log activity: **Auto follow-up SMS sent** with timestamp

---

### 4. Cancellation Rules (Before SMS Sends)

⚠️ **Cancel pending auto SMS if ANY occur:**
- Estimate is approved
- Estimate is declined
- Lead status changes out of Price Shared
- Any internal activity occurs

---

### 5. Guardrails

⚠️ Status only moves forward

⚠️ Auto status update runs once

⚠️ **Maximum one auto SMS per estimate**

⚠️ Do not auto-update if lead is already **Price Shared** or beyond

⚠️ Do not revert status if estimate is deleted later

⚠️ Manual status changes override automation

⚠️ **No links in SMS**

⚠️ **No pricing details in SMS**

---

## 4. Follow-Up Status Logic

### 1. Manual Status Change

**Price Shared → Follow-Up**

⚡ **Trigger:**
- Manual only (user explicitly changes status)

🤖 **Automation Action:**
- None (no auto stage movement)

📝 **System Actions:**
- ✓ Log activity in timeline: **Stage changed to Follow-Up** with timestamp

---

### 2. Auto Task Creation (On Enter Follow-Up) 📅

⚡ **Trigger:**
- Lead status changes to Follow-Up

🤖 **Automation Action:**
- 📅 Create internal task (on calendar – admin only):
  - *Follow up with {{CustomerName}}*
  - **Due:** Next business day (configurable)

📅 **Task Description (short):**
- *Follow up with {{CustomerName}} to get a decision.*

📝 **System Logging:**
- ✓ Log activity in timeline: **Follow-up task created** with timestamp

---

### 3. Inactivity Escalation (Notification Center Only) 🔔

⚡ **Trigger (ALL must be true):**
- Lead status = Follow-Up
- 3 business days have passed since entering Follow-Up
- No internal activity since entering Follow-Up (no call logged, no manual SMS/email sent, no note added, no status change)
- Lead is not Won or Lost
- Escalation notification has not already been sent for this Follow-Up cycle

🤖 **Automation Action:**
- 🔔 Create an in-app notification (notification center)

🔔 **Notification Center Content:**

**Title:** *Follow-up overdue [Number] (Deep link)*

📝 **System Logging:**
- ✓ Log activity: **Follow-up overdue notification sent** with timestamp

---

### 4. Cancellation Rules (Before Escalation Notification Sends)

⚠️ **Cancel the pending escalation notification if ANY occur before 3 business days:**
- Any internal activity is logged (call, manual message, note, status change)
- Lead status changes out of Follow-Up
- Lead becomes Won (payment received)
- Lead becomes Lost

---

### 5. Exit Rules (No Time-Based Status Changes)

💰 Deposit received **OR** full payment received → status moves to **Won**

• Estimate declined → status moves to **Lost**

• Estimate approved (without payment) → no automatic status change

• Any other stage movement is manual only

---

### 6. Guardrails

⚠️ Status only moves forward automatically when:
  - Estimate is declined
  - Deposit or full payment is received

⚠️ Manual status changes override automation

⚠️ Create only one follow-up task per Follow-Up cycle

⚠️ Create only one escalation notification per Follow-Up cycle

⚠️ Do not auto-send SMS or email from Follow-Up

⚠️ Do not auto-resend estimate from Follow-Up

⚠️ Do not auto-mark Lost based on time

⚠️ If lead becomes Won or Lost, cancel any pending escalation notifications

⚠️ If lead becomes Won or Lost, open follow-up tasks may be marked as **no longer required** (optional system behavior)

---

## 5. Won Status Logic (Payment-Based) 💰

### Auto Won Trigger

⚡ Lead status automatically moves to Won when:

💰 A deposit is recorded

**OR**

💰 A full payment is recorded with any payment type (Card, Cash, Other)

---

### System Actions (Auto Won)

🔄 Set lead status → **Won**

📝 Log activity in timeline:
  - *Lead marked Won (Payment received) by {admin or staff name} with Timestamp*

🤖 Cancel any pending Follow-Up reminders

---

### Manual Won (Still Allowed – With Restriction) 🔒

⚠️ User may manually set status to Won **ONLY IF:**

💰 No payment has been recorded in the system

**Required Behavior:**

• Show confirmation modal:
  - *"No payment is recorded. Mark this lead as Won?"*

• Require a note explaining the reason

---

### System Logging

📝 Log activity:
  - *Lead manually marked Won (No payment recorded) by {admin or staff name} Timestamp*

---

### Guardrails

⚠️ Estimate approval alone does **NOT** trigger Won

⚠️ Any valid recorded payment type can trigger Won

⚠️ Manual Won requires confirmation and note

⚠️ System does not auto-revert Won if payment is later edited or refunded

---

### Notification Center (Internal Only) 🔔

When lead moves to Won, create an in-app notification:

🔔 **Title:** *Won Lead [number of won leads] (deep link)*

**Guardrails for Notification:**

⚠️ Fire once per lead

⚠️ Do not send email

⚠️ Do not send SMS

• If payment was recorded by same user, notification still displays

---

## 6. Reopen Lead Logic 🔒

### When to Show Reopen Button

• Lead status = **Lost**

🔒 User role = **Admin** (only admins can reopen leads)

• Reopen button **replaces** the "Convert to Job" button

---

### Reopen Action Trigger

⚡ When "Reopen Lead" button is clicked:

1. Show note input field

2. 🔒 **Require** admin to enter a reason/note for reopening

3. ⚠️ Validate that note is not empty

4. Show "Developer Notes – Reopen Lead Logic" popup

---

### System Actions on Reopen

🔄 **Status Update:**
- Set lead status → **Follow-Up**
- Reset Days in Stage to **0**

🤖 **Automation Restart:**
- 📅 Create new follow-up task
- ⏱️ Reset inactivity timer for Follow-Up stage
- 🔄 Restart Follow-Up automation cycle

📝 **Activity Timeline Logging:**
- Log activity: **"Lead reopened - {reopen reason}"**
- Log activity: **"Follow-Up automation cycle restarted (new task + inactivity timer reset)"**
- Include timestamp and user name

---

### What Reopen Does NOT Do

⚠️ Does **NOT** automatically create a job

⚠️ Does **NOT** automatically send SMS or email

⚠️ Does **NOT** remove the original decline reason

⚠️ Does **NOT** delete any history (all activity timeline remains intact)

---

### Guardrails

⚠️ Lost lead can be reopened **multiple times**

⚠️ No time restrictions on reopening

🔒 Only **admin users** can reopen leads

⚠️ Reopen note is **required** (cannot be empty)

⚠️ All previous Lost reasons remain in activity timeline

⚠️ Reopen always moves to **Follow-Up** (not to original stage)

---

### Permission Check

🔒 Before allowing reopen:

• Verify user role = **Admin**

• If not admin, show error message:
  - *"Only administrators can reopen leads."*

---

## End of Documentation

**Document Version:** 1.0  
**Last Updated:** February 12, 2026  
**Purpose:** UI/UX Mockup Developer Documentation

---

## 🚨 Important Implementation Notes:

⏱️ **Time-based automations:**
- All timestamps should be stored in UTC and converted to local timezone for display
- Business days exclude weekends and company-defined holidays
- Time-based triggers should use scheduled jobs/cron tasks

📝 **Activity logging:**
- All activity logging should include user identification and timestamp
- Never delete activity history – maintain complete audit trail

🔔 **Notification center:**
- Refers to internal in-app notifications only (no email/SMS)
- Include deep links to relevant lead records

📱 **SMS guidelines:**
- No links allowed in automated SMS
- No pricing details in automated SMS
- Must be no-reply safe (include callback number)
- One SMS maximum per automation cycle

🔒 **Permission system:**
- Implement role-based access control (RBAC)
- Admin-only actions must be verified server-side
- Never trust client-side permission checks alone

💰 **Payment tracking:**
- Record all payment types (deposit, full, card, cash, other)
- Do not auto-revert status if payment is edited/refunded
- Payment triggers are one-time events

🤖 **Automation rules:**
- Manual actions always override automation
- Cancellation rules must be checked before executing scheduled actions
- Status only moves forward automatically (never backward)
- Each automation should run once per cycle/trigger

⚠️ **Error handling:**
- Log all failed automation attempts
- Implement retry logic for critical automations (SMS, notifications)
- Provide admin dashboard for monitoring automation health
