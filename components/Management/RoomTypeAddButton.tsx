import { Button, ButtonProps, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast, VStack } from "@chakra-ui/react"
import { useFormik } from "formik"
import { useRouter } from "next/router"
import React from "react"

const RoomTypeAddButton: React.FC<ButtonProps> = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const [loading, setLoading] = React.useState(false);

  const router = useRouter()

  const initialRef = React.useRef(null)

  const toast = useToast()

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      price: 0,
      singleBed: 0,
      twinBed: 0,
      doubleBed: 0,
      queenBed: 0,
      fullBed: 0,
      kingBed: 0,
      californiaKingBed: 0,
      maxGuests: 0,
      photos: []
    },
    onSubmit: async (values) => {
      setLoading(true);
      const res = await fetch(`/api/hotels/`, {
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
        router.reload()
      }
      setLoading(false);
    }
  });

  return (
    <>
      <Button {...props} onClick={onOpen}>Add Room Type</Button>

      <Modal
        initialFocusRef={initialRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={formik.handleSubmit}>
            <ModalHeader>New Room Type</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <VStack spacing={4} align="flex-start">
                <FormControl>
                  <FormLabel htmlFor="name">Type Name</FormLabel>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    variant="filled"
                    onChange={formik.handleChange}
                    value={formik.values.name}
                    ref={initialRef}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="description">Description</FormLabel>
                  <Input
                    id="description"
                    name="description"
                    type="text"
                    variant="filled"
                    onChange={formik.handleChange}
                    value={formik.values.description}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="price">Price per night</FormLabel>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    variant="filled"
                    onChange={formik.handleChange}
                    value={formik.values.price}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel htmlFor=""># of Single Beds</FormLabel>
                  <Input
                    id="singleBed"
                    name="singleBed"
                    type="number"
                    variant="filled"
                    onChange={formik.handleChange}
                    value={formik.values.singleBed}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="twinBed"># of Twin Beds</FormLabel>
                  <Input
                    id="twinBed"
                    name="twinBed"
                    type="number"
                    variant="filled"
                    onChange={formik.handleChange}
                    value={formik.values.twinBed}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="doubleBed"># of Double Beds</FormLabel>
                  <Input
                    id="doubleBed"
                    name="doubleBed"
                    type="number"
                    variant="filled"
                    onChange={formik.handleChange}
                    value={formik.values.doubleBed}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="fullBed"># of Full Beds</FormLabel>
                  <Input
                    id="fullBed"
                    name="fullBed"
                    type="number"
                    variant="filled"
                    onChange={formik.handleChange}
                    value={formik.values.fullBed}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="queenBed"># of Queen Beds</FormLabel>
                  <Input
                    id="queenBed"
                    name="queenBed"
                    type="number"
                    variant="filled"
                    onChange={formik.handleChange}
                    value={formik.values.queenBed}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="kingBed"># of King Beds</FormLabel>
                  <Input
                    id="kingBed"
                    name="kingBed"
                    type="number"
                    variant="filled"
                    onChange={formik.handleChange}
                    value={formik.values.kingBed}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="californiaKingBed"># of California King Beds</FormLabel>
                  <Input
                    id="californiaKingBed"
                    name="californiaKingBed"
                    type="number"
                    variant="filled"
                    onChange={formik.handleChange}
                    value={formik.values.californiaKingBed}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="maxGuests">Max # of Guests</FormLabel>
                  <Input
                    id="maxGuests"
                    name="maxGuests"
                    type="number"
                    variant="filled"
                    onChange={formik.handleChange}
                    value={formik.values.maxGuests}
                  />
                </FormControl>
              </VStack>
            </ModalBody>

            <ModalFooter>
              <Button type="submit" colorScheme="purple" mr={3} isLoading={loading}>
                Add
              </Button>
              <Button onClick={onClose} isLoading={loading}>Cancel</Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  )
}

export default RoomTypeAddButton