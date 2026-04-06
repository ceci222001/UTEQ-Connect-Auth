import React, { useEffect, useRef } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, AppState } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { io, Socket } from "socket.io-client";
import styles from "../styles/ProfileScreenStyle";
import EventTicketSection from "../Components/profile/EventTicketSection";
import { API_URL } from "../api/config";

const ProfileScreen = ({ navigation, setIsLoggedIn }: {
  navigation: any;
  setIsLoggedIn: (value: boolean) => void;
}) => {
  const [userData, setUserData] = React.useState<{
    token: string | null;
    userName: string | null;
    userEmail: string | null;
  } | null>(null);

  const [ticketRefreshKey, setTicketRefreshKey] = React.useState(0);

  const refreshTickets = () => setTicketRefreshKey((k) => k + 1);

  // Refresca datos cuando la pantalla gana foco
  useFocusEffect(
    React.useCallback(() => {
      getDataFromStorage();
      // También refresca boletos al volver a esta pantalla (ej: después de registrarse)
      refreshTickets();
    }, [])
  );

  // Refresca cuando vuelve del background
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextState) => {
      if (nextState === "active") {
        console.log("ProfileScreen: app volvió al frente, refrescando...");
        getDataFromStorage();
        refreshTickets();
      }
    });
    return () => subscription.remove();
  }, []);

  // Socket.io — escucha cambios de eventos Y de boletos en tiempo real
  useEffect(() => {
    console.log("ProfileScreen Socket: conectando a", API_URL.replace("/api", ""));
    const socket: Socket = io(API_URL.replace("/api", ""), {
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("ProfileScreen Socket: conectado ✅", socket.id);
    });

    // ── Eventos de tickets (los más importantes para esta pantalla) ──

    // Nuevo boleto creado → el usuario acaba de registrarse a un evento
    socket.on("ticket_created", (data) => {
      console.log("ProfileScreen Socket: 🎟️ ticket creado", data);
      refreshTickets();
    });

    // Boleto actualizado → aceptó/rechazó, asistencia marcada, QR regenerado
    socket.on("ticket_updated", (data) => {
      console.log("ProfileScreen Socket: ✏️ ticket actualizado", data);
      refreshTickets();
    });

    // QR escaneado desde el dashboard → asistencia registrada en tiempo real
    socket.on("ticket_scanned", (data) => {
      console.log("ProfileScreen Socket: 📷 ticket escaneado", data);
      refreshTickets();
    });

    // ── Eventos de eventos (afectan info mostrada en los boletos) ──

    socket.on("event_created", (data) => {
      console.log("ProfileScreen Socket: 🆕 evento creado", data);
      getDataFromStorage();
      refreshTickets();
    });

    socket.on("event_updated", (data) => {
      console.log("ProfileScreen Socket: ✏️ evento actualizado", data);
      getDataFromStorage();
      refreshTickets();
    });

    socket.on("event_deleted", (data) => {
      console.log("ProfileScreen Socket: 🗑️ evento eliminado", data);
      getDataFromStorage();
      refreshTickets();
    });

    socket.on("disconnect", () => {
      console.log("ProfileScreen Socket: desconectado ❌");
    });

    socket.on("connect_error", (error) => {
      console.log("ProfileScreen Socket: error de conexión ❌", error.message);
    });

    return () => {
      console.log("ProfileScreen Socket: cerrando conexión");
      socket.disconnect();
    };
  }, []);

  const getDataFromStorage = async () => {
    const token = await AsyncStorage.getItem("userToken");
    const userName = await AsyncStorage.getItem("userName");
    const userEmail = await AsyncStorage.getItem("userEmail");
    setUserData({ token, userName, userEmail });

    if (token) {
      try {
        const res = await fetch(`${API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) {
          await AsyncStorage.setItem("userName", data.data.nombre);
          await AsyncStorage.setItem("userEmail", data.data.email);
          setUserData({ token, userName: data.data.nombre, userEmail: data.data.email });
        }
      } catch (_) {}
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.multiRemove([
      "userToken", "userId", "userEmail", "userName", "userRol",
    ]);
    setIsLoggedIn(false);
    navigation.navigate("Index");
  };

  return (
    <View style={styles.container}>

      {/* Header azul fijo */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mi Perfil</Text>
        <View style={styles.headerLogo}>
          <MaterialCommunityIcons name="map-marker-check" size={18} color="#fff" />
          <Text style={styles.headerLogoText}>UTEQ</Text>
          <Text style={styles.headerLogoSubText}>Connect</Text>
        </View>
      </View>

      {/* Cuerpo blanco */}
      <View style={styles.body}>

        {/* Avatar flotando sobre el borde */}
        <View style={styles.avatarRow}>
          <View style={styles.avatarWrapper}>
            <Image
              style={styles.avatar}
              source={{
                uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9V9bFqFOyNixRcgyVHHTi9CI4nfB49BlcgA&s",
              }}
            />
            <TouchableOpacity style={styles.editAvatarButton} activeOpacity={0.8}>
              <MaterialCommunityIcons name="pencil" size={14} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Contenido con scroll */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.bodyContent}
        >
          {/* Nombre y rol */}
          <Text style={styles.name}>{userData?.userName ?? "—"}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Alumno</Text>
          </View>

          {/* Info rows */}
          <View style={styles.infoSection}>
            <View style={[styles.infoRow, styles.infoRowBorder]}>
              <View style={styles.infoIconBox}>
                <MaterialCommunityIcons name="email-outline" size={19} color="#1D356B" />
              </View>
              <View style={styles.infoTextGroup}>
                <Text style={styles.infoLabel}>Correo electrónico</Text>
                <Text style={styles.infoValue}>{userData?.userEmail ?? "—"}</Text>
              </View>
            </View>
          </View>

          {/* Cerrar sesión */}
          <TouchableOpacity
            style={styles.logoutButton}
            activeOpacity={0.85}
            onPress={handleLogout}
          >
            <MaterialCommunityIcons name="logout" size={18} color="#fff" />
            <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
          </TouchableOpacity>

          {/* Boletos — key fuerza re-mount cuando cambia cualquier ticket o evento */}
          <View style={styles.ticketsSection}>
            <EventTicketSection key={ticketRefreshKey} />
          </View>
        </ScrollView>

      </View>
    </View>
  );
};

export default ProfileScreen;