
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import QuestionContainer from '../components/Questions';
import SignupAndLogin from './../components/signup';
import Practice from './../components/Practice';
import Ranked from './../components/Ranked';
//import HomePage from '@/components/HomePage';
import {HelloWave} from './../components/HelloWave';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();


export default function Index() {
  return (
      <Tab.Navigator initialRouteName="Squawk">
        <Tab.Screen name="Mcq" children={() => <QuestionContainer questionType="mcq" />}/>
        <Tab.Screen name="Saq" children={() => <QuestionContainer questionType="saq" />}/>
        <Tab.Screen name="Practice" component={Practice} />
        <Tab.Screen name="Squawk" component={HelloWave} />
        <Tab.Screen name="Ranked" component={Ranked} />
      </Tab.Navigator>
  );
}
//<Tab.Screen name="test" component={HelloWave} />
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
/*

      <View style={styles.container}>
        <ScrollView >

        <Text>Convident - Yay!</Text>
        <StatusBar style="auto" />
        <SignupAndLogin />
        <QuestionContainer questionType="saq"/>
        <QuestionContainer questionType="mcq"/>
        </ScrollView>
      </View>
      /*import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import {createNativeStackNavigator} from '@react-navigation/native-stack';


function HomePage() {
    return (
        <View>
            
            <View style={styles.navigation}>
                <TouchableOpacity style={styles.navigationButton}>
                    <Text style={styles.text}>Practice</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navigationButton}>
                    <Text style={styles.text}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navigationButton}>
                    <Text style={styles.text}>Ranked</Text>
                </TouchableOpacity>
            </View>
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

export default HomePage;*/