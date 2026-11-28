-- Defense-in-depth Supabase PostgreSQL Row-Level Security (RLS) policies for BitgardWeb.
-- Note: Prisma connects using the postgres role (which has BYPASSRLS in Supabase).
-- Enabling RLS without anon/authenticated policies blocks accidental Supabase PostgREST API access
-- via NEXT_PUBLIC_SUPABASE_ANON_KEY while keeping Prisma server-side queries working.

ALTER TABLE public."Admin" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."BlogPost" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."ContactSubmission" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."HeroContent" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Product" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Service" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."SiteSettings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."TeamMember" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Testimonial" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."VigilSubscription" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."VigilSubscriptionEvent" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."PendingCheckoutSetup" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."rate_limit_buckets" ENABLE ROW LEVEL SECURITY;
