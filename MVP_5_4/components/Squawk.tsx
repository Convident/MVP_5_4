import React, { ReactNode } from 'react';
import MultipleChoiceQuestion from './MCQ'; // Import the question types from other files
import TextQuestion from './SAQ';
import { View, Text } from 'react-native';

import { getApp } from "firebase/app";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

import app from '../firebaseConfig';

interface QuestionContainerProps {
    questionType: string;
}

async function getCSVFileFromStorage (questionType) : Promise<string> {
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
                    const firstLine = lines[random];
                    console.log(firstLine);
                    console.log('Data:', data);
                    return Promise.resolve(firstLine);
                })
                .catch(error => {
                    console.error('Error fetching CSV data:', error);
                });
        });
    } catch (error) {
        console.error('Error retrieving CSV file:', error);
    }
    return Promise.resolve('Error');
};

const QuestionContainer: React.FC<QuestionContainerProps> = ({ questionType }) => {

    // Call the function to get the CSV file from Firebase Storage
    //const question = await getCSVFileFromStorage(questionType);
    if (questionType === 'mcq') {

        return <MultipleChoiceQuestion question="What flavor of ice cream is your favorite?" choices={['Vanilla', 'Chocolate', 'Strawberry']} />;
        //return <MultipleChoiceQuestion question={question} choices={choices} />;

    } else if (questionType === 'saq'){
        return <TextQuestion question="What is your favorite color?" />;
    } else {
        return <View>
                <Text>Invalid Text.</Text>
            </View>;
    }
};

export default QuestionContainer;