import {
  Box,
  Text
} from '@chakra-ui/react'
import { Hotel, Photo, Role } from '@prisma/client';
import { unstable_getServerSession } from 'next-auth';
import Head from 'next/head'
import { GetServerSideProps } from 'next/types';
import HotelList from '../../components/HotelList';
import prisma from '../../utils/prisma';
import { authOptions } from "../api/auth/[...nextauth]"

/**
   * This page shows the current user's hotels being managed.
   * 
   *
   * @param props - This is an object containing the hotels' information.
   * 
   * @returns A React Component containing the hotels' information.
   *
   */
export default function Home({ hotels }: { hotels: (Hotel & {photos: Photo[]})[] }) {
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box p={16}>
        <Text fontSize='5xl' as="b" mb={8}>
          Hotels being managed
        </Text>

        <HotelList hotels={hotels.map(hotel => ({
          id: hotel.id,
          name: hotel.name,
          image: hotel.photos[0] ? `/api/photos/${hotel.photos[0].id}` : "https://picsum.photos/id/57/1280/720/?grayscale&blur=10",
          location: hotel.location,
          rating: hotel.totalRating.toFixed(2),
          price: `From \$${hotel.minPrice.toFixed(2)} per night`
        }))} />
      </Box>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req, res } = context

  // @ts-expect-error
  const session = await unstable_getServerSession(req, res, authOptions)

  // If the user is not a hotel manager, redirect to the home page
  if (session?.user?.role !== Role.HOTEL_MANAGER) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }

  // Get the hotels being managed by the current user
  const hotels = await prisma.hotel.findMany({
    where: {
      managerId: session.user.id,
    },
    include: {
      photos: true,
    },
    orderBy: [
      {
        createdAt: 'desc',
      }
    ],
  })

  return {
    props: {
      hotels
    },
  }
}