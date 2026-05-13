# User Interviews — CredexAudit

Three real conversations (about 10–15 minutes each).

---

## Interview 1

**Participant:** Krishna  
**Role:** Full Stack & AI Developer  
**Company stage / team size:** Classmate / Solo  

### Key quotes
- “What exactly is this company doing? The concept of trading AI credits is super interesting.”
- “How are they actually transferring the credits under the hood? Like, how does the marketplace actually work?”

### Most surprising thing they said
Krishna is a full stack and AI developer, and honestly, what grabbed him was the business model. You could tell he wanted to dig into the mechanics. He barely glanced at his own audit savings — he was completely focused on how Credex is making all of this actually happen.

### What it changed about my design
Turns out, my original call-to-action (CTA) was a little too abrupt. Krishna’s curiosity showed me people need a bit more context up front. So, I rewrote the CTA banner to explain that transactions go through “verified credit transfers — often 10–30% below retail.” Now, users know what they’re clicking into right away.

---

## Interview 2

**Participant:** Piyush  
**Role:** Full Stack Developer  
**Company stage / team size:** Classmate / Solo  

### Key quotes
- “I am genuinely surprised by the level of detail required for this assignment. The economics and GTM docs are intense.”
- “I’ve *hamesha* (always) wanted to work on a project structured exactly like this, where you actually have to think about the business.”

### Most surprising thing they said
Piyush came at things from a different angle. The PDF export and shareable link features? He loved those. But here’s the real surprise — he spent way more time diving into the docs and architectural decisions than actually playing with the UI. The `ECONOMICS.md` file drew him in hard.

### What it changed about my design
His feedback made me rethink my priorities. For this type of assignment, solid documentation means more than just flashy UI. I went back and reworked `README.md` so reviewers hit the engineering trade-offs and all the other .md files right away, front and center.

---

## Interview 3

**Participant:** Akanksha  
**Role:** Software Engineer  
**Company stage / team size:** Expedia Group (3.5 yrs experience)  

### Key quotes
- “At a company like Expedia, we actually have a huge problem tracking SaaS spend across different pods and teams.”
- “If I used this at work, I couldn’t buy the credits myself. You need a way for me to send these results directly to my engineering manager or finance team.”

### Most surprising thing they said
The seat right-sizing and overpaying checks caught her eye — apparently, leaving unused seats on enterprise plans is an everyday headache. But then she flagged something big: the developer running the audit isn’t the one swiping the company card.

### What it changed about my design
That was a wake-up call. Because of her, I built the shareable URL feature (with Supabase) and added transactional email support (with Resend). Before, the app just showed local results. Now, you can generate a unique link or email the findings straight to a manager — so the whole approval chain stays smooth and the engineer doesn’t get stuck.
