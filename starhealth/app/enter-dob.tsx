import React, { useState } from "react";
import { Text, TouchableOpacity, StyleSheet, Alert, View, Platform } from "react-native";
import DatePicker from "react-native-date-picker";
import { useRouter, useLocalSearchParams } from "expo-router";
import ScreenWrapper from "../components/ScreenWrapper";

export default function EnterDOB() {
  const router = useRouter();
  const { email, password, name } = useLocalSearchParams<{ email?: string; password?: string; name?: string }>();

  const [dob, setDob] = useState(new Date(2000, 0, 1));
  const [open, setOpen] = useState(false);

  const handleNext = () => {
    if (!email || !password || !name) {
      Alert.alert("Error", "Missing registration info");
      return;
    }

    const formattedDob = dob.toISOString().split("T")[0];

    // push to next step and pass accumulated params
    router.push({
      pathname: "/enter-disease",
      params: { email, password, name, dob: formattedDob },
    } as any);
  };

  return (
    <ScreenWrapper>
      <Text style={styles.title}>Enter your date of birth</Text>

      {Platform.OS === "web" ? (
        <View style={styles.input}>
          <input
            type="date"
            value={dob.toISOString().split("T")[0]}
            onChange={(e) => setDob(new Date(e.target.value))}
            style={{ fontSize: 16, padding: 8, borderRadius: 6, width: '100%' }}
          />
        </View>
      ) : (
        <>
          <TouchableOpacity style={styles.input} onPress={() => setOpen(true)}>
            <Text style={{ color: "#fff", fontSize: 16 }}>{dob.toDateString()}</Text>
          </TouchableOpacity>

          <DatePicker modal open={open} date={dob} mode="date"
            onConfirm={(date) => { setOpen(false); setDob(date); }}
            onCancel={() => setOpen(false)}
          />
        </>
      )}

      <TouchableOpacity style={styles.primaryButton} onPress={handleNext}>
        <Text style={styles.primaryButtonText}>Next</Text>
      </TouchableOpacity>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: "700", color: "#fff", textAlign: "center", marginBottom: 10 },
  input: { backgroundColor: "rgba(28,28,60,0.8)", padding: 14, borderRadius: 10, marginBottom: 30, width: "100%" },
  primaryButton: { backgroundColor: "#d45425", paddingVertical: 16, borderRadius: 12, alignItems: "center", width: "100%" },
  primaryButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
