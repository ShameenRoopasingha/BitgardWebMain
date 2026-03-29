import { getActiveHeroContent } from "@/lib/db";
import { HeroClient } from "./HeroClient";

export async function Hero() {
    // Fetch hero content from database to provide dynamic content
    const content = await getActiveHeroContent();
    
    return <HeroClient content={content} />;
}

export default Hero;
