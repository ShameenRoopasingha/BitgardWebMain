/**
 * =============================================================================
 * BITGARD WEBSITE - TEAM SECTION (SERVER WRAPPER)
 * =============================================================================
 * 
 * Server component that fetches data and passes to client component.
 * 
 * @author Bitgard Development Team
 * @version 1.1.0
 */

import { getActiveTeamMembers } from "@/lib/db";
import { TeamClient, type TeamMemberData } from "./TeamClient";

export async function Team() {
    // Fetch team members from database
    const dbMembers = await getActiveTeamMembers();

    // Transform database records to client-friendly format
    const members: TeamMemberData[] = dbMembers.map((member) => ({
        id: member.id,
        name: member.name,
        position: member.position,
        bio: member.bio,
        image: member.image,
        linkedin: member.linkedin,
        twitter: member.twitter,
        github: member.github,
    }));

    return <TeamClient members={members} />;
}

export default Team;
