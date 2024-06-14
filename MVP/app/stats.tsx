import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { useRouter } from 'expo-router';

function Stats() {
    
    const router = useRouter();
    return (
        <View style={styles.container}>
            
            <Text>We're working on it!</Text>
            
            <TouchableOpacity style={styles.navigationButton} onPress={() => router.push('/home')}>
                <Text style={styles.text}>Home</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 50,
      },
    navigation: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
    },
    navigationButton: {
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 5,
    },
    text: {
        color: 'white',
    }
});

export default Stats;