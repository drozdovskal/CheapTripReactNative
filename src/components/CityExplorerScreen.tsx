import React from 'react';
import { View, Text } from 'react-native';

const CityExplorerScreen: React.FC = () => {
  const cityData = {
    cityName: 'Kyiv',
    population: 2800000,
    attractions: ['Independence Square', 'Saint Sophia Cathedral', 'Kyiv Pechersk Lavra'],
  };

  return (
    <View>
      <Text>City Name: {cityData.cityName}</Text>
      <Text>Population: {cityData.population}</Text>
      <Text>Attractions: {cityData.attractions.join(', ')}</Text>
    </View>
  );
};

export default CityExplorerScreen;
