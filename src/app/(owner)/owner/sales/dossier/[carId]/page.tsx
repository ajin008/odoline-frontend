import { VehicleDossier } from "@/src/features/sales/components/vehicle-dossier";

interface PageProps {
  params: Promise<{
    carId: string;
  }>;
}

export const metadata = {
  title: "Vehicle Dossier | Owner",
  description: "Complete vehicle lifecycle history and financial dossier",
};

export default async function OwnerCarDossierPage({ params }: PageProps) {
  const { carId } = await params;
  return <VehicleDossier carId={carId} />;
}
