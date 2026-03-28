import { getTeamMembers } from "@/lib/actions";
import TeamClient from "./TeamClient";

export const dynamic = "force-dynamic";

export default async function TeamPage() {
    const team = await getTeamMembers();
    return <TeamClient initialTeam={JSON.parse(JSON.stringify(team))} />;
}
