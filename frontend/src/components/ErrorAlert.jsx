import React from 'react'
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  HStack,
} from '@chakra-ui/react'

const ErrorAlert = ({ message, onRetry, onDismiss, title = 'Something went wrong' }) => {
  return (
    <Alert
      status="error"
      variant="subtle"
      borderRadius="xl"
      bg="whiteAlpha.100"
      borderWidth="1px"
      borderColor="whiteAlpha.200"
      color="white"
      alignItems="flex-start"
      px={5}
      py={4}
    >
      <AlertIcon color="red.300" mt={0.5} />
      <Box flex="1">
        <AlertTitle fontSize="sm" fontWeight="semibold" mb={1}>
          {title}
        </AlertTitle>
        <AlertDescription fontSize="sm" color="whiteAlpha.800">
          {message}
        </AlertDescription>

        {(onRetry || onDismiss) && (
          <HStack spacing={3} mt={3}>
            {onRetry && (
              <Button size="sm" onClick={onRetry} colorScheme="red" variant="solid">
                Try Again
              </Button>
            )}
            {onDismiss && (
              <Button size="sm" onClick={onDismiss} variant="ghost" color="whiteAlpha.800">
                Dismiss
              </Button>
            )}
          </HStack>
        )}
      </Box>
    </Alert>
  )
}

export default ErrorAlert
