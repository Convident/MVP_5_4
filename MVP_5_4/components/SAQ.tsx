import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';

interface TextQuestionProps {
    question: string;
}

const TextQuestion: React.FC<TextQuestionProps> = ({ question }) => {
    const [answer, setAnswer] = useState('');

    const handleTextResponse = (answer: string) => {
        setAnswer(answer);
    };

    return (
        <View>
            <Text>{question}</Text>
            <TextInput
                style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                onChangeText={text => handleTextResponse(text)}
            />
        </View>
    );
}

export default TextQuestion;