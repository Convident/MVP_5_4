import React, { useRef, useEffect } from 'react';
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

export default Conversations;