
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import QuestionContainer from './Questions';
import SignupAndLogin from './../components/signup';
import Practice from './../components/Practice';
import Ranked from './../components/Ranked';
//import HomePage from '@/components/HomePage';
import {HelloWave} from './../components/HelloWave';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useRouter } from 'expo-router';
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomePage() {
    const router = useRouter();

    return (
        <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={() => router.push('/squawk')}>
                <Text style={styles.buttonText}>Squawk</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => router.push('/stats')}>
                <Text style={styles.buttonText}>Stats</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => router.push('/milestones')}>
                <Text style={styles.buttonText}>Milestones</Text>
            </TouchableOpacity>
        </View>
    );
}

export default HomePage;

const styles = StyleSheet.create({
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
    },
    button: {
        backgroundColor: 'blue',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
