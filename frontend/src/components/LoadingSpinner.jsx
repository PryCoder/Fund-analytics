import React from "react";

import {
  Box,
  Flex,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";

import { TrendingUp } from "lucide-react";

const LoadingSpinner = ({
  message = "Loading...",
}) => {
  return (
    <Flex
      w="full"
      minH="300px"
      align="center"
      justify="center"
      px={6}
    >
      <Box
        position="relative"
        overflow="hidden"
        bg="white"
        borderWidth="1px"
        borderColor="gray.200"
        borderRadius="3xl"
        px={{ base: 8, md: 12 }}
        py={{ base: 10, md: 12 }}
        boxShadow="xl"
        maxW="sm"
        w="full"
      >
        {/* Background Glow */}
        <Box
          position="absolute"
          top="-60px"
          right="-60px"
          w="140px"
          h="140px"
          bg="blue.50"
          borderRadius="full"
          filter="blur(50px)"
        />

        <VStack
          spacing={6}
          position="relative"
          zIndex={1}
        >
          {/* Icon Circle */}
          <Flex
            h="72px"
            w="72px"
            align="center"
            justify="center"
            borderRadius="full"
            bgGradient="linear(to-br, blue.500, purple.500)"
            color="white"
            boxShadow="lg"
            position="relative"
          >
            <TrendingUp size={28} />

            {/* Spinner Overlay */}
            <Spinner
              position="absolute"
              thickness="3px"
              speed="0.7s"
              emptyColor="transparent"
              color="whiteAlpha.700"
              size="xl"
            />
          </Flex>

          {/* Text */}
          <VStack spacing={2}>
            <Text
              fontSize="xl"
              fontWeight="700"
              color="gray.800"
              textAlign="center"
            >
              Fetching Fund Insights
            </Text>

            <Text
              fontSize="sm"
              color="gray.500"
              textAlign="center"
              lineHeight="tall"
            >
              {message}
            </Text>
          </VStack>
        </VStack>
      </Box>
    </Flex>
  );
};

export default LoadingSpinner;