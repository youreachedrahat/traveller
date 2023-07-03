import React, { useState } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  Heading,
} from "@chakra-ui/react";

function Index() {
  const [place, setPlace] = useState("");
  const [numDays, setNumDays] = useState(0);

  const handlePlaceChange = (event) => {
    setPlace(event.target.value);
  };

  const handleNumDaysChange = (event) => {
    setNumDays(Number(event.target.value));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // You can use the 'place' and 'numDays' variables as needed
    console.log("Place:", place);
    console.log("Number of Days:", numDays);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      p={4}
      bgColor="White"
    >
      <Heading mb={8} size="xl" color="white">
        Welcome to Your Dream Vacation Planner
      </Heading>
      <Box
        p={8}
        bg="white"
        rounded="md"
        boxShadow="md"
        maxW="400px"
        w="100%"
        as="form"
        onSubmit={handleSubmit}
      >
        <FormControl id="place" mb={4}>
          <FormLabel>Place</FormLabel>
          <Input type="text" value={place} onChange={handlePlaceChange} />
        </FormControl>
        <FormControl id="numDays" mb={4}>
          <FormLabel>Number of Days</FormLabel>
          <Input type="number" value={numDays} onChange={handleNumDaysChange} />
        </FormControl>
        <Button colorScheme="teal" type="submit" w="100%">
          Plan My Vacation
        </Button>
      </Box>
    </Box>
  );
}

export default Index;
