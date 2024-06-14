import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface MultipleChoiceQuestionProps {
    question: string;
    choices: string[];
}

const MultipleChoiceQuestion: React.FC<MultipleChoiceQuestionProps> = ({ question, choices }) => {
    const [selectedChoice, setSelectedChoice] = useState('');

    const handleChoiceSelection = (choice: string) => {
        setSelectedChoice(choice);
    };

    return (
        <View>
            <Text>{question}</Text>
            {choices.map((choice, index) => (
                <TouchableOpacity
                    key={index}
                    onPress={() => handleChoiceSelection(choice)}
                    style={{ flexDirection: 'row', alignItems: 'center' }}
                >
                    <View
                        style={{
                            width: 20,
                            height: 20,
                            borderRadius: 10,
                            borderWidth: 1,
                            borderColor: selectedChoice === choice ? 'blue' : 'gray',
                            backgroundColor: selectedChoice === choice ? 'blue' : 'white',
                            marginRight: 10,
                        }}
                    />
                    <Text>{choice}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};


export default MultipleChoiceQuestion;