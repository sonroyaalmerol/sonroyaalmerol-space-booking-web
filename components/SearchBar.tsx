import { useFormik } from "formik"
import {
  Box,
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  Button,
  Flex,
} from "@chakra-ui/react"

import { setCookie, getCookie } from 'cookies-next';

import { SingleDatepicker } from 'chakra-dayzed-datepicker'
import { useRouter } from "next/router"

export default function SearchBar() {
  const router = useRouter()

  const getInitialValues = () => {
    const search = getCookie('search')
    
    if (!search) {
      return {
        city: "",
        startDate: new Date(),
        endDate: new Date(),
        adults: 1,
        children: 0,
        rooms: 1,
      }
    }

    const parsedSearch = JSON.parse(search.toString())

    return {
      city: parsedSearch.city,
      startDate: new Date(parsedSearch.startDate),
      endDate: new Date(parsedSearch.endDate),
      adults: parsedSearch.adults,
      children: parsedSearch.children,
      rooms: parsedSearch.rooms,
    }
  }

  const formik = useFormik({
    initialValues: getInitialValues(),
    onSubmit: (values) => {
      setCookie('search', JSON.stringify(values))
      router.push({
        pathname: "/search",
        query: {
          location: values.city,
          check_in: values.startDate.toISOString(),
          check_out: values.endDate.toISOString(),
          guests: values.adults + values.children,
          rooms: values.rooms,
        }
      })
      // handle form submission
    },
  })

  return (
    <Box>
      <form onSubmit={formik.handleSubmit}>
        <Flex gap='2'>
          <FormControl w="100rem">
            <FormLabel htmlFor="city">City</FormLabel>
            <Input
              id="city"
              name="city"
              value={formik.values.city}
              onChange={formik.handleChange}
              placeholder="Enter a city"
            />
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="startDate">Start Date</FormLabel>
            <SingleDatepicker
              id="startDate"
              name="startDate"
              date={formik.values.startDate}
              onDateChange={(date) => formik.setFieldValue("startDate", date)}
            />
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="endDate">End Date</FormLabel>
            <SingleDatepicker
              id="endDate"
              name="endDate"
              date={formik.values.endDate}
              onDateChange={(date) => formik.setFieldValue("endDate", date)}
            />
          </FormControl>

          <FormControl w="8rem">
            <FormLabel htmlFor="adults">Adults</FormLabel>
            <Input
              type="number"
              id="adults"
              name="adults"
              value={formik.values.adults}
              onChange={formik.handleChange}
              min={1}
            />
          </FormControl>

          <FormControl w="8rem">
            <FormLabel htmlFor="children">Children</FormLabel>
            <Input
              type="number"
              id="children"
              name="children"
              value={formik.values.children}
              onChange={formik.handleChange}
              min={0}
            />
          </FormControl>

          <FormControl w="8rem">
            <FormLabel htmlFor="rooms">Rooms</FormLabel>
            <Input
              type="number"
              id="rooms"
              name="rooms"
              value={formik.values.rooms}
              onChange={formik.handleChange}
              min={1}
            />
          </FormControl>
        </Flex>
        <Button type="submit" w="100%" mt="2rem">Search</Button>
      </form>
    </Box>
  );
}
