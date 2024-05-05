import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import QuestionContainer from './components/Squawk';
import SignupAndLogin from './components/signup';
export default function App() {
  return (
    <View style={styles.container}>
      <ScrollView >

      <Text>Convident - Yay!</Text>
      <StatusBar style="auto" />
      <SignupAndLogin />
      <QuestionContainer questionType="saq"/>
      <QuestionContainer questionType="mcq"/>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 50,
  },
});
