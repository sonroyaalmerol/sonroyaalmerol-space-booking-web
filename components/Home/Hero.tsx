import React from "react";
import {
  Flex,
  Box,
  Text,
  Stack,
  Heading,
} from "@chakra-ui/react";
import SearchBar from "../SearchBar";

const Hero = () => {
  return (
    <Flex
      as="section"
      alignItems="center"
      justifyContent="center"
      height="calc(100vh - 4rem)"
      bgImg="https://familyvacationist.com/wp-content/uploads/2020/12/Hard-Rock-Hotel-Riviera-Maya.jpg"
      bgPos="center"
      bgSize="cover"
    >
      <Box
        maxWidth={["100%", "70%", "60%", "50%"]}
        width="100%"
        px={8}
        py={8}
        bgColor="white"
      >
        <Stack spacing={8}>
          <Heading as="h1" size="2xl">
            Space Booking
          </Heading>
          <Text fontSize="xl">
            Search low prices on hotels and much more...
          </Text>
          <SearchBar />
        </Stack>
      </Box>
    </Flex>
  );
};

export default Hero;