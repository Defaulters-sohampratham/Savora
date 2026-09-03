import { SavoraDashboard } from "./_components/savora-dashboard";
import { demoProfiles } from "@/lib/finance/demo-profiles";

export default function Home() {
  return <SavoraDashboard profiles={demoProfiles} />;
}
