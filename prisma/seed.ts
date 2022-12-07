import { PrismaClient, Prisma } from '@prisma/client'
import bcrypt, { hash } from 'bcrypt';

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('demo', 10);

  const userData: Prisma.UserCreateInput = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'johndoe@demo.com',
    contactNumber: '09123456789',
    password: hashedPassword,
    role: 'HOTEL_MANAGER',
  }
  

  const demoAdmin = await prisma.user.create({
    data: userData,
  })

  const hotelData: Prisma.HotelCreateInput[] = [
    {
      name: 'Hotel 1',
      description: 'Hotel 1 description',
      location: 'Hotel 1 location',
      manager: {
        connect: {
          id: demoAdmin.id
        }
      }
    },
    {
      name: 'Hotel 2',
      description: 'Hotel 2 description',
      location: 'Hotel 2 location',
      manager: {
        connect: {
          id: demoAdmin.id
        }
      }
    },
    {
      name: 'Hotel 3',
      description: 'Hotel 3 description',
      location: 'Hotel 3 location',
      manager: {
        connect: {
          id: demoAdmin.id
        }
      }
    },
    {
      name: 'Hotel 4',
      description: 'Hotel 4 description',
      location: 'Hotel 4 location',
      manager: {
        connect: {
          id: demoAdmin.id
        }
      }
    },
    {
      name: 'Hotel 5',
      description: 'Hotel 5 description',
      location: 'Hotel 5 location',
      manager: {
        connect: {
          id: demoAdmin.id
        }
      }
    }
  ]

  for (const h of hotelData) {
    const hotel = await prisma.hotel.create({
      data: h,
    })

    console.log(`Created hotel with id: ${hotel.id}`)
    
    let physRoomNumber = 101
    const roomTypeData: Prisma.RoomTypeCreateInput[] = [
      {
        name: 'Room 1',
        description: 'Room 1 description',
        price: 39.99,
        hotel: {
          connect: {
            id: hotel.id
          }
        },
        singleBed: 1,
        maxGuests: 1
      },
      {
        name: 'Room 2',
        description: 'Room 2 description',
        price: 59.99,
        hotel: {
          connect: {
            id: hotel.id
          }
        },
        twinBed: 1,
        maxGuests: 2
      },
      {
        name: 'Room 3',
        description: 'Room 3 description',
        price: 69.99,
        hotel: {
          connect: {
            id: hotel.id
          }
        },
        doubleBed: 1,
        maxGuests: 2
      },
      {
        name: 'Room 4',
        description: 'Room 4 description',
        price: 89.99,
        hotel: {
          connect: {
            id: hotel.id
          }
        },
        queenBed: 1,
        maxGuests: 2
      },
      {
        name: 'Room 5',
        description: 'Room 5 description',
        price: 99.99,
        hotel: {
          connect: {
            id: hotel.id
          }
        },
        californiaKingBed: 2,
        maxGuests: 4
      },
    ]

    for (const rt of roomTypeData) {
      const roomType = await prisma.roomType.create({
        data: rt,
      })

      console.log(`Created room type with id: ${roomType.id}`)

      const roomData: Prisma.RoomCreateInput[] = [
        {
          physicalRoomNumber: physRoomNumber,
          roomType: {
            connect: {
              id: roomType.id
            }
          },
          hotel: {
            connect: {
              id: hotel.id
            }
          }
        },
        {
          physicalRoomNumber: physRoomNumber + 1,
          roomType: {
            connect: {
              id: roomType.id
            }
          },
          hotel: {
            connect: {
              id: hotel.id
            }
          }
        },
        {
          physicalRoomNumber: physRoomNumber + 2,
          roomType: {
            connect: {
              id: roomType.id
            }
          },
          hotel: {
            connect: {
              id: hotel.id
            }
          }
        }
      ]

      physRoomNumber += 3

      for (const r of roomData) {
        const room = await prisma.room.create({
          data: r,
        })

        await prisma.roomType.update({
          where: {
            id: roomType.id
          },
          data: {
            availableRooms: {
              increment: 1
            }
          }
        })

        console.log(`Created room with id: ${room.id}`)
      }
    }
  }
  console.log(`Seeding finished.`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })