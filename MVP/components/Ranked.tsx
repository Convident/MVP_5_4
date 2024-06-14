import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import {createNativeStackNavigator} from '@react-navigation/native-stack';


function Ranked() {
    return (
        <View>
            
            <Text>We're working on it!</Text>
        </View>
    );
};

const styles = StyleSheet.create({
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

export default Ranked;