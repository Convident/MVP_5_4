import React, { ReactNode, useState, useEffect } from 'react';
import MultipleChoiceQuestion from './MCQ';
import TextQuestion from './SAQ';
import { View, Text, Platform } from 'react-native';

import { getApp } from "firebase/app";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import * as Permissions from 'expo-permissions';
import app from '../firebaseConfig';
import * as Notifications from 'expo-notifications';

// Schedule notification at 12 PM EST
const scheduleDailyNotification = async () => {
    // Calculate the next 12 PM EST in milliseconds
    const now = new Date();
    const nextNoon = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      19 + (now.getTimezoneOffset() / 60) + 4, // Adjusting for EST (UTC-4)
      0,
      0
    );
  
    if (nextNoon.getTime() < now.getTime()) {
      nextNoon.setDate(nextNoon.getDate() + 1);
    }
  
    await Notifications.cancelAllScheduledNotificationsAsync(); // Clear previous notifications
  
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Daily Question",
        body: "It's time for your daily question!",
      },
      trigger: {
        hour: 12,
        minute: 0,
        repeats: true,
        timezone: 'America/New_York', // Using IANA timezone identifier
      },
    });
  };

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

    useEffect(() => {
        (async () => {
          if (Platform.OS !== 'web') {
            const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
            if (status !== 'granted') {
              alert('Permission to access notifications was denied');
              return;
            }
          }
          scheduleDailyNotification();
        })();
      }, []);

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