import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import { ArrowLeft, PaperPlaneTilt } from 'phosphor-react-native';
import { AppColors, darkTheme, lightTheme } from '../../constants/AppColors';
import { Picker } from '@react-native-picker/picker';
import { ApiService } from '../../constants/ApiService';
import { AppConstants } from '../../constants/AppConstants';
import Markdown from 'react-native-markdown-display';

interface ChatProps {
  focused?: boolean;
  size?: number;
}

const Chat: React.FC<ChatProps> = ({ focused = false, size = 28 }) => {
  const [userInput, setUserInput] = useState<string>('');
  const [messages, setMessages] = useState<{ text: string; sender: 'user' | 'gemini'; loading?: boolean; isCode?: boolean }[]>([]);
  const [pickedItem, setPickedItem] = useState<string>('Gemini 2.0 Flash');
  const iconColor = focused ? AppColors.active : AppColors.inactive;
  const dotAnimations = useRef([new Animated.Value(0), new Animated.Value(0), new Animated.Value(0)]).current;
  const flatListRef = useRef<FlatList<{ text: string; sender: 'user' | 'gemini'; loading?: boolean; isCode?: boolean }>>(null);

  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const startDotAnimations = () => {
    dotAnimations.forEach((dot, index) => {
      Animated.loop(
        Animated.stagger(200, [
          Animated.timing(dot, {
            toValue: -5,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      ).start();
      Animated.delay(index * 200).start();
    });
  };

  const handleSendMessage = async () => {
    if (userInput.trim()) {
      const userMessage: { text: string; sender: 'user' | 'gemini'; isCode?: boolean } = { text: userInput, sender: 'user' };
      setMessages((prevMessages) => [...prevMessages, userMessage, { text: '...', sender: 'gemini', loading: true }]);
      setUserInput('');
      startDotAnimations();

      try {
        const response: string = (await ApiService(userInput)) ?? '...';
        const geminiMessage: { text: string; sender: 'user' | 'gemini'; isCode?: boolean } = {
          text: response ?? '...',
          sender: 'gemini',
          isCode: response ? response.startsWith('```') : undefined, // Simple code detection
        };
        setMessages((prevMessages) => prevMessages.filter((msg) => !msg.loading).concat(geminiMessage));
      } catch (error) {
        console.error('Error in Chat:', error);
        const errorMessage: { text: string; sender: 'user' | 'gemini'; isCode?: boolean } = { text: 'An unexpected error occurred.', sender: 'gemini' };
        setMessages((prevMessages) => prevMessages.filter((msg) => !msg.loading).concat(errorMessage));
      }
    }
  };

  const renderLoadingDots = () => (
    <View style={styles.loadingContainer}>
      {dotAnimations.map((dot, index) => (
        <Animated.View
          key={index}
          style={[styles.loadingDot, { transform: [{ translateY: dot }] }]}
        />
      ))}
    </View>
  );

  const renderItem = ({ item }: { item: { text: string; sender: 'user' | 'gemini'; loading?: boolean; isCode?: boolean } }) => (
    <View
      style={[
        styles.message,
        item.sender === 'user' ? styles.userMessage : styles.geminiMessage,
      ]}
    >
      {item.loading ? renderLoadingDots() : item.sender === 'gemini' ? (
        <Markdown style={markdownStyles}>{item.text}</Markdown>
      ) : (
        <Text style={styles.messageText}>{item.text}</Text>
      )}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <View style={styles.chatContainer}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.arrowContainer} onPress={() => console.log('Home')}>
            <ArrowLeft size={size} weight="duotone" color={iconColor} />
          </TouchableOpacity>
          <Picker
            selectedValue={pickedItem}
            onValueChange={(itemValue) => setPickedItem(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Gemini 2.0 Flash" value="gemini 2.0 flash" />
          </Picker>
        </View>

        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          style={styles.messagesContainer}
          onContentSizeChange={() => {
            if (flatListRef.current && messages.length > 0) {
              flatListRef.current.scrollToEnd({ animated: true });
            }
          }}
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={userInput}
            onChangeText={setUserInput}
            placeholder="Type your message..."
            multiline
            numberOfLines={4}
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
            <PaperPlaneTilt size={size} weight="duotone" color={iconColor} />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Chat;

const styles = StyleSheet.create({
  chatContainer: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    paddingVertical: 10,
    marginHorizontal: 10,
  },
  arrowContainer: {
    padding: 8,
    backgroundColor: AppColors.backgroundColor,
    borderRadius: AppConstants.borderRadius,
    elevation: 5,
    marginRight: 10,
  },
  picker: {
    flex: 0.7,
  },
  messagesContainer: {
    flex: 1,
  },
  message: {
    marginBottom: 10,
    maxWidth: '80%',
  },
  userMessage: {
    backgroundColor: AppColors.active,
    alignSelf: 'flex-end',
    padding: 10,
    borderRadius: AppConstants.borderRadius,
  },
  geminiMessage: {
    alignSelf: 'flex-start',
    borderRadius: AppConstants.borderRadius,
    backgroundColor: AppColors.backgroundColor,
    padding: 10,
  },
  messageText: {
    fontSize: 16,
    color: AppColors.secondary,
  },
  inputContainer: {
    padding: 5,
    backgroundColor: AppColors.backgroundColor,
    borderRadius: AppConstants.borderRadius,
    elevation: 5,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    fontSize: AppConstants.fontSize,
    color: lightTheme.text,
  },
  sendButton: {
    padding: 10,
    borderRadius: 20,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: AppColors.inactive,
    marginHorizontal: 4,
  },
});

const markdownStyles = {
  body: {
    fontSize: 16,
  },
};