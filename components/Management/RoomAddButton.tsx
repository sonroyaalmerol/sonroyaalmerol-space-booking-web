import { Button, ButtonProps, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast, VStack } from "@chakra-ui/react"
import { useFormik } from "formik"
import { useRouter } from "next/router"
import React from "react"

const RoomAddButton: React.FC<ButtonProps> = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const [loading, setLoading] = React.useState(false);

  const router = useRouter()

  const initialRef = React.useRef(null)

  const toast = useToast()

  const formik = useFormik({
    initialValues: {
      name: '',
      location: '',
      description: ''
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
      <Button {...props} onClick={onOpen}>Add New Room</Button>

      <Modal
        initialFocusRef={initialRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={formik.handleSubmit}>
            <ModalHeader>Edit Hotel</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <VStack spacing={4} align="flex-start">
                <FormControl>
                  <FormLabel htmlFor="name">Hotel Name</FormLabel>
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
                  <FormLabel htmlFor="location">Hotel Location</FormLabel>
                  <Input
                    id="location"
                    name="location"
                    type="text"
                    variant="filled"
                    onChange={formik.handleChange}
                    value={formik.values.location}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="description">Hotel Description</FormLabel>
                  <Input
                    id="description"
                    name="description"
                    type="text"
                    variant="filled"
                    onChange={formik.handleChange}
                    value={formik.values.description}
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

export default RoomAddButton