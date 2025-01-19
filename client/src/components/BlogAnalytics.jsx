import React from 'react';
import { Box, Stat, StatLabel, StatNumber, StatHelpText, SimpleGrid } from '@chakra-ui/react';

function BlogAnalytics({ analytics }) {
  return (
    <SimpleGrid columns={[1, 2, 3]} spacing={6}>
      <Stat>
        <StatLabel>Total Views</StatLabel>
        <StatNumber>{analytics.views}</StatNumber>
        <StatHelpText>+{analytics.viewsGrowth}% growth</StatHelpText>
      </Stat>

      <Stat>
        <StatLabel>Engagement Rate</StatLabel>
        <StatNumber>{analytics.engagementRate}%</StatNumber>
        <StatHelpText>+{analytics.engagementGrowth}% growth</StatHelpText>
      </Stat>

      <Stat>
        <StatLabel>Translation Score</StatLabel>
        <StatNumber>{analytics.translationScore}%</StatNumber>
      </Stat>
    </SimpleGrid>
  );
}

export default BlogAnalytics;
