import React, { useState, useEffect, FC, useCallback } from "react";
import { View, StyleSheet } from "react-native";
import { Text, useTheme, Button } from "react-native-paper";
import { FlatList } from "react-native-gesture-handler";
import Autocomplete from "react-native-autocomplete-input";
import { FontAwesome5 } from "@expo/vector-icons";
import ListComponent from "../components/ListComponent/ListComponent";

interface Location {
  id: string;
  name: string;
  country_id: number;
}

interface Direction {
  id: string;
  from_location: number;
  to_location: number;
  price: number;
  duration: number;
  direct_routes: string[];
}

export const Home: FC = () => {
  const [forCity, setForCity] = useState("");
  const [toCity, setToCity] = useState("");
  const [locations, setLocations] = useState<Location[]>([]);
  const [hideForCity, setHideForCity] = useState(false);
  const [hideToCity, setHideToCity] = useState(false);
  const [onSubmit, setOnSubmit] = useState(false);
  const [directions, setDirections] = useState<Direction[]>([]);
  const theme = useTheme();

  const fetchLocations = async () => {
    try {
      const response = await fetch("https://cheaptrip.pythonanywhere.com/api/locations/");
      const data = await response.json();
      setLocations(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const filteredLocations = (input: string) => {
    if (input) {
      const filtered = locations.filter((location) =>
        location.name.toLowerCase().startsWith(input.toLowerCase())
      );
      return filtered;
    }
    return [];
  };

  const dataForCity = filteredLocations(forCity);
  const dataToCity = filteredLocations(toCity);

  const renderItem = useCallback(({ item }) => {
    return <ListComponent toCity={toCity} forCity={forCity} item={item} />;
  }, []);

  const sendPostRequest = async () => {
    try {
      const fromLocation = dataForCity.length > 0 ? dataForCity[0].country_id : null;
      const toLocation = dataToCity.length > 0 ? dataToCity[0].country_id : null;

      if (fromLocation && toLocation) {
        const response = await fetch("https://cheaptrip.pythonanywhere.com/api/routes/", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from_location: fromLocation,
            to_location: toLocation,
          }),
        });
        const data = await response.json();
        // Process the response data from the server
        console.log('Response received:', data);

        // Update the directions state with the received routes
        setDirections(data.routes);
        setOnSubmit(true);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  const onSubmitAction = () => {
    console.log("Pressed");
    setOnSubmit(true);
    sendPostRequest(); // Call the function to execute the POST request
  };
  

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text
          style={{
            ...styles.title,
            color: theme.colors.secondary,
            textAlign: "center",
          }}
          variant="titleMedium"
        >
          Find the most beneficial and unusual routes between cities with airports, combiningflight, train, bus, ferry, and rideshare.
        </Text>
      </View>
      <View style={styles.inputContainer}>
        <Autocomplete
          containerStyle={styles.autocompleteContainer}
          listStyle={styles.autocompleteList}
          hideResults={hideForCity}
          data={dataForCity}
          value={forCity}
          onChangeText={(text: string) => {
            setForCity(text);
            setHideForCity(false);
          }}
          flatListProps={{
            keyExtractor: (item) => item.id,
            renderItem: ({ item }) => (
              <Text
                onPress={() => {
                  setForCity(item.name);
                  setHideForCity(true);
                }}
                style={styles.autocompleteText}
              >
                {item.name}
              </Text>
            ),
          }}
        />
        <FontAwesome5
          style={styles.iconArrow}
          name="angle-double-down"
          size={24}
          color={theme.colors.primary}
        />
        <Autocomplete
          containerStyle={styles.autocompleteContainer}
          listStyle={styles.autocompleteList}
          hideResults={hideToCity}
          data={dataToCity}
          value={toCity}
          onChangeText={(text: string) => {
            setToCity(text);
            setHideToCity(false);
          }}
          flatListProps={{
            keyExtractor: (item) => item.id,
            renderItem: ({ item }) => (
              <Text
                onPress={() => {
                  setToCity(item.name);
                  setHideToCity(true);
                }}
                style={styles.autocompleteText}
              >
                {item.name}
              </Text>
            ),
          }}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          icon="delete"
          mode="elevated"
          onPress={() => {
            setForCity("");
            setToCity("");
            setOnSubmit(false);
          }}
          style={styles.button}
        >
          Clear
        </Button>
        <Button
          icon="car"
          mode="contained"
          onPress={onSubmitAction}
          style={styles.button}
        >
          Let's go
        </Button>
      </View>
      {onSubmit && (
        <View style={styles.flatList}>
          <FlatList
            data={directions}
            renderItem={({ item }) => (
              <View>
                <Text>For city: {item.from_location}</Text>
                <Text>To city: {item.to_location}</Text>
                <Text>Price: {item.price}</Text>
                <Text>Duration: {item.duration} minutes</Text>
              </View>
            )}
            keyExtractor={(item) => item.id}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  titleContainer: {
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 16,
  },
  autocompleteContainer: {
    width: "100%",
    backgroundColor: "tomato",
  },
  autocompleteList: {},
  autocompleteText: {
    padding: 10,
    fontSize: 16,
    backgroundColor: "tomato",
    color: "white",
  },
  iconArrow: {
    marginTop: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 8,
  },
  button: {
    marginHorizontal: 34,
  },
  flatList: {
    flex: 1,
    width: "100%",
  },
  title: {
    padding: 0,
    margin: 0,
    textAlign: "center",
  },
});

export default Home;