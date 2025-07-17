import {useState} from "react";
import {View} from "react-native";
import {TextInput} from "react-native-gesture-handler";
import {styles} from "./styles";

export const SearchBlock = () => {
  const [inputValue, setInputValue] = useState("");

  return (
    <View>
      <TextInput
        value={inputValue}
        onChangeText={setInputValue}
        style={[styles.searchInput]}
      />
    </View>
  );
};
