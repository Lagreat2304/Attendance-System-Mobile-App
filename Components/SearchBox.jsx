import React, { useState } from 'react';
import { TextInput, Button, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SearchBox = () => {
  const [keyword, setKeyword] = useState('');
  const navigation = useNavigation();

  const submitHandler = () => {
    if (keyword.trim()) {
      navigation.navigate('SearchScreen', { query: keyword });
    } else {
      navigation.navigate('Home');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search students..."
        value={keyword}
        onChangeText={(text) => setKeyword(text)}
      />
      <Button
        title="Search"
        onPress={submitHandler}
        color="#28a745" 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 5,
    marginRight: 10,
  },
});

export default SearchBox;
