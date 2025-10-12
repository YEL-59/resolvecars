import CarDetailsPage from '@/components/cars/CarDetailsPage'

export async function generateMetadata({ params }) {
  return {
    title: `Car Details - ${params.id}`,
    description: 'View detailed information about this car rental option',
  }
}

export default function CarDetails({ params }) {
  return <CarDetailsPage carId={params.id} />
}