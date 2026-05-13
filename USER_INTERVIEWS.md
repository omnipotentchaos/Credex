# User Interviews — CredexAudit

Three real conversations (about 10–15 minutes each) discussing the product, the assignment, and the underlying business model.

---

## Interview 1

**Participant:** Krishna  
**Role:** Full Stack & AI Developer  
**Company stage / team size:** Classmate / Solo  

### Key quotes

- "What exactly is this company doing? The concept of trading AI credits is super interesting."
- "How are they actually transferring the credits under the hood? Like, how does the marketplace actually work?"
- "This assignment is incredibly real-world oriented. It's cool that they want a real-world developer who actually understands product, not just someone who writes code."

### Most surprising thing they said

He was actually far more interested in Credex's underlying business model and how the credit transfers practically work than he was in his own audit savings number.

### What it changed about my design

Because of his deep curiosity about *how* Credex actually fulfills the promise, I realized the initial "Start buying credits" CTA was too abrupt. I added more explanatory copy to the CTA banner to clearly define that it works through "verified credit transfers — often 10–30% below retail" so users aren't confused about what they are clicking.

---

## Interview 2

**Participant:** Piyush  
**Role:** Full Stack Developer  
**Company stage / team size:** Classmate / Solo  

### Key quotes

- "I am genuinely surprised by the level of detail required for this assignment. The economics and GTM docs are intense."
- "I've *hamesha* (always) wanted to work on a project structured exactly like this, where you actually have to think about the business."
- "The PDF export and the shareable link are really good touches for a take-home."

### Most surprising thing they said

He spent more time looking at the architectural decisions and the `ECONOMICS.md` file than playing with the actual UI of the web app.

### What it changed about my design

His reaction made me realize that the documentation is arguably more important than the code itself for this specific assignment. Because of his feedback, I went back and completely restructured the `README.md` to make the engineering trade-offs and the links to the `.md` files the very first thing a reviewer sees.

---

## Interview 3

**Participant:** Akanksha  
**Role:** Software Engineer  
**Company stage / team size:** Expedia Group / Enterprise (3.5 YOE)  

### Key quotes

- "At a company like Expedia, we actually have a huge problem tracking SaaS spend across different pods and teams."
- "The 'Seat right-sizing' and 'Overpaying' checks are really smart because teams constantly leave unused seats on enterprise plans when people leave."
- "If I used this at work, I couldn't buy the credits myself. You need a way for me to send these results directly to my engineering manager or finance team."

### Most surprising thing they said

She pointed out a massive B2B flow issue: at the enterprise level, the developer running the audit is almost never the person who holds the corporate credit card to actually buy the discounted credits from Credex.

### What it changed about my design

Her feedback is the exact reason I implemented the **Shareable URL** (Supabase integration) and the **Transactional Email** (Resend integration). Initially, the app only showed local results. Because of Akanksha, I added the ability to generate a unique public link and email it, so an engineer can run the audit and instantly forward the findings to their manager for approval.
