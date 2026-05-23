import React from 'react'
import { Link as RouterLink, useLocation } from 'react-router-dom'

import { Badge, Box, Button, Container, Flex, HStack, Icon, Text, VStack } from '@chakra-ui/react'

import { TrendingUp } from 'lucide-react'

const Navbar = () => {
  const location = useLocation()

  return (
    <Box
      as="header"
      position="sticky"
      top="0"
      zIndex="1000"
      w="full"
      borderBottom="1px solid"
      borderColor="gray.200"
      bg="whiteAlpha.900"
      backdropFilter="blur(12px)"
      boxShadow="sm"
    >
      <Container maxW="7xl">
        <Flex h="72px" align="center" justify="space-between">
          {/* Logo Section */}
          <HStack
            as={RouterLink}
            to="/"
            spacing={4}
            minW={0}
            transition="all 0.2s"
            _hover={{
              opacity: 0.9,
              transform: 'translateY(-1px)',
            }}
          >
            {/* Icon */}
            <Flex
              h={{ base: 10, md: 11 }}
              w={{ base: 10, md: 11 }}
              align="center"
              justify="center"
              borderRadius="2xl"
              bgGradient="linear(to-br, blue.500, purple.600)"
              color="white"
              boxShadow="md"
              flexShrink={0}
            >
              <Icon as={TrendingUp} boxSize={5} />
            </Flex>

            {/* Text */}
            <VStack align="start" spacing={0} minW={0}>
              <Text
                fontWeight="800"
                fontSize={{ base: 'md', sm: 'lg', md: 'xl' }}
                lineHeight="1"
                noOfLines={1}
                color="gray.800"
              >
                Aureva Fund Tracker
              </Text>

              <Badge
                display={{ base: 'none', sm: 'inline-flex' }}
                colorScheme="purple"
                variant="subtle"
                borderRadius="md"
                px={2}
                py={0.5}
                fontSize="10px"
                mt={1}
              >
                Mutual Fund Insights
              </Badge>
            </VStack>
          </HStack>

          {/* Navigation */}
          <HStack spacing={3}>
            <Button
              as={RouterLink}
              to="/"
              size="md"
              variant={location.pathname === '/' ? 'solid' : 'ghost'}
              colorScheme="blue"
              borderRadius="xl"
              px={5}
            >
              Dashboard
            </Button>
          </HStack>
        </Flex>
      </Container>
    </Box>
  )
}

export default Navbar
