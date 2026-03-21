import React, { useEffect } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "../styles/ProfileScreenStyle";
import EventTicketSection from "../Components/profile/EventTicketSection";

const ProfileScreen = ({ navigation, setIsLoggedIn }: {
  navigation: any;
  setIsLoggedIn: (value: boolean) => void;
}) => {
  const [userData, setUserData] = React.useState<{
    token: string | null;
    userName: string | null;
    userEmail: string | null;
  } | null>(null);

  useEffect(() => {
    getDataFromStorage();
  }, []);

  const getDataFromStorage = async () => {
    const token = await AsyncStorage.getItem('userToken');
    const userName = await AsyncStorage.getItem('userName');
    const userEmail = await AsyncStorage.getItem('userEmail');
    setUserData({ token, userName, userEmail });
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userId');
    setIsLoggedIn(false);
    navigation.navigate('Index');
  };

  return (
    <View style={styles.container}>

      {/* ── Header FUERA del scroll → siempre visible ── */}
      <View style={styles.header}>
        <View style={styles.headerLogo}>
          <MaterialCommunityIcons name="map-marker-check" size={20} color="#fff" />
          <Text style={styles.headerLogoText}>UTEQ</Text>
          <Text style={styles.headerLogoSubText}>Connect</Text>
        </View>
      </View>

      {/* ── Todo lo demás hace scroll ── */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Tarjeta de perfil — se superpone al header */}
        <View style={styles.content}>

          {/* Avatar flotando sobre la tarjeta */}
          <View style={styles.avatarWrapper}>
            <Image
              style={styles.avatar}
              source={{
                uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9V9bFqFOyNixRcgyVHHTi9CI4nfB49BlcgA&s",
              }}
            />
            <TouchableOpacity style={styles.editAvatarButton} activeOpacity={0.8}>
              <MaterialCommunityIcons name="pencil" size={16} color="#111" />
            </TouchableOpacity>
          </View>

          <Text style={styles.name}>{userData?.userName}</Text>

          <View style={styles.badge}>
            <Text style={styles.badgeText}>Alumno</Text>
          </View>

          <Text style={styles.email}>{userData?.userEmail}</Text>

          <TouchableOpacity
            style={styles.logoutButton}
            activeOpacity={0.8}
            onPress={handleLogout}
          >
            <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>

        {/* Boletos debajo de la tarjeta de perfil */}
        <View style={styles.ticketsSection}>
          <EventTicketSection />
        </View>
      </ScrollView>

    </View>
  );
};

export default ProfileScreen;