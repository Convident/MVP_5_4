import React from 'react';
import MultipleChoiceQuestion from './MCQ'; // Import the question types from other files
import TextQuestion from './SAQ';
import { View, Text } from 'react-native';

interface QuestionContainerProps {
    questionType: string;
}

const QuestionContainer: React.FC<QuestionContainerProps> = ({ questionType }) => {
    if (questionType === 'MCQ') {
        return <MultipleChoiceQuestion question="What flavor of ice cream is your favorite?" choices={['Vanilla', 'Chocolate', 'Strawberry']} />;
    } else if (questionType === 'SAQ'){
        return <TextQuestion question="What is your favorite color?" />;
    } else {
        return <View>
                <Text>Invalid Text.</Text>
            </View>;
    }
};

export default QuestionContainer;