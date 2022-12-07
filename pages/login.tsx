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
import { signIn, useSession } from "next-auth/react"
import React from "react";
import { useRouter } from "next/router";

export default function Login() {
  const [loading, setLoading] = React.useState(false);
  const toast = useToast()
  const router = useRouter();

  const session = useSession()

  React.useEffect(() => {
    console.log(session)
    if (session.data?.user) {
      router.replace('/')
    }
  }, [router, session])
  
  const formik = useFormik({
    initialValues: {
      email: "",
      password: ""
    },
    onSubmit: async (values) => {
      setLoading(true);
      const res = await signIn('credentials', { redirect: false, ...values })
      if (res) {
        if (res.error) {
          console.log(res)
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
            description: "Successfully logged in!",
            status: 'success',
            duration: 9000,
            isClosable: true,
          })
        }
      }

      console.log(session)
      setLoading(false);
    }
  });
  return (
    <Flex justifyContent="center" width="100%" my="8rem">
      <Box width={["100%", "70%", "50%", "40%"]} mx={[0, 4, 8, 12]}>
        <form onSubmit={formik.handleSubmit}>
            <VStack spacing={4} align="flex-start">
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
              <Button type="submit" colorScheme="purple" width="full" isLoading={loading}>
                Login
              </Button>
            </VStack>
          </form>
        </Box>
      </Flex>
  );
}