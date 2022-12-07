import { Image as ChakraImage, ImageProps } from "@chakra-ui/react";
import React from "react";

const HotelImage: React.FC<ImageProps> = (props) => {
  const [src, setSrc] = React.useState(props.src)

  const checkImage = (url: string) => {
    return new Promise<boolean>((resolve) => {
      var image = new Image();
      image.onload = function() {
        if (image.width > 0) {
          resolve(true)
        }
      }
      image.onerror = function() {
        resolve(false)
      }
      image.src = url;
    })
  }

  React.useEffect(() => {
    checkImage(props.src as string).then((exists) => {
      if (!exists) {
        setSrc("https://picsum.photos/id/57/1280/720/?grayscale&blur=10")
      }
    })
  }, [props])

  return (
    <ChakraImage {...props} src={src} />
  )
};

export default HotelImage