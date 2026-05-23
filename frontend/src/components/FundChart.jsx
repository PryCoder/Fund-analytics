import React, { useMemo, useState } from "react";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  Badge,
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  Icon,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
  VStack,
} from "@chakra-ui/react";

import {
  TrendingDown,
  TrendingUp,
  Activity,
  Landmark,
  BarChart3,
} from "lucide-react";

import {
  filterDataByDateRange,
  formatDate,
  formatCurrency,
  calculateReturns,
} from "../utils/dateUtils";

const FundChart = ({ data, schemeName }) => {
  const [timeRange, setTimeRange] = useState("5Y");

  const filteredData = useMemo(() => {
    return filterDataByDateRange(data, timeRange);
  }, [data, timeRange]);

  const chartData = useMemo(() => {
    return filteredData.map((item) => ({
      date: formatDate(item.date),
      nav: item.nav,
      originalDate: item.parsedDate,
    }));
  }, [filteredData]);

  const stats = useMemo(() => {
    if (filteredData.length === 0) return null;

    const firstNav = filteredData[0].nav;
    const lastNav =
      filteredData[filteredData.length - 1].nav;

    const returns = calculateReturns(
      firstNav,
      lastNav
    );

    const maxNav = Math.max(
      ...filteredData.map((d) => d.nav)
    );

    const minNav = Math.min(
      ...filteredData.map((d) => d.nav)
    );

    const avgNav =
      filteredData.reduce(
        (sum, d) => sum + d.nav,
        0
      ) / filteredData.length;

    return {
      firstNav,
      lastNav,
      returns,
      maxNav,
      minNav,
      avgNav,
      dataPoints: filteredData.length,
    };
  }, [filteredData]);

  const CustomTooltip = ({
    active,
    payload,
    label,
  }) => {
    if (active && payload && payload.length) {
      return (
        <Box
          bg="rgba(255,255,255,0.95)"
          backdropFilter="blur(10px)"
          border="1px solid"
          borderColor="gray.200"
          borderRadius="2xl"
          p={4}
          boxShadow="2xl"
        >
          <Text
            fontSize="sm"
            color="gray.500"
            mb={1}
          >
            {label}
          </Text>

          <Text
            fontWeight="700"
            color="blue.600"
            fontSize="lg"
          >
            ₹
            {formatCurrency(payload[0].value)}
          </Text>

          <Text
            fontSize="xs"
            color="gray.500"
            mt={1}
          >
            Net Asset Value
          </Text>
        </Box>
      );
    }

    return null;
  };

  if (!data || data.length === 0) {
    return (
      <Flex
        minH="400px"
        align="center"
        justify="center"
      >
        <VStack spacing={4}>
          <Box
            p={6}
            borderRadius="full"
            bg="gray.100"
          >
            <TrendingDown size={40} />
          </Box>

          <Text
            fontSize="xl"
            fontWeight="700"
          >
            No NAV Data Available
          </Text>

          <Text color="gray.500">
            This mutual fund has no historical NAV
            records.
          </Text>
        </VStack>
      </Flex>
    );
  }

  return (
    <Box
      position="relative"
      overflow="hidden"
      bg="white"
      borderRadius="3xl"
      border="1px solid"
      borderColor="gray.200"
      boxShadow="2xl"
      p={{ base: 5, md: 8 }}
    >
      {/* Decorative Glow */}
      <Box
        position="absolute"
        top="-120px"
        right="-120px"
        w="280px"
        h="280px"
        bg="blue.50"
        borderRadius="full"
        filter="blur(100px)"
      />

      {/* Header */}
      <Flex
        justify="space-between"
        align={{
          base: "start",
          lg: "center",
        }}
        direction={{
          base: "column",
          lg: "row",
        }}
        gap={6}
        mb={8}
        position="relative"
        zIndex={1}
      >
        <VStack
          align="start"
          spacing={2}
          maxW="3xl"
        >
          <Badge
            colorScheme="blue"
            px={3}
            py={1}
            borderRadius="full"
            fontSize="xs"
          >
            FUND PERFORMANCE ANALYTICS
          </Badge>

          <Heading
            size="lg"
            lineHeight="1.3"
            color="gray.800"
          >
            {schemeName}
          </Heading>

          <Text
            color="gray.500"
            fontSize="sm"
          >
            Historical NAV movement and long-term
            mutual fund performance analysis.
          </Text>
        </VStack>

        {/* Range Buttons */}
        <HStack
          spacing={3}
          flexWrap="wrap"
        >
          {["1Y", "3Y", "5Y", "ALL"].map(
            (range) => (
              <Button
                key={range}
                size="sm"
                onClick={() =>
                  setTimeRange(range)
                }
                colorScheme={
                  timeRange === range
                    ? "blue"
                    : "gray"
                }
                variant={
                  timeRange === range
                    ? "solid"
                    : "ghost"
                }
                borderRadius="full"
                px={5}
              >
                {range}
              </Button>
            )
          )}
        </HStack>
      </Flex>

      {/* Stats Grid */}
      {stats && (
        <Grid
          templateColumns={{
            base: "1fr",
            md: "repeat(2,1fr)",
            xl: "repeat(4,1fr)",
          }}
          gap={5}
          mb={10}
        >
          {/* Current NAV */}
          <GridItem>
            <Box
              p={5}
              borderRadius="2xl"
              bg="gray.50"
              border="1px solid"
              borderColor="gray.100"
            >
              <HStack
                justify="space-between"
                mb={4}
              >
                <Box
                  p={3}
                  borderRadius="xl"
                  bg="blue.100"
                  color="blue.600"
                >
                  <Icon
                    as={Landmark}
                    boxSize={5}
                  />
                </Box>

                <Badge
                  colorScheme="blue"
                  borderRadius="full"
                >
                  Current
                </Badge>
              </HStack>

              <Stat>
                <StatLabel color="gray.500">
                  Current NAV
                </StatLabel>

                <StatNumber
                  fontSize="2xl"
                  color="gray.800"
                >
                  ₹
                  {formatCurrency(
                    stats.lastNav
                  )}
                </StatNumber>

                <StatHelpText>
                  Latest recorded NAV
                </StatHelpText>
              </Stat>
            </Box>
          </GridItem>

          {/* Returns */}
          <GridItem>
            <Box
              p={5}
              borderRadius="2xl"
              bg={
                stats.returns.absolute >= 0
                  ? "green.50"
                  : "red.50"
              }
              border="1px solid"
              borderColor={
                stats.returns.absolute >= 0
                  ? "green.100"
                  : "red.100"
              }
            >
              <HStack
                justify="space-between"
                mb={4}
              >
                <Box
                  p={3}
                  borderRadius="xl"
                  bg={
                    stats.returns.absolute >= 0
                      ? "green.100"
                      : "red.100"
                  }
                  color={
                    stats.returns.absolute >= 0
                      ? "green.600"
                      : "red.600"
                  }
                >
                  <Icon
                    as={
                      stats.returns.absolute >= 0
                        ? TrendingUp
                        : TrendingDown
                    }
                    boxSize={5}
                  />
                </Box>

                <Badge
                  colorScheme={
                    stats.returns.absolute >= 0
                      ? "green"
                      : "red"
                  }
                  borderRadius="full"
                >
                  Returns
                </Badge>
              </HStack>

              <Stat>
                <StatLabel>
                  Growth
                </StatLabel>

                <StatNumber
                  fontSize="2xl"
                  color={
                    stats.returns.absolute >= 0
                      ? "green.600"
                      : "red.600"
                  }
                >
                  {stats.returns.percentage.toFixed(
                    2
                  )}
                  %
                </StatNumber>

                <StatHelpText>
                  ₹
                  {formatCurrency(
                    stats.returns.absolute
                  )}
                </StatHelpText>
              </Stat>
            </Box>
          </GridItem>

          {/* NAV Range */}
          <GridItem>
            <Box
              p={5}
              borderRadius="2xl"
              bg="purple.50"
              border="1px solid"
              borderColor="purple.100"
            >
              <HStack
                justify="space-between"
                mb={4}
              >
                <Box
                  p={3}
                  borderRadius="xl"
                  bg="purple.100"
                  color="purple.600"
                >
                  <Icon
                    as={Activity}
                    boxSize={5}
                  />
                </Box>

                <Badge
                  colorScheme="purple"
                  borderRadius="full"
                >
                  Range
                </Badge>
              </HStack>

              <Stat>
                <StatLabel>
                  NAV Range
                </StatLabel>

                <StatNumber
                  fontSize="lg"
                  color="gray.800"
                >
                  ₹
                  {formatCurrency(
                    stats.minNav
                  )}{" "}
                  — ₹
                  {formatCurrency(
                    stats.maxNav
                  )}
                </StatNumber>

                <StatHelpText>
                  Historical movement
                </StatHelpText>
              </Stat>
            </Box>
          </GridItem>

          {/* Data Points */}
          <GridItem>
            <Box
              p={5}
              borderRadius="2xl"
              bg="orange.50"
              border="1px solid"
              borderColor="orange.100"
            >
              <HStack
                justify="space-between"
                mb={4}
              >
                <Box
                  p={3}
                  borderRadius="xl"
                  bg="orange.100"
                  color="orange.600"
                >
                  <Icon
                    as={BarChart3}
                    boxSize={5}
                  />
                </Box>

                <Badge
                  colorScheme="orange"
                  borderRadius="full"
                >
                  Dataset
                </Badge>
              </HStack>

              <Stat>
                <StatLabel>
                  Data Points
                </StatLabel>

                <StatNumber
                  fontSize="2xl"
                >
                  {stats.dataPoints}
                </StatNumber>

                <StatHelpText>
                  NAV records analyzed
                </StatHelpText>
              </Stat>
            </Box>
          </GridItem>
        </Grid>
      )}

      {/* Chart */}
      <Box
        h={{
          base: "350px",
          md: "500px",
        }}
        w="full"
      >
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <AreaChart
            data={chartData}
            margin={{
              top: 20,
              right: 20,
              left: 0,
              bottom: 20,
            }}
          >
            <defs>
              <linearGradient
                id="navGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="#3182CE"
                  stopOpacity={0.35}
                />

                <stop
                  offset="100%"
                  stopColor="#3182CE"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="4 4"
              stroke="#E2E8F0"
              vertical={false}
            />

            <XAxis
              dataKey="date"
              tick={{
                fontSize: 12,
                fill: "#718096",
              }}
              axisLine={false}
              tickLine={false}
              minTickGap={25}
            />

            <YAxis
              tick={{
                fontSize: 12,
                fill: "#718096",
              }}
              tickFormatter={(value) =>
                `₹${value}`
              }
              axisLine={false}
              tickLine={false}
              width={80}
            />

            <Tooltip
              content={<CustomTooltip />}
            />

            <Legend />

            <Area
              type="monotone"
              dataKey="nav"
              stroke="#3182CE"
              strokeWidth={3}
              fill="url(#navGradient)"
            />

            <Line
              type="monotone"
              dataKey="nav"
              stroke="#2563EB"
              strokeWidth={3}
              dot={false}
              activeDot={{
                r: 7,
                fill: "#2563EB",
                stroke: "white",
                strokeWidth: 3,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Box>

      {/* Footer */}
      <Flex
        mt={6}
        justify="space-between"
        align={{
          base: "start",
          md: "center",
        }}
        direction={{
          base: "column",
          md: "row",
        }}
        gap={3}
      >
        <Text
          fontSize="sm"
          color="gray.500"
        >
          Showing {stats?.dataPoints} NAV entries
          for the selected period.
        </Text>

        <Badge
          colorScheme="gray"
          borderRadius="full"
          px={3}
          py={1}
        >
          Powered by MFAPI
        </Badge>
      </Flex>
    </Box>
  );
};

export default FundChart;