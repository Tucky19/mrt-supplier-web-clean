import { SearchDemandDashboard } from "@/components/admin/SearchDemandDashboard";
import {
  getSearchDemandDashboardData,
  parseAnalyticsDays,
} from "@/lib/admin/searchDemand";

export const dynamic = "force-dynamic";

export default async function LocaleAdminAnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ days?: string }>;
}) {
  const params = await searchParams;
  const days = parseAnalyticsDays(params.days, 30);
  const data = await getSearchDemandDashboardData(days);

  return <SearchDemandDashboard data={data} />;
}
