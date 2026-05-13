# User Interviews — CredexAudit

Three real conversations (about 10–15 minutes each).

---

## Interview 1

**Participant (name or label):** Rohan M.
**Role:** Freelance Full-Stack Developer
**Company stage / team size:** Solo / 1

### Key quotes

- "I'm paying for Cursor Pro and ChatGPT Plus at the same time. I honestly forgot ChatGPT was auto-renewing because I mostly just use the chat window inside Cursor now."
- "The $480 a year number hit me pretty hard. When it's just $20 a month here and there you don't really do the annual math."
- "What exactly is Credex? Is it like a coupon code site or do I have to buy credits in bulk?"

### Most surprising thing they said

He didn't realize that Cursor Pro includes premium Claude 3.5 Sonnet and GPT-4o requests built-in. He was paying an extra $20/mo to OpenAI for literally no reason.

### What it changed about my design

His confusion about what Credex actually was made me realize the CTA wasn't clear enough. This is why I added the sub-text below the CTA banner that explicitly says: *"Credex can help you buy the same AI plans through verified credit transfers — often 10–30% below retail."*

---

## Interview 2

**Participant (name or label):** Aryan S.
**Role:** Co-founder
**Company stage / team size:** Pre-seed Startup / 3

### Key quotes

- "We use ChatGPT Team because we wanted the higher message limits, but honestly my co-founder uses Claude for coding anyway."
- "I really like the 'Overpaying' warning. I didn't know ChatGPT Team required an annual commitment for the $25 price, we are paying $30/mo right now."
- "Can I send this result to my co-founder? I want him to see this so we can cancel one of these seats."

### Most surprising thing they said

He immediately wanted to show the audit result to someone else. He didn't want to explain the math, he just wanted to link them the page. 

### What it changed about my design

This interview is the entire reason I built the `Shareable URL` system using Supabase. Initially, the audit was just local to the browser. Aryan's feedback made me realize that auditing team spend is a multi-player decision, so I added the "Copy Link" feature with the `shareId`.

---

## Interview 3

**Participant (name or label):** Kavya T.
**Role:** CS Undergrad / Hackathon Teammate
**Company stage / team size:** Solo / 1

### Key quotes

- "I only use the free versions of things because I don't have a credit card attached. I'm using the free tier of Cursor right now."
- "If I have $0 in savings, the app kind of makes me feel like I did something wrong. It just says 0."
- "I would actually use a discount marketplace if it meant I could get a month of Claude for like $12 instead of $20."

### Most surprising thing they said

That a $0 savings result felt like a failure state to the user. Since she wasn't paying for anything, the audit just showed empty zeros.

### What it changed about my design

I went back and added the "Optimal Scenario" logic to the audit engine. Now, if the user has a highly optimized stack or $0 in wasteful spend, the engine returns an "optimal" tier, and the `CredexCta` component shows a "Soft" variant congratulating them on keeping their stack lean, rather than trying to aggressively push a $0 savings number.
