# Spotted — Launch runbook

Everything here has to be done by a human in a browser, logged into accounts
only Tiziano controls. Work top to bottom; each part depends on the one above
it.

Estimated total: **60–90 minutes**, most of it waiting for DNS.

---

## Part 1 — Register spotted.ch

**First: confirm it's actually available.** As of this writing `spotted.ch` has
no DNS records, which usually but not always means unregistered. Check at
<https://www.nic.ch/whois/> before planning around it.

`.ch` is administered by SWITCH; you buy through a registrar. Recommended, in
order:

| Registrar | Why | Rough cost/yr |
|---|---|---|
| **Infomaniak** | Swiss, Geneva-hosted DNS panel, no upsell noise, free DNS management | ~CHF 12 |
| **Hostpoint** | Swiss, St. Gallen-friendly support in German | ~CHF 15 |
| **Gandi** | Fine, but French billing and pricier renewals | ~CHF 20 |

Cloudflare Registrar does **not** sell `.ch` — don't waste time there.

Buy the domain. Do **not** buy hosting, email, or SSL add-ons; Vercel provides
hosting and certificates, and Resend provides sending.

- [ ] Domain registered
- [ ] Registrar account has 2FA enabled
- [ ] Auto-renew is on (a lapsed domain after launch is unrecoverable brand damage)

---

## Part 2 — Point spotted.ch at Vercel

1. Vercel dashboard → the `connect` project → **Settings → Domains → Add Domain**
2. Enter `spotted.ch`. Accept the prompt to also add `www.spotted.ch`.
3. Vercel then shows you the exact DNS records to create. **Use the values on
   that screen.** Vercel now issues project-specific CNAME targets (something
   like `d1d4fc829fe7bc7c.vercel-dns-017.com`), so any A record or
   `cname.vercel-dns.com` value you find in a blog post may be wrong for your
   project.
4. In the registrar's DNS panel, create:
   - an **A** record for the apex (`@`) with the IP Vercel shows
   - a **CNAME** record for `www` with the target Vercel shows
5. Wait. `.ch` propagation is usually 10–30 minutes.
6. Back in Vercel, the domain card flips to "Valid Configuration" and a
   certificate is issued automatically.

- [ ] Both records created
- [ ] Vercel shows Valid Configuration
- [ ] https://spotted.ch loads
- [ ] https://www.spotted.ch redirects to the apex (or vice versa — pick one and
      be consistent)

> **Decision to make:** apex (`spotted.ch`) or `www` as the canonical domain.
> Vercel recommends `www`. For a brand this short, apex reads better. Either is
> fine — but set the redirect so only one is canonical, or you split SEO.

---

## Part 3 — Resend account and domain verification

1. Sign up at <https://resend.com>. The free tier covers 3'000 emails/month,
   which is far beyond what a launch needs.
2. **Domains → Add Domain →** `spotted.ch`.
3. Resend gives you three DNS records. Add all three at the registrar:
   - a **TXT** record for SPF
   - a **CNAME** or **TXT** record for DKIM
   - a **TXT** record for DMARC (Resend suggests a starting policy)
4. Click **Verify**. Usually a few minutes.

Do not skip DKIM. Without it, Supabase's confirmation mails land in spam and
your onboarding funnel silently dies — which looks exactly like "nobody is
signing up".

- [ ] Domain verified in Resend (green)
- [ ] **API Keys → Create API Key**, sending permission, copy it once

---

## Part 4 — Wire Resend into Supabase Auth

Supabase's built-in mailer is capped at **2 messages per hour** and is not
meant for production. This step is what makes signup actually work.

Supabase dashboard → **Authentication → Notifications → Email → SMTP Settings**:

| Field | Value |
|---|---|
| Host | `smtp.resend.com` |
| Port | `465` |
| Username | `resend` |
| Password | your Resend API key |
| Sender email | `noreply@spotted.ch` |
| Sender name | `Spotted` |

Enable custom SMTP, save.

Then **Authentication → Rate Limits**: custom SMTP starts throttled at **30
emails/hour**. Raise it to something sane (100–200/hour) once sending works.

- [ ] SMTP saved
- [ ] Rate limit raised
- [ ] Test: sign up with a fresh address, confirmation mail arrives, from
      `@spotted.ch`, not in spam
- [ ] Test: password reset mail arrives
- [ ] Check the mail's DKIM/SPF pass — in Gmail, "Show original"

---

## Part 5 — Update URLs everywhere

Auth links break silently if any of these still point at the old Vercel URL.

1. Supabase → **Authentication → URL Configuration**:
   - **Site URL** → `https://spotted.ch`
   - **Redirect URLs** → add `https://spotted.ch/**` and keep
     `https://connect-seven-ivory.vercel.app/**` plus
     `https://*-tizianohe.vercel.app/**` so preview deployments keep working
2. Supabase → **Authentication → Email Templates**: the default templates are
   English. Customer-facing copy is supposed to be German — rewrite
   *Confirm signup*, *Reset password*, and *Magic link* at minimum.

- [ ] Site URL updated
- [ ] Preview-deployment redirect wildcard still present
- [ ] Email templates in German

---

## Part 6 — Fill in the legal pages

Open `src/lib/legal.ts` and replace every `TODO:` value. Until you do, all three
legal pages render a visible "Entwurf — noch nicht startbereit" banner. That is
deliberate: an Impressum with placeholder data is a legal defect under Art. 3
Abs. 1 lit. s UWG, not a cosmetic one.

You need:

- Legal name — your own full name if you have not registered a company
- Legal form — `Einzelunternehmen`, or `null` if operating as a private person
- Street, postcode, city
- A contact email that actually reaches you (`kontakt@spotted.ch` needs to be a
  real mailbox or a forward — Resend sends, it does not receive)
- UID number only if you are in the Handelsregister; otherwise leave `null`
- `lastUpdated`, e.g. `"August 2026"`

- [ ] All TODOs replaced
- [ ] Draft banner gone on /imprint, /privacy, /terms
- [ ] The contact email receives mail

---

## Part 7 — Seed 3–5 real businesses

Not a technical step. The review flow already works end to end: the business
signs up, completes onboarding, hits *Submit for review*, and you approve it at
`/admin`.

The bottleneck is that a real SME owner will not complete a four-step form
because you asked nicely. For the first few, expect to sit with them or fill it
in yourself from their website and have them confirm.

- [ ] 3–5 profiles published
- [ ] Each one checked on mobile

---

## Order of operations, if you only have one evening

Parts 1 → 2 → 3 → 4 are the launch-blocking chain, and Part 6 is fifteen
minutes of typing. Part 5 breaks auth if skipped. Part 7 can happen the week
after.
