import { Box, Flex, Image, Text } from "@chakra-ui/react";
import HotelCard, { Hotel } from "./HotelCard";

export interface HotelListProps {
  hotels: Hotel[];
}

const HotelList: React.FC<HotelListProps> = ({ hotels }) => (
  <Flex align="center" justifyContent="space-between" wrap="wrap">
    {hotels.map(hotel => (
      <Box key={hotel.id} p="5" w={{ base: "100%", md: "33%" }}>
        <HotelCard {...hotel} />
      </Box>
    ))}
  </Flex>
);

export default HotelList