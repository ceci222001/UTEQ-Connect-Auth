import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../styles/HomeScreenStyle';
import api from '../api/axios';
import calendario1 from '../assets/calendario.png';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from '../types/navigation';
import Most_visited from '../Components/most_visited/Most_visited';



type HomeScreenProps = {
  navigation: BottomTabNavigationProp<MainTabParamList, 'HomeTab'>;
  setIsLoggedIn: (value: boolean) => void;
};

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.9;

const API_BASE_URL = 'http://192.168.100.42:3000';

const HomeScreen = ({ navigation, setIsLoggedIn }: HomeScreenProps) => {
  const [destinations, setDestinations] = useState([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [userName, setUserName] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    loadUserData();

    fetchDestinations();
  }, []);

  const loadUserData = async () => {
    try {
      const userName = await AsyncStorage.getItem('userName');
      if (userName) {
        setUserName(userName);
      } else {
        setUserName('Usuario');
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      setUserName('Usuario');
    }
  };

  const FEATURED_DESTINATION_IDS = [
    '6',
    '25',
    '12',
    '16',
    '38',
    '17',
  ];

  const fetchDestinations = async () => {
    try {
      const response = await api.get('/locations');
      const allData = response.data.data;

      console.log('📍 Total destinos recibidos:', allData.length);

      const filteredDestinations = allData.filter((destination: any) =>
        FEATURED_DESTINATION_IDS.includes(destination.id)
      );

      console.log('📍 Destinos filtrados:', filteredDestinations.length);

      const sortedDestinations = FEATURED_DESTINATION_IDS
        .map(id => {
          const dest = filteredDestinations.find((d: any) => d.id === id);
          if (dest) {
            console.log(`✅ Destino encontrado - ID: ${id}, Nombre: ${dest.nombre}, Imagen: ${dest.image}`);
          } else {
            console.log(`❌ Destino NO encontrado - ID: ${id}`);
          }
          return dest;
        })
        .filter(dest => dest !== undefined);

      setDestinations(sortedDestinations);
    } catch (error) {
      console.error('❌ Error fetching destinations:', error);
      Alert.alert('Error', 'No se pudieron cargar los destinos');
    } finally {
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDestinations();
  };

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / CARD_WIDTH);
    setActiveSlide(index);
  };

  const handleNavigateToDestination = (destination: any) => {
    navigation.navigate('MapTab', { destination });
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove([
        'userToken',
        'userId',
        'userEmail',
        'userName',
        'userRol'
      ]);

      console.log('Logout exitoso, datos limpiados');
      setIsLoggedIn(false);
    } catch (error) {
      console.error('Error during logout:', error);
      setIsLoggedIn(false);
    }
  };

  // Función para obtener la URL completa de la imagen
  const getImageUrl = (imagePath: string | undefined) => {
    if (!imagePath) {
      console.log('⚠️ No hay imagen para este destino');
      return null;
    }

    // Si la imagen ya es una URL completa, retornarla
    if (imagePath.startsWith('http')) {
      console.log('🌐 Imagen con URL completa:', imagePath);
      return imagePath;
    }

    // Construir URL completa
    const fullUrl = `${API_BASE_URL}/${imagePath}`;
    console.log('🖼️ URL de imagen construida:', fullUrl);
    return fullUrl;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hola </Text>
            <Text style={styles.title}>{userName}</Text>
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={{ color: '#1e3a5f', fontWeight: '700' }}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Destinos más visitados */}
        <Most_visited />

        {/* Calendario */}
        <View style={styles.calendarSection}>
          <Text style={styles.sectionTitle}>Calendario UTEQ 2026</Text>
          <View style={styles.calendarCard}>
            <Image
              source={calendario1}
              style={styles.calendarLargeImage}
              resizeMode="contain"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;