import React from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, ListRenderItem } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useRouter } from 'expo-router';

type Message = {
    id: string;
    text: string;
    sender: string;
};

const Conversations: React.FC = () => {
    const [messages, setMessages] = React.useState<Message[]>([
        { id: '1', text: 'message title', sender: 'Kiwi AI' },
        { id: '2', text: 'message content', sender: 'Kiwi AI' },
        { id: '3', text: 'mandarin message', sender: 'User' },
    ]);

    const renderItem: ListRenderItem<Message> = ({ item }) => (
        <View style={item.sender === 'User' ? styles.userMessage : styles.aiMessage}>
            <Text>{item.text}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={messages}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.messageContainer}
            />
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Type your message..."
                    multiline
                />
                <TouchableOpacity style={styles.micButton}>
                    <Text style={styles.micButtonText}>🎤</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

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
        backgroundColor: '#e1ffc7',
        borderRadius: 5,
        padding: 10,
        marginVertical: 5,
        maxWidth: '80%',
    },
    userMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#add8e6',
        borderRadius: 5,
        padding: 10,
        marginVertical: 5,
        maxWidth: '80%',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderTopWidth: 1,
        borderColor: '#ccc',
    },
    input: {
        flex: 1,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
    },
    micButton: {
        backgroundColor: '#32cd32',
        borderRadius: 25,
        padding: 15,
    },
    micButtonText: {
        color: '#fff',
        fontSize: 18,
    },
});

export default Conversations;
