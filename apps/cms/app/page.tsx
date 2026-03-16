/**
 * =============================================================================
 * BITGARD CMS - ROOT PAGE (REDIRECT)
 * =============================================================================
 * 
 * The root page of the CMS redirects to the login page.
 * 
 * @author Bitgard Development Team
 * @version 1.0.0
 */

import { redirect } from "next/navigation";

export default function CMSRootPage() {
  // Redirect to login page
  redirect("/auth/login");
}
