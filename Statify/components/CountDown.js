import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const calculateTimeLeft = (endDate) => {
  const difference = +new Date(endDate) - +new Date();
  let timeLeft = {};

  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  return timeLeft;
};

const CountDown = () => {
  // Simulate fetching start and end dates from a JSON file
  const [startDate, setStartDate] = useState("2024-02-01T00:00:00Z");
  const [endDate, setEndDate] = useState("2024-02-08T00:00:00Z");
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(endDate));
  const [isVisible, setIsVisible] = useState(false);

  const showVisibility = () => {
    setIsVisible(!isVisible);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const newTimeLeft = calculateTimeLeft(endDate);
      setTimeLeft(newTimeLeft);

      // Check if countdown has ended
      if (!Object.keys(newTimeLeft).length) {
        const newStartDate = new Date(endDate);
        const newEndDate = new Date(newStartDate).setDate(
          newStartDate.getDate() + 7
        );

        setStartDate(newStartDate.toISOString());
        setEndDate(new Date(newEndDate).toISOString());
      }
    }, 1000);

    return () => clearTimeout(timer);
  });

  return (
    <View>
      <TouchableOpacity
        style={styles.CountDownContainer}
        onPress={showVisibility}
      >
        <View style={styles.CountDownHeader}>
          <Text style={styles.CountDownTitle}>Next Recap</Text>
        </View>
        {Object.keys(timeLeft).length ? (
          <View style={styles.CountDownTimeContainer}>
            <Text style={[styles.CountDownTime, styles.days]}>
              {timeLeft.days}d
            </Text>
            <Text style={[styles.CountDownTime, styles.hours]}>
              {timeLeft.hours}h
            </Text>
            <Text style={[styles.CountDownTime, styles.minutes]}>
              {timeLeft.minutes}m
            </Text>
            <Text style={[styles.CountDownTime, styles.seconds]}>
              {timeLeft.seconds}s
            </Text>
          </View>
        ) : (
          <Text style={styles.CountDownTime}>00d 00h 00m 00s</Text>
        )}
      </TouchableOpacity>
      {isVisible && (
        <View style={styles.overlay}>
          <View style={styles.InfoContainer}>
            <Text style={styles.InfoText}>
              Every Monday @ 12am MST you'll get a recap of what you and your
              friends listened to last week!
            </Text>
            <TouchableOpacity style={styles.RemindMeBTN}>
              <Text style={styles.NotifyMe}>Notify me</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

export default CountDown;

const styles = StyleSheet.create({
  CountDownContainer: {
    backgroundColor: "#004921",
    height: 130,
    padding: 15,
    borderRadius: 8,
    margin: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  CountDownHeader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "10px, space-between",
    width: "100%",
  },
  CountDownTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff9f0",
  },
  CountDownTimeContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    padding: 15,
  },
  CountDownTime: {
    fontSize: 25,
    color: "#fff9f0",
    top: 10,
    fontWeight: "bold",
  },
  // this needs to be moved to the app.js file so that it covers the full screen
  InfoContainer: {
    flex: 0,
    backgroundColor: "#8a5082",
    height: 225,
    width: "auto",
    padding: 8,
    borderRadius: 8,
    margin: 10,
    alignItems: "center",
    bottom: 50,
  },
  InfoText: {
    color: "#fff9f0",
    textAlign: "center",
    padding: 10,
    fontSize: 22,
    fontWeight: "bold",
  },
  RemindMeBTN: {
    backgroundColor: "#fff9f0",
    marginTop: 10,
    width: "40%",
    padding: 15,
    borderColor: "blue",
    borderRadius: 15,
  },
  NotifyMe: {
    color: "#8a5082",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent black
  },
});
