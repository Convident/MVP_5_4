import React, { ReactNode, useState, useEffect }  from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import QuestionContainer from './Questions';


function Practice() {
    const [questionType, setQuestionType] = useState<string>('');

    const handleQuestionTypeSelection = (type: string) => {
        setQuestionType(type);
    };

    return (
        <View>
            
            <Text>Which question type do you want?</Text>
            <TouchableOpacity style={styles.navigationButton} onPress={() => handleQuestionTypeSelection('mcq')}>
                <Text style={styles.text}>Multiple Choice</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navigationButton} onPress={() => handleQuestionTypeSelection('saq')}>
                <Text style={styles.text}>Short Answer Question</Text>
            </TouchableOpacity>

            {questionType === 'mcq' && (
                <QuestionContainer questionType="mcq"/>
            )}

            {questionType === 'saq' && (
                <QuestionContainer questionType="saq"/>
            )}
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
        margin: 10,
    },
    text: {
        color: 'white',
    }
});

export default Practice;