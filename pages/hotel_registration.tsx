import { useFormik } from "formik";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  useToast,
  VStack
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";

export default function HotelRegistration() {
  const [loading, setLoading] = React.useState(false);
  const toast = useToast()
  const router = useRouter();

  const session = useSession()

  const formik = useFormik({
    initialValues: {
      user: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        contactNumber: '',
        confirmPassword: ''
      },
      hotel: {
        name: '',
        location: '',
        description: '',
      }
    },
    onSubmit: async (values) => {
      setLoading(true);
      const res = await fetch('/api/hotels/register', {
        method: 'POST',
        body: JSON.stringify(values)
      }).then((res) => res.json());

      if (res.error) {
        toast({
          title: 'Error',
          description: res.error,
          status: 'error',
          duration: 9000,
          isClosable: true,
        })
      } else {
        toast({
          title: 'Success',
          description: res.message,
          status: 'success',
          duration: 9000,
          isClosable: true,
        })
      }
      setLoading(false);
    }
  });
  return (
    <Flex justifyContent="center" width="100%" my="8rem">
      <Box width={["100%", "70%", "50%", "40%"]} mx={[0, 4, 8, 12]}>
        <form onSubmit={formik.handleSubmit}>
          { session.status !== 'authenticated' && (
            <VStack spacing={4} align="flex-start" mb={12}>
              <FormControl>
                <FormLabel htmlFor="user.firstName">First Name</FormLabel>
                <Input
                  id="user.firstName"
                  name="user.firstName"
                  type="text"
                  variant="filled"
                  onChange={formik.handleChange}
                  value={formik.values.user.firstName}
                />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="user.lastName">Last Name</FormLabel>
                <Input
                  id="user.lastName"
                  name="user.lastName"
                  type="text"
                  variant="filled"
                  onChange={formik.handleChange}
                  value={formik.values.user.lastName}
                />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="user.contactNumber">Contact Number</FormLabel>
                <Input
                  id="user.contactNumber"
                  name="user.contactNumber"
                  type="text"
                  variant="filled"
                  onChange={formik.handleChange}
                  value={formik.values.user.contactNumber}
                />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="user.email">Email Address</FormLabel>
                <Input
                  id="user.email"
                  name="user.email"
                  type="user.email"
                  variant="filled"
                  onChange={formik.handleChange}
                  value={formik.values.user.email}
                />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="user.password">Password</FormLabel>
                <Input
                  id="user.password"
                  name="user.password"
                  type="user.password"
                  variant="filled"
                  onChange={formik.handleChange}
                  value={formik.values.user.password}
                />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="user.confirmPassword">Confirm Password</FormLabel>
                <Input
                  id="user.confirmPassword"
                  name="user.confirmPassword"
                  type="user.password"
                  variant="filled"
                  onChange={formik.handleChange}
                  value={formik.values.user.confirmPassword}
                />
              </FormControl>
            </VStack>
          ) }
          <VStack spacing={4} align="flex-start">
            <FormControl>
              <FormLabel htmlFor="hotel.name">Hotel Name</FormLabel>
              <Input
                id="hotel.name"
                name="hotel.name"
                type="text"
                variant="filled"
                onChange={formik.handleChange}
                value={formik.values.hotel.name}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="hotel.location">Hotel Location</FormLabel>
              <Input
                id="hotel.location"
                name="hotel.location"
                type="text"
                variant="filled"
                onChange={formik.handleChange}
                value={formik.values.hotel.location}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="hotel.description">Hotel Description</FormLabel>
              <Input
                id="hotel.description"
                name="hotel.description"
                type="text"
                variant="filled"
                onChange={formik.handleChange}
                value={formik.values.hotel.description}
              />
            </FormControl>
            <Button type="submit" colorScheme="purple" width="full">
              Register
            </Button>
          </VStack>
        </form>
      </Box>
    </Flex>
  );
}