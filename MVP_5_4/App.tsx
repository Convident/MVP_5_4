import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import QuestionContainer from './components/Squawk';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Convident - Yay!</Text>
      <StatusBar style="auto" />
      <QuestionContainer questionType="saq"/>
      <QuestionContainer questionType="mcq"/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
