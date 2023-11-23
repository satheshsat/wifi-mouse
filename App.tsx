import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { io } from 'socket.io-client';

export default function App() {
  const [server, setServer] = useState('');
  const [socket, setSocket] = useState<any>('');
  const [initialLocation, setInitialLocation] = useState<any>('');
  const [endLocation, setEndLocation] = useState<any>('');

  const setSocketIp = () =>{
    if(server){
      setSocket(io('http://'+server+":4445"));
    }
  }
  // const touchStart = (evt: any) => {
  //   console.log(evt.nativeEvent);
  // }
  const touchMove = (evt: any) => {
    if(!socket){
      return;
    }
    setEndLocation(initialLocation);
    setInitialLocation(evt.nativeEvent);
    if(initialLocation && endLocation){
      let x,y;
      x = (initialLocation.locationX-endLocation.locationX)*5;
      y = (initialLocation.locationY-endLocation.locationY)*5;
      socket.emit("moveMouse", {x,y});
    }
  }
  // const touchEnd = (evt: any) => {
  //   console.log(evt.nativeEvent);
  // }
  const keyPress = (key: any) => {
    if(!socket){
      return;
    }
    socket.emit("mouseClick", key);
  }
  return (
    <View style={styles.container}>
      <View style={styles.keyContainer}>
        <View style={{flexDirection: 'row'}}>
          <TextInput style={{minWidth: 200, borderColor: '#000000', borderWidth: 1, padding: 5}} placeholder='Enter ip' onChangeText={setServer}></TextInput>
          <Button title='Set IP' onPress={setSocketIp}></Button>
        </View>
      </View>
      <View>
        <View style={{flexDirection: 'row'}}>
          <AppButton title='left' onPress={()=>keyPress('left')} containerStyle={{minWidth: '30%', margin: 5}}></AppButton>
          <AppButton title='middle' onPress={()=>keyPress('middle')} containerStyle={{minWidth: '20%', margin: 5}}></AppButton>
          <AppButton title='right' onPress={()=>keyPress('right')} containerStyle={{minWidth: '30%', margin: 5}}></AppButton>
        </View>
        <View style={{minWidth: '100%', height: '70%', borderWidth: 1}} onTouchMove={(evt) => touchMove(evt)}></View>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const AppButton = ({ onPress, title, containerStyle, buttonStyle}: any) => (
  <TouchableOpacity onPress={onPress} style={{...containerStyle, ...{borderColor: '#000000', borderWidth: 1}}}>
    <Text style={{...buttonStyle, ...{textAlign: 'center'}}}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    marginTop: '10%'
    // justifyContent: 'center',
  },
  keyContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 10
  }
});
