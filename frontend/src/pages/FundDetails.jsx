// FundDetail.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Badge,
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Container,
  Divider,
  Flex,
  Grid,
  Heading,
  HStack,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MagicCard } from "@/components/ui/magic-card";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { NumberTicker } from "@/components/ui/number-ticker";
import {
  ArrowLeft,
  Building2,
  Database,
  Landmark,
  TrendingUp,
  Activity,
  DollarSign,
  Award,
  Shield,
  Eye,
  Calendar,
  LineChart,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ErrorAlert from "../components/ErrorAlert";
import { fundsAPI } from "../services/api";
import { AuroraText } from "@/components/ui/aurora-text";
import { InteractiveLineChart } from "@/components/ui/interactive-line-chart";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 15, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
  },
};

const fadeInUp = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
  },
};

// Helper function to safely parse dates.
// IMPORTANT: NAV dates from mfapi.in are commonly in `DD-MM-YYYY`. Using `new Date("11-05-2026")`
// is ambiguous in JS runtimes and can be interpreted as `MM-DD-YYYY` (Nov 5, 2026).
const parseDate = (value) => {
  if (!value) return null;
  if (value instanceof Date) return isNaN(value.getTime()) ? null : value;

  if (typeof value === "number") {
    const date = new Date(value);
    return isNaN(date.getTime()) ? null : date;
  }

  const dateStr = String(value).trim();
  if (!dateStr) return null;

  // ISO (yyyy-mm-dd or full ISO timestamp)
  if (/^\d{4}-\d{2}-\d{2}(?:[T\s].*)?$/.test(dateStr)) {
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? null : date;
  }

  // dd-mm-yyyy or dd/mm/yyyy
  const m = dateStr.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
  if (m) {
    const day = Number(m[1]);
    const month = Number(m[2]);
    const year = Number(m[3]);
    const date = new Date(year, month - 1, day);
    return isNaN(date.getTime()) ? null : date;
  }

  // Fallback (avoid for ambiguous formats; kept for resilience)
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? null : date;
};

const getNavItemDateValue = (item) => item?.parsedDate ?? item?.date;

// Helper function to format date safely
const formatDate = (dateStr) => {
  const date = parseDate(dateStr);
  if (!date) return "N/A";
  
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

// Helper function to calculate fund performance metrics
const calculatePerformanceMetrics = (navData) => {
  if (!navData || navData.length === 0) return null;
  
  const validData = navData
    .filter(item => {
      const date = parseDate(getNavItemDateValue(item));
      return date && typeof item.nav === 'number' && !isNaN(item.nav);
    })
    .sort((a, b) => {
      const dateA = parseDate(getNavItemDateValue(a));
      const dateB = parseDate(getNavItemDateValue(b));
      if (!dateA || !dateB) return 0;
      return dateA - dateB;
    });
  
  if (validData.length === 0) return null;
  
  const latestNAV = validData[validData.length - 1].nav;
  const oldestNAV = validData[0].nav;
  const totalReturn = ((latestNAV - oldestNAV) / oldestNAV) * 100;
  
  const now = new Date();
  const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
  const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
  
  const oneYearData = validData.filter(d => {
    const date = parseDate(getNavItemDateValue(d));
    return date && date >= oneYearAgo;
  });
  const oneYearReturn = oneYearData.length > 1 
    ? ((oneYearData[oneYearData.length - 1].nav - oneYearData[0].nav) / oneYearData[0].nav) * 100
    : null;
  
  const sixMonthData = validData.filter(d => {
    const date = parseDate(getNavItemDateValue(d));
    return date && date >= sixMonthsAgo;
  });
  const sixMonthReturn = sixMonthData.length > 1
    ? ((sixMonthData[sixMonthData.length - 1].nav - sixMonthData[0].nav) / sixMonthData[0].nav) * 100
    : null;
  
  const threeMonthData = validData.filter(d => {
    const date = parseDate(getNavItemDateValue(d));
    return date && date >= threeMonthsAgo;
  });
  const threeMonthReturn = threeMonthData.length > 1
    ? ((threeMonthData[threeMonthData.length - 1].nav - threeMonthData[0].nav) / threeMonthData[0].nav) * 100
    : null;
  
  const dailyReturns = [];
  for (let i = 1; i < validData.length; i++) {
    const dailyReturn = ((validData[i].nav - validData[i-1].nav) / validData[i-1].nav) * 100;
    if (!isNaN(dailyReturn) && isFinite(dailyReturn)) {
      dailyReturns.push(dailyReturn);
    }
  }
  
  const meanReturn = dailyReturns.reduce((a, b) => a + b, 0) / dailyReturns.length;
  const variance = dailyReturns.reduce((a, b) => a + Math.pow(b - meanReturn, 2), 0) / dailyReturns.length;
  const volatility = Math.sqrt(variance);
  
  const highestNAV = Math.max(...validData.map(d => d.nav));
  const lowestNAV = Math.min(...validData.map(d => d.nav));
  const bestDay = dailyReturns.length > 0 ? Math.max(...dailyReturns) : 0;
  const worstDay = dailyReturns.length > 0 ? Math.min(...dailyReturns) : 0;
  
  return {
    totalReturn: totalReturn.toFixed(2),
    oneYearReturn: oneYearReturn ? oneYearReturn.toFixed(2) : null,
    sixMonthReturn: sixMonthReturn ? sixMonthReturn.toFixed(2) : null,
    threeMonthReturn: threeMonthReturn ? threeMonthReturn.toFixed(2) : null,
    volatility: volatility.toFixed(2),
    highestNAV: highestNAV.toFixed(3),
    lowestNAV: lowestNAV.toFixed(3),
    latestNAV: latestNAV.toFixed(3),
    oldestNAV: oldestNAV.toFixed(3),
    dataPoints: validData.length,
    startDate: validData[0].date,
    endDate: validData[validData.length - 1].date,
    bestDay: bestDay.toFixed(2),
    worstDay: worstDay.toFixed(2),
  };
};

const StatCard = ({ icon: Icon, label, value, numericValue, subText, trend, color = "purple" }) => (
  <motion.div variants={itemVariants}>
    <Card className="bg-white/5 border-white/10 hover:border-white/20 transition-all duration-300 group overflow-hidden">
      <CardContent className="p-5">
        <HStack spacing={3} align="start">
          <div className={`w-10 h-10 rounded-lg bg-${color}-500/15 flex items-center justify-center group-hover:scale-105 transition-transform duration-300`}>
            <Icon className={`h-5 w-5 text-${color}-400`} />
          </div>
          <VStack align="start" spacing={0.5} flex={1}>
            <Text color="gray-400" fontSize="xs" letterSpacing="wide" textTransform="uppercase">
              {label}
            </Text>
            <Heading size="sm" color="white" fontWeight="semibold" letterSpacing="tight">
              {numericValue !== undefined ? (
                <NumberTicker
                  value={numericValue}
                  className="text-white font-semibold"
                  decimalPlaces={label === "Current NAV" ? 3 : 2}
                  prefix={label === "Current NAV" ? "₹" : ""}
                  suffix={label !== "Current NAV" && label !== "NAV Range" ? "%" : ""}
                />
              ) : (
                value
              )}
            </Heading>
            {subText && (
              <Text color="gray-500" fontSize="xs">
                {subText}
              </Text>
            )}
            {trend !== undefined && trend !== null && (
              <Badge
                bg={trend >= 0 ? "emerald-500/15" : "rose-500/15"}
                color={trend >= 0 ? "emerald-400" : "rose-400"}
                borderRadius="full"
                px={2}
                py={0.5}
                fontSize="xs"
                fontWeight="medium"
              >
                {trend >= 0 ? "+" : ""}{trend}%
              </Badge>
            )}
          </VStack>
        </HStack>
      </CardContent>
    </Card>
  </motion.div>
);

const MetricChip = ({ period, value, numericValue, isPositive }) => (
  <motion.div variants={itemVariants}>
    <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300">
      <CardContent className="p-3 text-center">
        <Text color="gray-400" fontSize="xs" mb={0.5} letterSpacing="wide">
          {period}
        </Text>
        <Text
          fontSize="lg"
          fontWeight="semibold"
          color={isPositive ? "emerald-400" : "rose-400"}
          fontFamily="mono"
        >
          {numericValue !== undefined ? (
            <NumberTicker
              value={numericValue}
              className={`${isPositive ? "text-emerald-400" : "text-rose-400"} font-semibold`}
              decimalPlaces={2}
              suffix="%"
            />
          ) : (
            `${value}%`
          )}
        </Text>
      </CardContent>
    </Card>
  </motion.div>
);

const FundDetail = () => {
  const { schemeCode } = useParams();
  const navigate = useNavigate();
  const [fundData, setFundData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [performanceMetrics, setPerformanceMetrics] = useState(null);
  const toast = useToast();

  useEffect(() => {
  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch fund details
      const response = await fundsAPI.getDetails(schemeCode);

      const data = response.data.data;

      setFundData(data);

      // Calculate metrics immediately after fetch
      const metrics = calculatePerformanceMetrics(data.data);

      setPerformanceMetrics(metrics);

      // Optional warning
      if (!metrics) {
        toast({
          title: "Data Warning",
          description: "Some date information may be incomplete",
          status: "warning",
          duration: 4000,
          isClosable: true,
          position: "top-right",
        });
      }
    } catch (err) {
      console.error("Failed to fetch fund details:", err);

      setError(
        err.message || "Failed to load fund details"
      );

      toast({
        title: "Error",
        description:
          err.message || "Failed to load fund details",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  fetchAllData();
}, [schemeCode, toast]);
  const fetchFundDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fundsAPI.getDetails(schemeCode);
      setFundData(response.data.data);
      
      const metrics = calculatePerformanceMetrics(response.data.data.data);
      setPerformanceMetrics(metrics);
      
      if (!metrics) {
        toast({
          title: "Data Warning",
          description: "Some date information may be incomplete",
          status: "warning",
          duration: 4000,
          isClosable: true,
          position: "top-right",
        });
      }
    } catch (err) {
      console.error("Failed to fetch fund details:", err);
      setError(err.message || "Failed to load fund details");
      toast({
        title: "Error",
        description: err.message || "Failed to load fund details",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  const getSchemeName = () => {
    if (fundData?.meta?.scheme_name) {
      return fundData.meta.scheme_name;
    }
    return `Scheme ${schemeCode}`;
  };

  const getFundHouse = () => {
    if (fundData?.meta?.fund_house) {
      return fundData.meta.fund_house;
    }
    return "Not available";
  };

  const formatChartData = () => {
    if (!fundData?.data) return [];

    const now = new Date();
    const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    return [...fundData.data]
      .filter(item => {
        const date = parseDate(getNavItemDateValue(item));
        return (
          date &&
          date <= todayEnd &&
          typeof item.nav === 'number' &&
          !isNaN(item.nav)
        );
      })
      .sort((a, b) => {
        const dateA = parseDate(getNavItemDateValue(a));
        const dateB = parseDate(getNavItemDateValue(b));
        if (!dateA || !dateB) return 0;
        return dateA - dateB;
      })
      .map(item => {
        const date = parseDate(getNavItemDateValue(item));
        return {
          // use a numeric timestamp to avoid any further string parsing ambiguity downstream
          date: date ? date.getTime() : null,
          value: item.nav,
        };
      })
      .filter(d => typeof d.date === 'number');
  };

  if (loading) {
    return (
      <Box minH="100vh" bg="#0a0c10">
        <Container maxW="7xl" py={20}>
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="mb-6"
            >
              <div className="w-10 h-10 border-2 border-purple-500/30 border-t-purple-500 rounded-full" />
            </motion.div>
            <Text color="gray-400" fontSize="sm">Loading fund data...</Text>
          </div>
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Box minH="100vh" bg="#0a0c10">
        <Container maxW="5xl" py={20}>
          <ErrorAlert
            message={error}
            onRetry={fetchFundDetails}
            onDismiss={() => navigate("/")}
          />
          <Flex justify="center" mt={8}>
            <Button asChild variant="outline" className="rounded-full">
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
          </Flex>
        </Container>
      </Box>
    );
  }

  if (!fundData || !fundData.data || fundData.data.length === 0) {
    return (
      <Box minH="100vh" bg="#0a0c10">
        <Container maxW="5xl" py={20}>
          <Card className="text-center p-12 border-0 bg-white/5 backdrop-blur-sm">
            <CardContent className="pt-8">
              <div className="inline-flex p-4 bg-white/5 rounded-full mb-6">
                <LineChart className="h-8 w-8 text-gray-500" />
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">No NAV Data Available</h2>
              <p className="text-gray-500 mb-6 text-sm">
                Historical NAV data is currently unavailable for this mutual fund scheme.
              </p>
              <Button asChild variant="default" className="rounded-full">
                <Link to="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Link>
              </Button>
            </CardContent>
          </Card>
        </Container>
      </Box>
    );
  }

  const isPositiveReturn = performanceMetrics?.totalReturn > 0;
  const chartData = formatChartData();

  return (
    <Box minH="100vh" bg="#0a0c10" pb={16}>
      <Container maxW="7xl" position="relative" zIndex={1} py={{ base: 6, md: 10 }}>
        
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Breadcrumb mb={6} fontSize="xs" color="gray-500">
            <BreadcrumbItem>
              <BreadcrumbLink as={Link} to="/" _hover={{ color: "purple-400" }}>
                Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink color="gray-400">Fund Details</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        </motion.div>

        {/* Hero Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <MagicCard className="mb-8 p-6 bg-white/5 backdrop-blur-sm border-white/10">
            <div className="relative">
              <GlowingEffect
                blur={0}
                spread={30}
                glow={true}
                disabled={false}
                proximity={50}
                borderWidth={1}
                variant="purple"
              />
              
              <Flex
                justify="space-between"
                align={{ base: "flex-start", lg: "center" }}
                direction={{ base: "column", lg: "row" }}
                gap={5}
                mb={6}
              >
                <VStack align="flex-start" spacing={3} maxW="4xl">
                  <motion.div variants={itemVariants}>
                    <Badge
                      px={3}
                      py={0.5}
                      borderRadius="full"
                      fontSize="2xs"
                      letterSpacing="wider"
                      bg="purple-500/15"
                      color="purple-300"
                      textTransform="uppercase"
                    >
                      Mutual Fund Analytics
                    </Badge>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <h1 className="text-2xl md:text-4xl lg:text-5xl font-semibold tracking-tight leading-tight">
                      <AuroraText>
                        {getSchemeName().length > 80 ? getSchemeName().substring(0, 80) + "..." : getSchemeName()}
                      </AuroraText>
                    </h1>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Text color="gray-500" fontSize="sm" maxW="3xl" leading="relaxed">
                      Comprehensive NAV performance analytics with interactive visualization and historical trend analysis.
                    </Text>
                  </motion.div>
                </VStack>

                <motion.div variants={itemVariants}>
                  <Button asChild variant="outline" className="rounded-full border-white/15 hover:bg-white/10 text-sm">
                    <Link to="/">
                      <ArrowLeft className="mr-2 h-3.5 w-3.5" />
                      Dashboard
                    </Link>
                  </Button>
                </motion.div>
              </Flex>

              <Divider borderColor="white/5" my={5} />

              {/* Stats Grid */}
              <motion.div variants={containerVariants}>
                <Grid
                  templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
                  gap={4}
                  mb={6}
                >
                  <motion.div variants={itemVariants}>
                    <Card className="bg-white/5 border-white/10 hover:border-white/20 transition-all duration-300">
                      <CardContent className="p-5">
                        <HStack spacing={3} align="center">
                          <div className="w-8 h-8 rounded-lg bg-blue-500/15 flex items-center justify-center">
                            <Landmark className="h-4 w-4 text-blue-400" />
                          </div>
                          <div>
                            <Text color="gray-500" fontSize="xs" letterSpacing="wide">Scheme Code</Text>
                            <Text color="white" fontSize="sm" fontFamily="mono" fontWeight="medium">
                              {schemeCode}
                            </Text>
                          </div>
                        </HStack>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Card className="bg-white/5 border-white/10 hover:border-white/20 transition-all duration-300">
                      <CardContent className="p-5">
                        <HStack spacing={3} align="center">
                          <div className="w-8 h-8 rounded-lg bg-purple-500/15 flex items-center justify-center">
                            <Building2 className="h-4 w-4 text-purple-400" />
                          </div>
                          <div>
                            <Text color="gray-500" fontSize="xs" letterSpacing="wide">Fund House</Text>
                            <Text color="white" fontSize="sm" fontWeight="medium" noOfLines={1}>
                              {getFundHouse()}
                            </Text>
                          </div>
                        </HStack>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Card className="bg-white/5 border-white/10 hover:border-white/20 transition-all duration-300">
                      <CardContent className="p-5">
                        <HStack spacing={3} align="center">
                          <div className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center">
                            <Database className="h-4 w-4 text-amber-400" />
                          </div>
                          <div>
                            <Text color="gray-500" fontSize="xs" letterSpacing="wide">Data Points</Text>
                            <Text color="white" fontSize="sm" fontWeight="medium">
                              {performanceMetrics?.dataPoints?.toLocaleString() || fundData.data.length.toLocaleString()} records
                            </Text>
                            {performanceMetrics?.startDate && (
                              <Text color="gray-600" fontSize="2xs" mt={0.5}>
                                Since {formatDate(performanceMetrics.startDate)}
                              </Text>
                            )}
                          </div>
                        </HStack>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              </motion.div>

              {/* Key Metrics with Number Ticker */}
              {performanceMetrics && (
                <Grid templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }} gap={4}>
                  <StatCard
                    icon={DollarSign}
                    label="Current NAV"
                    numericValue={parseFloat(performanceMetrics.latestNAV)}
                    subText={formatDate(performanceMetrics.endDate)}
                    color="emerald"
                  />
                  <StatCard
                    icon={TrendingUp}
                    label="Total Return"
                    numericValue={parseFloat(performanceMetrics.totalReturn)}
                    trend={parseFloat(performanceMetrics.totalReturn)}
                    color="purple"
                  />
                  <StatCard
                    icon={Activity}
                    label="Volatility"
                    numericValue={parseFloat(performanceMetrics.volatility)}
                    subText="Daily std dev"
                    color="orange"
                  />
                  <StatCard
                    icon={Award}
                    label="NAV Range"
                    value={`₹${performanceMetrics.lowestNAV} – ₹${performanceMetrics.highestNAV}`}
                    subText="Historical"
                    color="blue"
                  />
                </Grid>
              )}
            </div>
          </MagicCard>
        </motion.div>

        {/* Chart Section with InteractiveLineChart */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="mb-8"
        >
          <Card className="bg-white/5 border-white/10 overflow-hidden">
            <CardContent className="p-5">
              <InteractiveLineChart
                data={chartData}
                xAxisKey="date"
                lineKey="value"
                lineColor="#a78bfa"
                gradientFrom="#a78bfa"
                gradientTo="#c084fc"
                height={420}
                title="Net Asset Value (NAV) Historical Performance"
                valuePrefix="₹"
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Period Returns with Number Ticker */}
        {performanceMetrics && (
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="mb-4">
              <HStack spacing={2}>
                <Calendar className="h-4 w-4 text-purple-400" />
                <Text color="white" fontSize="sm" fontWeight="medium">
                  Period Returns
                </Text>
              </HStack>
            </div>
            <Grid templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }} gap={3}>
              <MetricChip
                period="3 Months"
                numericValue={performanceMetrics.threeMonthReturn ? parseFloat(performanceMetrics.threeMonthReturn) : null}
                value={performanceMetrics.threeMonthReturn || "N/A"}
                isPositive={performanceMetrics.threeMonthReturn > 0}
              />
              <MetricChip
                period="6 Months"
                numericValue={performanceMetrics.sixMonthReturn ? parseFloat(performanceMetrics.sixMonthReturn) : null}
                value={performanceMetrics.sixMonthReturn || "N/A"}
                isPositive={performanceMetrics.sixMonthReturn > 0}
              />
              <MetricChip
                period="1 Year"
                numericValue={performanceMetrics.oneYearReturn ? parseFloat(performanceMetrics.oneYearReturn) : null}
                value={performanceMetrics.oneYearReturn || "N/A"}
                isPositive={performanceMetrics.oneYearReturn > 0}
              />
              <MetricChip
                period="Best Day"
                numericValue={parseFloat(performanceMetrics.bestDay)}
                value={performanceMetrics.bestDay}
                isPositive={true}
              />
            </Grid>
          </motion.div>
        )}

        {/* Risk & Insights */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
        >
          <Grid templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }} gap={5}>
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-5">
                <HStack spacing={2} mb={4}>
                  <Shield className="h-4 w-4 text-purple-400" />
                  <Heading size="xs" color="white" fontWeight="medium">
                    Risk Assessment
                  </Heading>
                </HStack>
                <VStack align="flex-start" spacing={3}>
                  <Flex justify="space-between" w="full">
                    <Text color="gray-500" fontSize="xs">Risk Level</Text>
                    <Badge
                      bg={Math.abs(performanceMetrics?.volatility) > 2 ? "rose-500/15" : Math.abs(performanceMetrics?.volatility) > 1 ? "amber-500/15" : "emerald-500/15"}
                      color={Math.abs(performanceMetrics?.volatility) > 2 ? "rose-400" : Math.abs(performanceMetrics?.volatility) > 1 ? "amber-400" : "emerald-400"}
                      borderRadius="full"
                      px={2}
                      py={0.5}
                      fontSize="2xs"
                    >
                      {Math.abs(performanceMetrics?.volatility) > 2 ? "High" : Math.abs(performanceMetrics?.volatility) > 1 ? "Medium" : "Low"}
                    </Badge>
                  </Flex>
                  <Flex justify="space-between" w="full">
                    <Text color="gray-500" fontSize="xs">Daily Volatility</Text>
                    <Text color="white" fontFamily="mono" fontSize="sm">
                      {performanceMetrics?.volatility}%
                    </Text>
                  </Flex>
                  <Flex justify="space-between" w="full">
                    <Text color="gray-500" fontSize="xs">Worst Day Return</Text>
                    <Text color="rose-400" fontFamily="mono" fontSize="sm">
                      {performanceMetrics?.worstDay}%
                    </Text>
                  </Flex>
                </VStack>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-5">
                <HStack spacing={2} mb={4}>
                  <Eye className="h-4 w-4 text-purple-400" />
                  <Heading size="xs" color="white" fontWeight="medium">
                    Investment Insights
                  </Heading>
                </HStack>
                <VStack align="flex-start" spacing={3}>
                  <Text color="gray-400" fontSize="xs" leading="relaxed">
                    • Total return of <span className={isPositiveReturn ? "text-emerald-400" : "text-rose-400"}>{performanceMetrics?.totalReturn}%</span> over the tracked period.
                  </Text>
                  <Text color="gray-400" fontSize="xs" leading="relaxed">
                    • Daily volatility of {performanceMetrics?.volatility}% suggests {Math.abs(performanceMetrics?.volatility) > 1.5 ? "moderate to high" : "relatively stable"} price movements.
                  </Text>
                  <Text color="gray-400" fontSize="xs" leading="relaxed">
                    • {performanceMetrics?.oneYearReturn ? `1-year return of ${performanceMetrics.oneYearReturn}%` : "Recent performance"} compared to market benchmarks.
                  </Text>
                </VStack>
              </CardContent>
            </Card>
          </Grid>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <Flex
            mt={10}
            justify="space-between"
            align={{ base: "flex-start", md: "center" }}
            direction={{ base: "column", md: "row" }}
            gap={3}
            className="border-t border-white/10 pt-6"
          >
            <HStack spacing={2} align="center">
              <TrendingUp className="h-3.5 w-3.5 text-gray-600" />
              <Text color="gray-600" fontSize="2xs" lineHeight="tall">
                NAV data sourced from MFAPI. Historical performance does not guarantee future results.
              </Text>
            </HStack>
            <Badge
              bg="white/5"
              color="gray-500"
              borderRadius="full"
              px={3}
              py={1}
              fontSize="2xs"
              fontWeight="normal"
            >
              Powered by MFAPI
            </Badge>
          </Flex>
        </motion.div>
      </Container>
    </Box>
  );
};

export default FundDetail;