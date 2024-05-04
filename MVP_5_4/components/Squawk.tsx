import React, { ReactNode, useState, useEffect } from 'react';
import MultipleChoiceQuestion from './MCQ'; // Import the question types from other files
import TextQuestion from './SAQ';
import { View, Text } from 'react-native';

import { getApp } from "firebase/app";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

import app from '../firebaseConfig';

interface QuestionContainerProps {
    questionType: string;
}

const QuestionContainer: React.FC<QuestionContainerProps> = ({ questionType }) => {
    const [question, setQuestion] = useState<string>('');
    const [choices, setChoices] = useState<string[]>([]); 
    const [questionSet, setQuestionSet] = useState<boolean>(false);
    
    useEffect(() => {
        if (!questionSet) {
            console.log('Getting CSV file from storage');
            getCSVFileFromStorage(questionType);
            setQuestionSet(true);
        }
    })

    async function getCSVFileFromStorage(questionType) {
        const storage = getStorage(app);

        try {
            const csvRef = ref(storage, 'questions/'+questionType+'/'+questionType+'.csv');
            getDownloadURL(csvRef).then((url) => {
                fetch(url)
                    .then(response => response.text())
                    .then(data => {
                        const lines = data.split('\n');
                        let min = 1; 
                        let max = 2;   
                        let random = Math.floor(Math.random() * (max - min + 1)) + min;
                        const context = lines[random];
                        console.log(context);
    
                        let info= context.split(',');
                        setQuestion(info[0]);
                        setChoices([info[1], info[2], info[3], info[4]]);
                        setQuestionSet(true);
                        //return Promise.resolve(firstLine);
                    })
                    .catch(error => {
                        console.error('Error fetching CSV data:', error);
                    });
            });
        } catch (error) {
            console.error('Error retrieving CSV file:', error);
        }
    }

    if (questionType === 'mcq') {

        //return <MultipleChoiceQuestion question="What flavor of ice cream is your favorite?" choices={['Vanilla', 'Chocolate', 'Strawberry']} />;
        return <MultipleChoiceQuestion question={question} choices={choices} />;

    } else if (questionType === 'saq'){
        return <TextQuestion question={question} />;
    } else {
        return <View>
                <Text>Invalid Text.</Text>
            </View>;
    }
};

export default QuestionContainer;