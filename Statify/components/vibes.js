import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import axios from "axios"; // Ensure axios is installed or use fetch

const Vibes = ({ token, timeRange }) => {
  const [vibes, setVibes] = useState([]);
  const [selectedVibe, setSelectedVibe] = useState(null);
  const [vibeDetails, setVibeDetails] = useState([]);

  useEffect(() => {
    if (token) {
      fetchVibes();
    }
  }, [token]);

  const fetchVibes = async () => {
    try {
      // Fetch user's top tracks
      const { data: tracksData } = await axios.get(
        "https://api.spotify.com/v1/me/top/tracks?limit=50",
        {
          headers: { Authorization: `Bearer ${token}` },
          time_range: timeRange,
        }
      );

      // Extract track IDs and fetch their audio features
      const trackIds = tracksData.items.map((track) => track.id).join(",");
      const { data: featuresData } = await axios.get(
        `https://api.spotify.com/v1/audio-features?ids=${trackIds}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Example: Process and categorize vibes based on 'valence' feature for simplicity
      const happyVibes = featuresData.audio_features.filter(
        (feature) => feature.valence > 0.75
      );
      const energeticVibes = featuresData.audio_features.filter(
        (feature) => feature.energy > 0.75
      );

      setVibes([
        { name: "Happy", tracks: happyVibes.slice(0, 4) }, // Limiting to 4 tracks for simplicity
        { name: "Energetic", tracks: energeticVibes.slice(0, 4) },
      ]);
    } catch (error) {
      console.error("Error fetching vibes:", error.message);
    }
  };

  const selectVibe = (vibe) => {
    setSelectedVibe(vibe);
    // This is a simplified example. You'd need additional API calls to match tracks with their names and artists
    setVibeDetails(vibe.tracks); // Directly setting tracks as details for demonstration
  };

  return (
    <ScrollView horizontal={true} style={styles.vibesContainer}>
      {vibes.map((vibe, index) => (
        <TouchableOpacity
          key={index}
          style={styles.vibeContainer}
          onPress={() => selectVibe(vibe)}
        >
          <Text style={styles.vibeText}>{vibe.name}</Text>
        </TouchableOpacity>
      ))}
      {selectedVibe && (
        <View style={styles.vibeDetailsContainer}>
          <Text style={styles.vibeDetailsTitle}>{selectedVibe.name} Vibe</Text>
          {/* Displaying details would require fetching track names and artists */}
          {vibeDetails.map((detail, index) => (
            <Text key={index} style={styles.vibeDetailText}>
              Track {index + 1}
            </Text>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  vibesContainer: {
    flex: 0,
    flexDirection: "row",
    paddingVertical: 20,
  },
  vibeContainer: {
    marginHorizontal: 10,
    backgroundColor: "#004921",
    padding: 10,
    borderRadius: 20,
  },
  vibeText: {
    color: "white",
    fontSize: 16,
  },
  vibeDetailsContainer: {
    padding: 10,
    marginTop: 10,
  },
  vibeDetailsTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  vibeDetailText: {
    fontSize: 16,
    marginTop: 5,
  },
});

export default Vibes;
