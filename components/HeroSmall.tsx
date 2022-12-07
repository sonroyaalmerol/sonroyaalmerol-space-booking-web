import React from "react";
import {
  Flex,
  Box,
  Text,
  Stack,
  Heading,
} from "@chakra-ui/react";
import SearchBar from "./SearchBar";

const Hero = () => {
  return (
    <Flex
      as="section"
      alignItems="center"
      justifyContent="center"
    >
      <Box
        width="100%"
        px={8}
        py={8}
        bgColor="white"
      >
        <Stack spacing={8}>
          <SearchBar />
        </Stack>
      </Box>
    </Flex>
  );
};

export default Hero;