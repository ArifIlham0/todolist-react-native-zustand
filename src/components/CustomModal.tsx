import { View, Text, Modal, TouchableOpacity } from "react-native";
import React from "react";
import tw from "twrnc";

type Props = {
  visible: boolean;
  onClose: () => void;
  onAccept: () => void;
  taskTitle: string;
};

const CustomModal = ({ visible, onClose, onAccept, taskTitle }: Props) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View
        style={tw`flex-1 items-center justify-center bg-black bg-opacity-50`}
      >
        <View style={tw`bg-[#363636] rounded-lg p-4`}>
          <Text style={tw`text-white`}>{taskTitle}</Text>
          <View style={tw`flex-row mt-4 justify-center items-center`}>
            <TouchableOpacity
              onPress={onClose}
              style={tw`bg-transparent w-15 rounded justify-center items-center h-7 border-[#8687E7] border-2`}
            >
              <Text style={tw`text-[#8687E7] text-xs`}>No</Text>
            </TouchableOpacity>
            <View style={tw`w-4`} />
            <TouchableOpacity
              onPress={onAccept}
              style={tw`bg-[#8687E7] w-15 rounded justify-center items-center h-7`}
            >
              <Text style={tw`text-white text-xs`}>Yes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CustomModal;
