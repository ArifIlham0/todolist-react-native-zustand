import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "twrnc";
import { Entypo } from "@expo/vector-icons";
import { Toast } from "../components";
import useAuthStore from "../zustand/authStore";

type Props = {
  navigation: any;
};

const RegisterScreen = ({ navigation }: Props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const passwordRef = useRef(null);
  const [showToast, setShowToast] = useState(false);
  const { register, isLoading, error } = useAuthStore();

  const handleRegister = async () => {
    let hasError = false;

    setUsernameError("");
    setPasswordError("");

    if (username.length < 4) {
      setUsernameError("Username must be at least 4 characters long");
      hasError = true;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z]).{8,}$/;
    if (!passwordRegex.test(password)) {
      setPasswordError(
        "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one number"
      );
      hasError = true;
    }

    if (hasError) {
      return;
    }

    try {
      await register(username, password);
      navigation.navigate("Login");
    } catch (err) {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    }
  };

  return (
    <SafeAreaView style={tw`justify-center items-center`}>
      <View style={tw`w-full p-4`}>
        <Text style={tw`text-white font-semibold text-3xl mt-10`}>
          Register
        </Text>
        <Text style={tw`text-white text-base mt-10`}>Username</Text>
        <TextInput
          placeholder="Username"
          placeholderTextColor={"gray"}
          value={username}
          autoCapitalize="none"
          onChangeText={setUsername}
          style={tw`border border-gray-300 p-2 rounded h-12 bg-[#1D1D1D] mt-3 text-white`}
        />
        {usernameError ? (
          <Text style={tw`text-red-500 mt-1`}>{usernameError}</Text>
        ) : null}
        <View>
          <Text style={tw`text-white text-base mt-7`}>Password</Text>
          <Pressable onPress={() => (passwordRef.current as any).focus()}>
            <View
              style={tw`border border-gray-300 p-2 rounded mt-3 h-12 bg-[#1D1D1D] text-white flex-row justify-between`}
            >
              <TextInput
                placeholder="Password"
                placeholderTextColor={"gray"}
                value={password}
                autoCapitalize="none"
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                ref={passwordRef}
                style={tw`text-white`}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={tw`justify-center mr-2`}
              >
                {showPassword ? (
                  <Entypo name="eye" size={24} color="white" />
                ) : (
                  <Entypo
                    name="eye-with-line"
                    size={24}
                    color="white"
                    style={tw``}
                  />
                )}
              </TouchableOpacity>
            </View>
          </Pressable>
          {passwordError ? (
            <Text style={tw`text-red-500 mt-1`}>{passwordError}</Text>
          ) : null}
        </View>
        <TouchableOpacity
          onPress={handleRegister}
          style={tw`bg-[#8687E7] mt-20 h-12 justify-center items-center rounded`}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={tw`text-white text-base font-bold`}>Register</Text>
          )}
        </TouchableOpacity>
        <Pressable
          onPress={() => navigation.goBack()}
          style={tw`justify-center items-center mt-5`}
        >
          <Text style={tw`text-gray-200`}>
            Already have an account?
            <Text style={tw`text-white font-bold`}> Login</Text>
          </Text>
        </Pressable>
      </View>
      {showToast && (
        <Toast
          isSuccess={false}
          title="Failed"
          message={"Username is not available please change"}
        />
      )}
    </SafeAreaView>
  );
};

export default RegisterScreen;
