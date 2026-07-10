import { notFound } from "next/navigation";
import { getService } from "@/lib/selectors";
import { DEMO_DRIVER_ID } from "@/lib/driver-constants";
import { ServiceDetailScreen } from "@/components/driver/ServiceDetailScreen";

export default async function ChoferServiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const service = getService(id);
  if (!service || service.driverId !== DEMO_DRIVER_ID) {
    notFound();
  }
  return <ServiceDetailScreen service={service} />;
}
