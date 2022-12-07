import React from 'react';
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
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

export default function Register() {
  const [loading, setLoading] = React.useState(false);
  const toast = useToast()
  const router = useRouter();

  const session = useSession()

  React.useEffect(() => {
    if (session.data?.user) {
      router.replace('/')
    }
  }, [router, session])

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      contactNumber: '',
      confirmPassword: ''
    },
    onSubmit: async (values) => {
      setLoading(true);
      const res = await fetch('/api/auth/register', {
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
          <VStack spacing={4} align="flex-start">
            <FormControl>
              <FormLabel htmlFor="firstName">First Name</FormLabel>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                variant="filled"
                onChange={formik.handleChange}
                value={formik.values.firstName}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="lastName">Last Name</FormLabel>
              <Input
                id="lastName"
                name="lastName"
                type="text"
                variant="filled"
                onChange={formik.handleChange}
                value={formik.values.lastName}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="contactNumber">Contact Number</FormLabel>
              <Input
                id="contactNumber"
                name="contactNumber"
                type="text"
                variant="filled"
                onChange={formik.handleChange}
                value={formik.values.contactNumber}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="email">Email Address</FormLabel>
              <Input
                id="email"
                name="email"
                type="email"
                variant="filled"
                onChange={formik.handleChange}
                value={formik.values.email}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <Input
                id="password"
                name="password"
                type="password"
                variant="filled"
                onChange={formik.handleChange}
                value={formik.values.password}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                variant="filled"
                onChange={formik.handleChange}
                value={formik.values.confirmPassword}
              />
            </FormControl>
            <Button type="submit" colorScheme="purple" width="full" isLoading={loading}>
              Register
            </Button>
          </VStack>
        </form>
      </Box>
    </Flex>
  );
}