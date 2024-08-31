import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ListRenderItem, Dimensions, TouchableOpacity, Animated, Easing, Image } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Audio } from 'expo-av';

type Message = {
    id: string;
    text: string;
    sender: string;
    incorrectPhrases?: string[];
};

// Import the mic icon image
const micIcon = require('../assets/images/green-mic-icon.png'); // Adjust the path as necessary

// Underline incorrect text within the array
const UnderlinedText: React.FC<{ text: string, incorrectPhrases: string[] }> = ({ text, incorrectPhrases }) => {
    const getStyledText = (text: string, incorrectPhrases: string[]) => {
        let styledText = text;
        incorrectPhrases.forEach(phrase => {
            const regex = new RegExp(`(${phrase})`, 'g');
            styledText = styledText.replace(regex, '<u>$1</u>');
        });
        return styledText.split(/(<u>.*?<\/u>)/).map((part, index) =>
            part.startsWith('<u>') ? (
                <Text key={index} style={styles.incorrectWord}>{part.replace(/<\/?u>/g, '')}</Text>
            ) : (
                <Text key={index}>{part}</Text>
            )
        );
    };
    return <Text>{getStyledText(text, incorrectPhrases)}</Text>;
};

// Main component, manage conversations
const ConvoChat: React.FC = () => {
    const [messages] = useState<Message[]>([
        { id: 'header', text: 'Restaurant Interaction', sender: 'header' },
        { id: '1', text: '您好，见天有几位？', sender: 'Kiwi AI' },
        { id: '2', text: '两位，两位。', sender: 'User' },
        { id: '3', text: '请问您们的房间号是多少？', sender: 'Kiwi AI' },
        { id: '4', text: '二百五', sender: 'User' },
        { id: '5', text: '好的，请稍等，我带您们去座位。', sender: 'Kiwi AI' },
        { id: '6', text: '好的好的，谢谢您', sender: 'User' },
        { id: '7', text: '那您今天有幸点我们的特色厨师餐。您可以从以下菜单中选择，有水煮蛋或煎蛋，法式早餐，美式早餐，还有中式早餐。水果和米饭在旁边的自助区，您可以随时取用。食物大约需要10到15分钟准备好。', sender: 'Kiwi AI' },
        { id: '8', text: '好的，听起来还不错。', sender: 'User' },
        { id: '9', text: '我给您一些时间看看菜单，一会儿回来为您点单。', sender: 'Kiwi AI' },
        { id: '10', text: '你好！先给我来一杯绿茶吧。', sender: 'User' },
        { id: '11', text: '姐姐，我们可点了。', sender: 'Kiwi AI' },
        { id: '12', text: '绿茶一杯。', sender: 'User' },
        { id: '13', text: '好的，绿茶一杯。在有什么？', sender: 'Kiwi AI' },
        { id: '14', text: '再来一份法式早餐吧，另外请给我朋友来一份中式早餐。', sender: 'User' },
        { id: '15', text: '好的，一份法式早餐和一份中式早餐。 明白了。还有其他需要的吗？', sender: 'Kiwi AI' },
        { id: '16', text: '好的，就点这，谢谢，谢谢。', sender: 'User' },
        { id: '17', text: '好的，有问题请教。', sender: 'Kiwi AI' }
    ]);

    // Setting up scrolling, state, recording, and audio
    const [currentStep, setCurrentStep] = useState<number>(0);
    const flatListRef = useRef<FlatList<Message>>(null);
    const recordingTimeout = useRef<NodeJS.Timeout | null>(null);
    const [recording, setRecording] = useState<Audio.Recording | undefined>(undefined);

    // Ripple effect states, hardcoded, may need change
    const rippleAnim = useRef(new Animated.Value(0)).current;
    const rippleAnim2 = useRef(new Animated.Value(0)).current;
    const rippleAnim3 = useRef(new Animated.Value(0)).current;
    const rippleAnim4 = useRef(new Animated.Value(0)).current;

    const startRippleEffect = () => {
        Animated.loop(
            Animated.timing(rippleAnim, {
                toValue: 1,
                duration: 500,
                easing: Easing.out(Easing.exp),
                useNativeDriver: true,
            })
        ).start();

        Animated.loop(
            Animated.timing(rippleAnim2, {
                toValue: 1,
                duration: 500,
                easing: Easing.out(Easing.exp),
                useNativeDriver: true,
                delay: 500,
            })
        ).start();

        Animated.loop(
            Animated.timing(rippleAnim3, {
                toValue: 1,
                duration: 500,
                easing: Easing.out(Easing.exp),
                useNativeDriver: true,
                delay: 250,
            })
        ).start();

        Animated.loop(
            Animated.timing(rippleAnim4, {
                toValue: 1,
                duration: 500,
                easing: Easing.out(Easing.exp),
                useNativeDriver: true,
                delay: 750,
            })
        ).start();
    };

    const stopRippleEffect = () => {
        rippleAnim.stopAnimation();
        rippleAnim.setValue(0);
        rippleAnim2.stopAnimation();
        rippleAnim2.setValue(0);
        rippleAnim3.stopAnimation();
        rippleAnim3.setValue(0);
        rippleAnim4.stopAnimation();
        rippleAnim4.setValue(0);
    };

    // Audio recording, handle when to record/stop
    const handleStart = () => {
        setCurrentStep(1); // Start the conversation from the first message
    };

    const handleNextMessage = () => {
        setCurrentStep((prevStep: number) => Math.min(prevStep + 1, messages.length - 1)); // Move to the next step
    };

    const startRecording = async () => {
        if (recording) {
            console.log('A recording is already in progress.');
            return;
        }

        try {
            console.log('Requesting permissions...');
            await Audio.requestPermissionsAsync();
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            console.log('Starting recording...');
            const { recording } = await Audio.Recording.createAsync(
                Audio.RecordingOptionsPresets.HIGH_QUALITY
            );
            setRecording(recording);
            console.log('Recording started');
            startRippleEffect(); // Start ripple effect when recording starts
        } catch (err) {
            console.error('Failed to start recording', err);
        }
    };

    const stopRecording = async () => {
        if (!recording) {
            console.log('No recording to stop.');
            return;
        }

        try {
            console.log('Stopping recording...');
            await recording.stopAndUnloadAsync();
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: false,
            });
            const uri = recording.getURI();
            setRecording(undefined);
            console.log('Recording stopped and stored at', uri);
            stopRippleEffect(); // Stop ripple effect when recording stops
            // Proceed with uploading and processing the recording...
        } catch (err) {
            console.error('Failed to stop recording', err);
        }
    };

    const handlePressIn = () => {
        // Start a timer to determine if it's a long press
        recordingTimeout.current = setTimeout(() => {
            startRecording();
            recordingTimeout.current = null;
        }, 500); // Adjust the duration as needed
    };

    const handlePressOut = () => {
        // If the recording timeout is still active, it's a short press
        if (recordingTimeout.current) {
            clearTimeout(recordingTimeout.current);
            handleNextMessage(); // This is a short press, move to next message
        } else {
            stopRecording(); // The recording was started, so now stop it
        }
    };

    // Auto-scroll when state of screen changes
    useEffect(() => {
        if (flatListRef.current && currentStep > 0 && currentStep - 1 < messages.length) {
            flatListRef.current.scrollToIndex({
                index: currentStep - 1,
                animated: true,
                viewOffset: Dimensions.get('window').height * 0.4, // Adjust view offset to ensure the last item is fully visible
            });
        }
    }, [currentStep, messages]);

    const renderItem: ListRenderItem<Message> = ({ item }) => {
        return (
            <View style={item.sender === 'User' ? styles.userMessage : styles.aiMessage}>
                {item.incorrectPhrases ? (
                    <UnderlinedText text={item.text} incorrectPhrases={item.incorrectPhrases} />
                ) : (
                    <Text>{item.text}</Text>
                )}
            </View>
        );
    };

    const getItemLayout = (_: any, index: number) => ({
        length: Dimensions.get('window').height * 0.1, // Replace with your item height
        offset: Dimensions.get('window').height * 0.1 * index,
        index,
    });

    const onScrollToIndexFailed = (info: { index: number, highestMeasuredFrameIndex: number, averageItemLength: number }) => {
        const wait = new Promise(resolve => setTimeout(resolve, 500));
        wait.then(() => {
            if (flatListRef.current) {
                flatListRef.current.scrollToIndex({ index: info.highestMeasuredFrameIndex, animated: true });
            }
        });
    };

    // Main bulk of how the screen looks, for handling, scrolling, and functionality
    // Text boxes, mic button functions
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <View style={styles.kiwiBox}>
                        <Text style={styles.clearText}>Kiwi AI</Text>
                    </View>
                    <View style={styles.topicBox}>
                        <Text style={styles.topicText}>Restaurant Interaction</Text>
                        <Text style={styles.topicDescription}>
                            您好，见天有几位？
                        </Text>
                    </View>
                </View>
                {currentStep === 0 ? (
                    <View style={styles.startContainer}>
                        <TouchableOpacity style={styles.startButton} onPress={handleStart}>
                            <Text style={styles.startButtonText}>Start</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <FlatList
                        ref={flatListRef}
                        data={messages.slice(1, currentStep + 1)} // Show messages up to the current step, skipping header
                        renderItem={renderItem}
                        keyExtractor={item => item.id}
                        contentContainerStyle={[styles.messageContainer, { paddingBottom: Dimensions.get('window').height * 0.4 }]} // Increased padding to accommodate the mic button
                        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
                        getItemLayout={getItemLayout} // Use getItemLayout to calculate positions
                        onScrollToIndexFailed={onScrollToIndexFailed} // Handle scrollToIndex failures
                    />
                )}
                <View style={styles.footer}>
                    <TouchableOpacity
                        style={styles.micButton}
                        onPressIn={handlePressIn}
                        onPressOut={handlePressOut}
                    >
                        <Animated.View style={[styles.ripple, {
                            transform: [{
                                scale: rippleAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0.5, 1.5]
                                })
                            }],
                            opacity: rippleAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [1, 0],
                            }),
                        }]} />
                        <Animated.View style={[styles.ripple, {
                            transform: [{
                                scale: rippleAnim2.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0.5, 1.5]
                                })
                            }],
                            opacity: rippleAnim2.interpolate({
                                inputRange: [0, 1],
                                outputRange: [1, 0],
                            }),
                        }]} />
                        <Animated.View style={[styles.ripple, {
                            transform: [{
                                scale: rippleAnim3.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0.5, 1.5]
                                })
                            }],
                            opacity: rippleAnim3.interpolate({
                                inputRange: [0, 1],
                                outputRange: [1, 0],
                            }),
                        }]} />
                        <Animated.View style={[styles.ripple, {
                            transform: [{
                                scale: rippleAnim4.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0.5, 1.5]
                                })
                            }],
                            opacity: rippleAnim4.interpolate({
                                inputRange: [0, 1],
                                outputRange: [1, 0],
                            }),
                        }]} />
                        {/* Replace the emoji with the mic icon image */}
                        <Image source={micIcon} style={styles.micIcon} />
                    </TouchableOpacity>
                </View>
            </View>
        </GestureHandlerRootView>
    );
};

// Stylesheet for every customization
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 10,
    },
    messageContainer: {
        flexGrow: 1,
        justifyContent: 'flex-end',
    },
    aiMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#f9fdd7',
        borderRadius: 5,
        padding: 10,
        marginVertical: 5,
        maxWidth: '70%',
        marginBottom: '5%',
    },
    userMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#fff7e3',
        borderRadius: 5,
        padding: 10,
        marginVertical: 5,
        maxWidth: '70%',
        marginBottom: '5%',
    },
    headerContainer: {
        marginBottom: 20,
    },
    kiwiBox: {
        alignSelf: 'flex-start',
        marginBottom: 10,
        marginTop: 60,
    },
    clearText: {
        fontSize: 16,
        color: 'black',
        fontWeight: 'bold',
    },
    topicBox: {
        backgroundColor: '#ebf599',
        padding: 15,
        borderRadius: 5,
        alignSelf: 'center',
        maxWidth: '80%',
    },
    topicText: {
        fontWeight: 'bold',
        fontSize: 18,
    },
    topicDescription: {
        marginTop: 15,
        fontSize: 14,
    },
    startContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    startButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#32cd32',
        borderRadius: 5,
    },
    startButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        alignItems: 'center',
        paddingBottom: 10,
        backgroundColor: '#fff',
        paddingTop: 10,
    },
    micButton: {
        backgroundColor: '#32cd32',
        borderRadius: 50,
        padding: 25,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        marginTop: 0,
    },
    ripple: {
        position: 'absolute',
        width: 75,
        height: 75,
        borderRadius: 37.5,
        backgroundColor: 'green',
    },
    // Style for the mic icon image
    micIcon: {
        width: 30,
        height: 30,
        alignSelf: 'center',
    },
    incorrectWord: {
        textDecorationLine: 'underline',
        textDecorationColor: 'red',
        textDecorationStyle: 'solid',
    },
});

export default ConvoChat;













/*
//latest workign copy, includes audio waves, no recording

import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ListRenderItem, Animated, Easing, Dimensions } from 'react-native';
import { TouchableOpacity, GestureHandlerRootView } from 'react-native-gesture-handler';

type Message = {
    id: string;
    text: string;
    sender: string;
    incorrectPhrases?: string[];
};

const UnderlinedText: React.FC<{ text: string, incorrectPhrases: string[] }> = ({ text, incorrectPhrases }) => {
    const getStyledText = (text: string, incorrectPhrases: string[]) => {
        let styledText = text;
        incorrectPhrases.forEach(phrase => {
            const regex = new RegExp(`(${phrase})`, 'g');
            styledText = styledText.replace(regex, '<u>$1</u>');
        });
        return styledText.split(/(<u>.*?<\/u>)/).map((part, index) =>
            part.startsWith('<u>') ? (
                <Text key={index} style={styles.incorrectWord}>{part.replace(/<\/?u>/g, '')}</Text>
            ) : (
                <Text key={index}>{part}</Text>
            )
        );
    };

    return <Text>{getStyledText(text, incorrectPhrases)}</Text>;
};

const WaveAnimation: React.FC = () => {
    const [heights, setHeights] = useState(Array(40).fill(10)); // Increased the number of waves to fill the width

    useEffect(() => {
        const interval = setInterval(() => {
            const newHeights = Array(40).fill(0).map(() => Math.random() * 60 + 20); // Adjusted for longer waves
            setHeights(newHeights);
        }, 300);

        return () => clearInterval(interval);
    }, []);

    return (
        <View style={styles.waveContainer}>
            {heights.map((height, index) => (
                <View
                    key={index}
                    style={[
                        styles.wave,
                        {
                            height: height,
                        }
                    ]}
                />
            ))}
        </View>
    );
};

const Conversations: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
        { id: 'header', text: 'header topic, better be in bold\nheader content, ', sender: 'header' },
        { id: '1', text: 'Buying buns at the local market', sender: 'Kiwi AI' },
        { id: '2', text: 'It is Saturday! You decided to head to your town\'s morning market to buy some fresh buns. Tell the vendor what your favorite buns are and try to bargain the price.', sender: 'Kiwi AI' },
        { id: '3', text: '走一走，看一看，您好！吃的好不好看便宜几块钱！', sender: 'Kiwi AI' },
        { id: '4', text: '您的汉语很好，但是有几个词错了。', sender: 'Kiwi AI', incorrectPhrases: ['您的汉语很好', '有几个词错了'] },
        { id: '5', text: '老板你好, 你这草莓多少钱？我最喜欢吃草莓包了', sender: 'User', incorrectPhrases: ['老板你好'] },
        { id: '6', text: 'conversation。', sender: 'Kiwi AI', incorrectPhrases: ['您的汉语很好', '有几个词错了'] },
        { id: '7', text: 'hello', sender: 'User', incorrectPhrases: ['老板你好'] },
        { id: '8', text: 'Buying buns at the local market', sender: 'Kiwi AI' },
        { id: '9', text: 'Buying buns at the local market', sender: 'Kiwi AI' },
        { id: '10', text: 'This is a wrong sentence', sender: 'User', incorrectPhrases: ['wrong sentence'] }
    ]);

    const [showWaves, setShowWaves] = useState(false);
    const flatListRef = useRef<FlatList<Message>>(null);

    const rippleAnim = useRef(new Animated.Value(0)).current;
    const rippleAnim2 = useRef(new Animated.Value(0)).current;

    const startRippleEffect = () => {
        setShowWaves(true);
        Animated.loop(
            Animated.timing(rippleAnim, {
                toValue: 1,
                duration: 1000,
                easing: Easing.out(Easing.exp),
                useNativeDriver: true,
            })
        ).start();

        Animated.loop(
            Animated.timing(rippleAnim2, {
                toValue: 1,
                duration: 1000,
                easing: Easing.out(Easing.exp),
                useNativeDriver: true,
                delay: 500,
            })
        ).start();
    };

    const stopRippleEffect = () => {
        setShowWaves(false);
        rippleAnim.stopAnimation();
        rippleAnim.setValue(0);
        rippleAnim2.stopAnimation();
        rippleAnim2.setValue(0);
    };

    const renderItem: ListRenderItem<Message> = ({ item }) => {
        if (item.sender === 'header') {
            return (
                <View style={styles.headerContainer}>
                    <View style={styles.kiwiBox}>
                        <Text style={styles.clearText}>Kiwi AI</Text>
                    </View>
                    <View style={styles.topicBox}>
                        <Text style={styles.topicText}>header topic, better be in bold</Text>
                        <Text style={styles.topicDescription}>header content, </Text>
                    </View>
                </View>
            );
        }

        return (
            <View style={item.sender === 'User' ? styles.userMessage : styles.aiMessage}>
                {item.incorrectPhrases ? (
                    <UnderlinedText text={item.text} incorrectPhrases={item.incorrectPhrases} />
                ) : (
                    <Text>{item.text}</Text>
                )}
            </View>
        );
    };

    useEffect(() => {
        if (flatListRef.current) {
            flatListRef.current.scrollToEnd({ animated: true });
        }
    }, [messages]);

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={styles.container}>
                <FlatList
                    ref={flatListRef}
                    data={[...messages].reverse()}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.messageContainer}
                    inverted
                />
                <View style={styles.micContainer}>
                    {showWaves && <WaveAnimation />}
                    <TouchableOpacity
                        style={styles.micButton}
                        onPressIn={startRippleEffect}
                        onPressOut={stopRippleEffect}
                    >
                        <Animated.View style={[styles.ripple, {
                            transform: [{
                                scale: rippleAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0.5, 1.5]
                                })
                            }],
                            opacity: rippleAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [1, 0],
                            }),
                        }]} />
                        <Animated.View style={[styles.ripple, {
                            transform: [{
                                scale: rippleAnim2.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0.5, 1.5]
                                })
                            }],
                            opacity: rippleAnim2.interpolate({
                                inputRange: [0, 1],
                                outputRange: [1, 0],
                            }),
                        }]} />
                        <Text style={styles.micButtonText}>🎤</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    // main container for the entire page
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 10,
    },
    // container for the messages
    messageContainer: {
        flexGrow: 1,
        justifyContent: 'flex-end',
    },
    // ai message alignments
    aiMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#f9fdd7',
        borderRadius: 5,
        padding: 10,
        marginVertical: 5,
        maxWidth: '70%',
        marginBottom: '5%',
    },
    // user message alignments
    userMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#fff7e3',
        borderRadius: 5,
        padding: 10,
        marginVertical: 5,
        maxWidth: '70%',
        marginBottom: '5%',
    },
    // header container
    headerContainer: {
        marginBottom: 20,
    },
    // text box above pop up box
    kiwiBox: {
        alignSelf: 'flex-start',
        marginBottom: 10,
        marginTop: 60,
    },
    // text for clear box
    clearText: {
        fontSize: 16,
        color: 'black',
        fontWeight: 'bold',
    },
    // topic box
    topicBox: {
        backgroundColor: '#ebf599',
        padding: 15,
        borderRadius: 5,
        alignSelf: 'center',
        maxWidth: '80%',
    },
    // topic box title text
    topicText: {
        fontWeight: 'bold',
        fontSize: 18,
    },
    // topic box description text
    topicDescription: {
        marginTop: 15,
        fontSize: 14,
    },
    // container for mic button
    micContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        borderTopWidth: 1,
        borderColor: '#ccc',
    },
    // mic button style
    micButton: {
        backgroundColor: '#32cd32',
        borderRadius: 50,
        padding: 25,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        marginTop: 50, // Add space between waves and mic button
    },
    // ripple effect style
    ripple: {
        position: 'absolute',
        width: 75,
        height: 75,
        borderRadius: 37.5,
        backgroundColor: 'green',
    },
    // mic button text
    micButtonText: {
        color: '#fff',
        fontSize: 35,
    },
    // incorrect word style
    incorrectWord: {
        textDecorationLine: 'underline',
        textDecorationColor: 'red',
        textDecorationStyle: 'solid',
    },
    // wave container style
    waveContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: Dimensions.get('window').width,
        position: 'absolute',
        bottom: 120, // Adjust this value to position the wave animation above the mic button
        left: 0,
        height: 60, // Dedicated space for longer waves
    },
    // wave style
    wave: {
        width: Dimensions.get('window').width / 40, // Dynamically adjust width based on screen width
        marginHorizontal: 1,
        backgroundColor: 'black',
    },
});

export default Conversations; */











//original copy

/*import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ListRenderItem, Animated, Easing } from 'react-native';
import { TouchableOpacity, GestureHandlerRootView } from 'react-native-gesture-handler';

type Message = {
    id: string;
    text: string;
    sender: string;
    incorrectPhrases?: string[];
};

const UnderlinedText: React.FC<{ text: string, incorrectPhrases: string[] }> = ({ text, incorrectPhrases }) => {
    const getStyledText = (text: string, incorrectPhrases: string[]) => {
        let styledText = text;
        incorrectPhrases.forEach(phrase => {
            const regex = new RegExp(`(${phrase})`, 'g');
            styledText = styledText.replace(regex, '<u>$1</u>');
        });
        return styledText.split(/(<u>.*?<\/u>)/).map((part, index) =>
            part.startsWith('<u>') ? (
                <Text key={index} style={styles.incorrectWord}>{part.replace(/<\/?u>/g, '')}</Text>
            ) : (
                <Text key={index}>{part}</Text>
            )
        );
    };

    return <Text>{getStyledText(text, incorrectPhrases)}</Text>;
};

const Conversations: React.FC = () => {
    const [messages, setMessages] = React.useState<Message[]>([
        { id: 'header', text: 'header topic, better be in bold\nheader content, ', sender: 'header' },
        { id: '1', text: 'Buying buns at the local market', sender: 'Kiwi AI' },
        { id: '2', text: 'It is Saturday! You decided to head to your town\'s morning market to buy some fresh buns. Tell the vendor what your favorite buns are and try to bargain the price.', sender: 'Kiwi AI' },
        { id: '3', text: '走一走，看一看，您好！吃的好不好看便宜几块钱！', sender: 'Kiwi AI' },
        { id: '4', text: '您的汉语很好，但是有几个词错了。', sender: 'Kiwi AI', incorrectPhrases: ['您的汉语很好', '有几个词错了'] },
        { id: '5', text: '老板你好, 你这草莓多少钱？我最喜欢吃草莓包了', sender: 'User', incorrectPhrases: ['老板你好'] },
        { id: '6', text: 'conversation。', sender: 'Kiwi AI', incorrectPhrases: ['您的汉语很好', '有几个词错了'] },
        { id: '7', text: 'hello', sender: 'User', incorrectPhrases: ['老板你好'] },
        { id: '8', text: 'Buying buns at the local market', sender: 'Kiwi AI' },
        { id: '9', text: 'Buying buns at the local market', sender: 'Kiwi AI' },
        { id: '10', text: 'This is a wrong sentence', sender: 'User', incorrectPhrases: ['wrong sentence'] }
        

        
    ]);

    const flatListRef = useRef<FlatList<Message>>(null);

    const rippleAnim = useRef(new Animated.Value(0)).current;
    const rippleAnim2 = useRef(new Animated.Value(0)).current;

    const startRippleEffect = () => {
        Animated.loop(
            Animated.timing(rippleAnim, {
                toValue: 1,
                duration: 1000,
                easing: Easing.out(Easing.exp),
                useNativeDriver: true,
            })
        ).start();

        Animated.loop(
            Animated.timing(rippleAnim2, {
                toValue: 1,
                duration: 1000,
                easing: Easing.out(Easing.exp),
                useNativeDriver: true,
                delay: 500,
            })
        ).start();
    };

    const stopRippleEffect = () => {
        rippleAnim.stopAnimation();
        rippleAnim.setValue(0);
        rippleAnim2.stopAnimation();
        rippleAnim2.setValue(0);
    };

    const renderItem: ListRenderItem<Message> = ({ item }) => {
        if (item.sender === 'header') {
            return (
                <View style={styles.headerContainer}>
                    <View style={styles.kiwiBox}>
                        <Text style={styles.clearText}>Kiwi AI</Text>
                    </View>
                    <View style={styles.topicBox}>
                        <Text style={styles.topicText}>header topic, better be in bold</Text>
                        <Text style={styles.topicDescription}>header content, </Text>
                    </View>
                </View>
            );
        }
        
        return (
            <View style={item.sender === 'User' ? styles.userMessage : styles.aiMessage}>
                {item.incorrectPhrases ? (
                    <UnderlinedText text={item.text} incorrectPhrases={item.incorrectPhrases} />
                ) : (
                    <Text>{item.text}</Text>
                )}
            </View>
        );
    };

    useEffect(() => {
        if (flatListRef.current) {
            flatListRef.current.scrollToEnd({ animated: true });
        }
    }, [messages]);

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={styles.container}>
                <FlatList
                    ref={flatListRef}
                    data={[...messages].reverse()}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.messageContainer}
                    inverted
                />
                <View style={styles.micContainer}>
                    <TouchableOpacity
                        style={styles.micButton}
                        onPressIn={startRippleEffect}
                        onPressOut={stopRippleEffect}
                    >
                        <Animated.View style={[styles.ripple, {
                            transform: [{
                                scale: rippleAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0.5, 1.5]
                                })
                            }],
                            opacity: rippleAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [1, 0],
                            }),
                        }]} />
                        <Animated.View style={[styles.ripple, {
                            transform: [{
                                scale: rippleAnim2.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0.5, 1.5]
                                })
                            }],
                            opacity: rippleAnim2.interpolate({
                                inputRange: [0, 1],
                                outputRange: [1, 0],
                            }),
                        }]} />
                        <Text style={styles.micButtonText}>🎤</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    // main container for the entire page
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 10,
    },
    // container for the messages
    messageContainer: {
        flexGrow: 1,
        justifyContent: 'flex-end',
    },
    // ai message alignments
    aiMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#f9fdd7',
        borderRadius: 5,
        padding: 10,
        marginVertical: 5,
        maxWidth: '70%',
        marginBottom: '5%',
    },
    // user message alignments
    userMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#fff7e3',
        borderRadius: 5,
        padding: 10,
        marginVertical: 5,
        maxWidth: '70%',
        marginBottom: '5%',
    },
    // header container
    headerContainer: {
        marginBottom: 20,
    },
    // text box above pop up box
    kiwiBox: {
        alignSelf: 'flex-start',
        marginBottom: 10,
        marginTop: 60,
    },
    // text for clear box
    clearText: {
        fontSize: 16,
        color: 'black',
        fontWeight: 'bold',
    },
    // topic box
    topicBox: {
        backgroundColor: '#ebf599',
        padding: 15,
        borderRadius: 5,
        alignSelf: 'center',
        maxWidth: '80%',
    },
    // topic box title text
    topicText: {
        fontWeight: 'bold',
        fontSize: 18,
    },
    // topic box description text
    topicDescription: {
        marginTop: 15,
        fontSize: 14,
    },
    // container for mic button
    micContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        borderTopWidth: 1,
        borderColor: '#ccc',
    },
    // mic button style
    micButton: {
        backgroundColor: '#32cd32',
        borderRadius: 50,
        padding: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    // ripple effect style
    ripple: {
        position: 'absolute',
        width: 75,
        height: 75,
        borderRadius: 37.5,
        backgroundColor: 'green',
    },
    // mic button text
    micButtonText: {
        color: '#fff',
        fontSize: 35,
    },
    // incorrect word style
    incorrectWord: {
        textDecorationLine: 'underline',
        textDecorationColor: 'red',
        textDecorationStyle: 'solid',
    },
});

export default Conversations; */