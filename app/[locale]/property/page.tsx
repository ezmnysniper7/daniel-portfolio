import { PropertyHero } from '@/components/property/PropertyHero';
import { ServicesRental } from '@/components/property/ServicesRental';
import { FeaturedRentals } from '@/components/property/FeaturedRentals';
import { ProcessSteps } from '@/components/property/ProcessSteps';
import { PropertyAbout } from '@/components/property/PropertyAbout';
import { getRentals } from '@/data/rentals';

export default async function PropertyHome({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const rentals = getRentals(locale);

  return (
    <>
      <PropertyHero />
      <ServicesRental />
      <FeaturedRentals rentals={rentals} />
      <ProcessSteps />
      <PropertyAbout />
    </>
  );
}
