import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Import the JSON data
import welcomeData from '../assets/Welcome-Test.json';

type RootStackParamList = {
    Home: undefined;
    Conversation: undefined;
};

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

interface DisplayBoxProps {
    title: string;
    subtitle: string;
    percentage: number;
}

// Paths to the images
const mountainBackground = require('../assets/images/mountain-background.png');
const greenhouseIcon = require('../assets/images/green-house-icon.png');
const conversationIcon = require('../assets/images/conversation-icon.png');
const waffleIcon = require('../assets/images/waffle-icon.png');

const DisplayBox: React.FC<DisplayBoxProps> = ({ title, subtitle, percentage }) => {
    return (
        <TouchableOpacity style={styles.boxContainer} onPress={() => { /* No action on press */ }}>
            <View style={styles.boxContent}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.subtitle}>{subtitle}</Text>
            </View>
            <AnimatedCircularProgress
                size={50}
                width={5}
                fill={percentage}
                tintColor="#4caf50"
                backgroundColor="#e0e0e0"
            >
                {
                    () => (
                        <Text style={styles.percentage}>{percentage}%</Text>
                    )
                }
            </AnimatedCircularProgress>
        </TouchableOpacity>
    );
};

const Home: React.FC = () => {
    const navigation = useNavigation<HomeScreenNavigationProp>();

    // Randomly select a user from the JSON data
    const randomUser = welcomeData[Math.floor(Math.random() * welcomeData.length)];

    const boxesData = [
        { title: "generic title 1", subtitle: "# Min Conversation", percentage: 65 },
        { title: "generic title 2", subtitle: "# Min Conversation", percentage: 85 },
        { title: "generic title 3", subtitle: "# Min Conversation", percentage: 80 },
    ];

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={styles.topContainer}>
                {/* Add the Waffle Icon as a Clickable Button */}
                <TouchableOpacity style={styles.waffleButton} onPress={() => { /* No action for now */ }}>
                    <Image source={waffleIcon} style={styles.waffleIcon} />
                </TouchableOpacity>
                {/* Add the Mountain Background Image */}
                <Image source={mountainBackground} style={styles.image} resizeMode="cover" />

                {/* Add the Welcome Text */}
                <View style={styles.welcomeTextContainer}>
                    <Text style={styles.greetingText}>Hey {randomUser.name},</Text>
                    <Text style={styles.welcomeText}>Welcome to Convident!</Text>
                </View>
            </View>

            <View style={styles.middleContainer}>
                <ScrollView contentContainerStyle={styles.scrollView}>
                    {boxesData.map((box, index) => (
                        <DisplayBox
                            key={index}
                            title={box.title}
                            subtitle={box.subtitle}
                            percentage={box.percentage}
                        />
                    ))}
                </ScrollView>
            </View>

            <View style={styles.bottomContainer}>
                <TouchableOpacity style={styles.tab} onPress={() => navigation.navigate('Conversation')}>
                    <Image source={conversationIcon} style={styles.icon} />
                    <Text style={styles.tabText}>Conversation</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.tab, styles.activeTab]} onPress={() => navigation.navigate('Home')}>
                    <Image source={greenhouseIcon} style={styles.icon} />
                    <Text style={[styles.tabText, styles.activeTabText]}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tab}>
                    <Text style={styles.tabText}>Practice</Text>
                </TouchableOpacity>
            </View>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    topContainer: {
        flex: 2,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e0e0e0',
        position: 'relative',
    },
    waffleButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        zIndex: 10,
    },
    waffleIcon: {
        width: 40,
        height: 40,
    },
    image: {
        width: '100%',
        height: '125%',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    welcomeTextContainer: {
        position: 'absolute',
        bottom: 60,
        left: 20,
    },
    greetingText: {
        fontSize: 22,  // Adjust this font size for "Hey [random name],"
        color: '#fff',
        fontWeight: 'bold',
    },
    welcomeText: {
        fontSize: 25,  // Adjust this font size for "Welcome to Convident!"
        color: '#fff',
        fontWeight: 'bold',
    },
    middleContainer: {
        flex: 4,
        backgroundColor: '#ffffff',
        padding: 16,
        width: '100%',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    scrollView: {
        flexGrow: 1,
    },
    boxContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        padding: 16,
        borderRadius: 10,
        marginVertical: 8,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    boxContent: {
        flex: 1,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    percentage: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#4caf50',
        textAlign: 'center',
    },
    bottomContainer: {
        height: 70,
        backgroundColor: '#ffffff',
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#ddd',
    },
    tab: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
    },
    icon: {
        width: 30,
        height: 24,
        marginBottom: 5,
    },
    tabText: {
        fontSize: 12,
        color: '#888',
    },
    activeTab: {
        borderTopWidth: 2,
        borderTopColor: '#4caf50',
    },
    activeTabText: {
        color: '#4caf50',
        fontWeight: 'bold',
    },
});

export default Home;
