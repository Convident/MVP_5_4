import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Paths to the images
const mountainBackground = require('../assets/images/mountain-background.png');
const houseIcon = require('../assets/images/house-icon.png');
const greenConversationIcon = require('../assets/images/green-conversation-icon.png');
const iIcon = require('../assets/images/i-icon.png'); // Import the "i" icon

type RootStackParamList = {
    ConvoHome: undefined;
    ConvoConversation: undefined;
};

type ConversationScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ConvoConversation'>;

const ConvoConversation: React.FC = () => {
    const navigation = useNavigation<ConversationScreenNavigationProp>();
    const [infoVisible, setInfoVisible] = useState(false); // State to control info visibility

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={styles.container}>
                {/* Top Container with Image */}
                <View style={styles.topContainer}>
                    <Image source={mountainBackground} style={styles.image} resizeMode="cover" />
                    
                    {/* Add Text Over the Image */}
                    <View style={styles.textOverlayContainer}>
                        <Text style={styles.conversationTitle}>Conversation</Text>
                        <Text style={styles.conversationSubtitle}>
                            Practice real-world conversations with our AI Kiwi in various scenarios. Get feedback on specific areas to improve, helping you master tonal accuracy in your conversations.
                        </Text>
                    </View>
                </View>

                {/* Middle Container - Make this scrollable */}
                <View style={styles.middleContainer}>
                    <ScrollView contentContainerStyle={styles.scrollContent}>
                        {/* Combined Header and Scenarios List Container */}
                        <View style={styles.stackContainer}>
                            {/* Header with Info Button */}
                            <View style={styles.headerWrapper}>
                                <Text style={styles.header}>Your Scenarios Today</Text>
                                <TouchableOpacity onPress={() => setInfoVisible(!infoVisible)} style={styles.infoButton}>
                                    <Image source={iIcon} style={styles.infoIcon} />
                                </TouchableOpacity>
                            </View>

                            {/* Bold Divider Line Below Header */}
                            <View style={styles.boldDivider} />

                            {/* Individual Scenario Items */}
                            <View style={styles.stackItem}>
                                <Text style={styles.stackItemText}>Buying Buns at the Local Market</Text>
                            </View>
                            <View style={styles.divider} />
                            <View style={styles.stackItem}>
                                <Text style={styles.stackItemText}>Introducing Yourself to a New Roommate</Text>
                            </View>
                            <View style={styles.divider} />
                            <View style={styles.stackItem}>
                                <Text style={styles.stackItemText}>Taking a Taxi to Hong Kong Disney</Text>
                            </View>
                        </View>

                        {/* Start Button */}
                        <TouchableOpacity style={styles.startButton}>
                            <Text style={styles.startButtonText}>Start</Text>
                        </TouchableOpacity>

                        {/* Conditional Information Section */}
                        {infoVisible && (
                            <View style={styles.infoSection}>
                                <Text style={styles.infoText}>
                                    How Does This Work?
                                </Text>
                                <Text style={styles.infoDescription}>
                                    1. Receive a prompt and press the record button to speak. Press it again when you're done. {"\n"}
                                    2. Kiwi will role-play a character in the scenario. Follow the prompt and continue the conversation. Feel free to improvise and create original answers. To end early, say "end this conversation." {"\n"}
                                    3. After each round, Kiwi provides insights on your tonal accuracy and tips for improvement. Kiwi will also track any slang or phrases you use, with suggestions to better understand your tonal errors.
                                </Text>
                            </View>
                        )}
                    </ScrollView>
                </View>

                {/* Bottom Navigation Tabs */}
                <View style={styles.bottomNavigation}>
                    <TouchableOpacity style={[styles.tab, styles.activeTab]} onPress={() => navigation.navigate('ConvoConversation')}>
                        <Image source={greenConversationIcon} style={styles.icon} />
                        <Text style={[styles.tabText, styles.activeTabText]}>ConvoConversation</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.tab} onPress={() => navigation.navigate('Home')}>
                        <Image source={houseIcon} style={styles.icon} />
                        <Text style={styles.tabText}>Home</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.tab}>
                        <Text style={styles.tabText}>Practice</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    topContainer: {
        flex: 2,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e0e0e0',
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '125%',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    textOverlayContainer: {
        position: 'absolute',
        top: '30%', // Adjust based on your design
        left: 20,
        right: 20,
        alignItems: 'center',
    },
    conversationTitle: {
        fontSize: 24, // Adjust as needed
        color: '#ffffff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    conversationSubtitle: {
        fontSize: 14, // Adjust as needed
        color: '#ffffff',
        textAlign: 'center',
        marginTop: 15,
        fontWeight: 'bold',
    },
    middleContainer: {
        flex: 4,
        backgroundColor: '#ffffff',
        padding: 16,
        width: '100%',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        marginTop: -40, // Move it up to overlap slightly with the top container
        justifyContent: 'flex-start', // Start stacking items from the top
        alignItems: 'center', // Center content horizontally
    },
    scrollContent: {
        alignItems: 'center', // Center content horizontally
        paddingBottom: 20, // Add padding to the bottom for scroll
    },
    stackContainer: {
        backgroundColor: '#fbfdeb', // Match background color with stack items
        borderRadius: 8,
        borderColor: '#000000',
        borderWidth: 1,
        width: '100%',
        maxWidth: 320,
        paddingVertical: 12, // Add padding to top and bottom
        alignItems: 'center', // Center content horizontally
    },
    headerWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%', // Full width of the container
        paddingHorizontal: 10, // Horizontal padding for header
    },
    header: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'left', // Align text to the left
        flex: 1, // Make the header take up available space
    },
    boldDivider: {
        width: '95%',
        height: 2,
        backgroundColor: '#000000', // Bold line below header
        marginVertical: 5, // Space around the divider
    },
    infoButton: {
        padding: 10,
    },
    infoIcon: {
        width: 20,
        height: 20,
    },
    stackItem: {
        paddingVertical: 12, // Vertical padding for items
        paddingHorizontal: 10, // Horizontal padding for items
        width: '100%', // Full width of the container
        alignItems: 'flex-start', // Align text to the left
    },
    divider: {
        width: '95%', // Slightly less than full width to add spacing
        height: 1,
        backgroundColor: '#d3d3d3', // Light gray line
        alignSelf: 'center', // Center horizontally
    },
    stackItemText: {
        fontSize: 14,
        color: '#333',
        textAlign: 'left', // Align text to the left
    },
    startButton: {
        backgroundColor: '#4caf50',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 25,
        marginTop: 20, // Add some margin to create space between the last stack item and the button
    },
    startButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    infoSection: {
        marginTop: 20,
        backgroundColor: '#fbfdeb',
        padding: 15,
        borderRadius: 10,
        borderWidth: 1, // Add this line for the border width
        borderColor: '#000000', // Add this line to set the border color
    },
    infoText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    infoDescription: {
        fontSize: 13,
        color: '#000000',
    },
    bottomNavigation: {
        height: 60,
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

export default ConvoConversation;
