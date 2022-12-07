import React from "react";
import {
  Flex,
  Box,
  Link,
  Stack,
  Heading,
  Text,
  List,
  ListItem
} from "@chakra-ui/react";

const Footer = () => {
  return (
    <Flex
      as="footer"
      alignItems="center"
      justifyContent="space-between"
      py={8}
      px={[4, 8]}
    >
      <Box>
        <Stack isInline spacing={8}>
          <Stack direction="column" spacing={4}>
            <Heading as="h4" size="md">
              Space Booking
            </Heading>
            <Text fontSize="sm">
              Search low prices on hotels and much more
            </Text>
            <List styleType="none" spacing={2}>
              <ListItem>
                <Link href="#">Terms of Use</Link>
              </ListItem>
              <ListItem>
                <Link href="#">Privacy Policy</Link>
              </ListItem>
              <ListItem>
                <Link href="#">Contact Us</Link>
              </ListItem>
            </List>
          </Stack>
          <Stack direction="column" spacing={4}>
            <Heading as="h4" size="md">
              Quick Links
            </Heading>
            <List styleType="none" spacing={2}>
              <ListItem>
                <Link href="#">Home</Link>
              </ListItem>
            </List>
          </Stack>
        </Stack>
      </Box>
    </Flex>
  );
};

export default Footer;