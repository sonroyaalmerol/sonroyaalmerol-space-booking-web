import { Box, Image, Link, Text } from "@chakra-ui/react";
import HotelImage from "./Image";

export interface Hotel {
  id: number | string;
  name: string;
  image: string;
  location: string;
  rating: string;
  price: string;
}

const HotelCard: React.FC<Hotel> = ({ id, name, image, location, rating, price }) => (
  <Box width="100%" borderWidth="1px" rounded="lg" overflow="hidden">
    <HotelImage src={image} />
    <Box p="6">
      <Box display="flex" alignItems="baseline">
        <Link fontSize="xl" fontWeight="bold" href={`/hotels/${id}`}>
          {name}
        </Link>
        <Box
          color="orange.500"
          fontWeight="bold"
          letterSpacing="wide"
          ml="2"
          textTransform="uppercase"
        >
          {rating}
        </Box>
      </Box>
      <Box>
        <Text>{location}</Text>
      </Box>
      <Box>
        <Text>{price}</Text>
      </Box>
    </Box>
  </Box>
);

export default HotelCard