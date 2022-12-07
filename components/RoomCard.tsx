import { Box, Image, Link, Text } from "@chakra-ui/react";
import { Photo, RoomType } from "@prisma/client";
import HotelImage from "./Image";


const RoomCard: React.FC<RoomType & { photos: Photo[] }> = (props) => (
  <Box width="100%" borderWidth="1px" rounded="lg" overflow="hidden">
    <HotelImage src={`/api/photos/${props.photos[0]?.id}`} />
    <Box p="6">
      <Box display="flex" alignItems="baseline">
        <Text fontSize="xl" fontWeight="bold">
          {props.name}
        </Text>
      </Box>
      <Box>
        <Text>{props.description}</Text>
      </Box>
      <Box>
        <Text>{props.price}</Text>
      </Box>
    </Box>
  </Box>
);

export default RoomCard