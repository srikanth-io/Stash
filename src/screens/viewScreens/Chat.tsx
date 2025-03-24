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
  Image,
} from 'react-native';
import { ArrowLeft, Globe, List, Paperclip, PaperPlaneTilt, Plus, PlusCircle } from 'phosphor-react-native';
import { AppColors, lightTheme } from '../../constants/AppColors';
import { Picker } from '@react-native-picker/picker';
import { ApiService } from '../../constants/ApiService';
import { AppConstants } from '../../constants/AppConstants';
import Markdown from 'react-native-markdown-display';
import LottieView from 'lottie-react-native';

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
  const [showNewChat, setShowNewChat] = useState(false);

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
          isCode: response ? response.startsWith('```') : undefined, 
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

    const renderEmptyState = () => (
      <View style={styles.emptyStateContainer}>
        {/* <Image source={require('./../../../assets/bot.png')} style={styles.emptyImage}/> */}
        <LottieView
        autoPlay
        style={{
          width: 100,
          height: 100,
        }}
        source={require('../../../assets/bot.json')}
      />
        <Text style={styles.emptyStateText}>Start a conversation! Ask me anything.</Text>
    </View>
  );

  const newChat = () => {
    renderEmptyState
  }


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

           <TouchableOpacity style={styles.burgerContainer} onPress={() => newChat()}>
            <PlusCircle size={size} weight="duotone" color={iconColor} />
          </TouchableOpacity>
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
           ListEmptyComponent={renderEmptyState}
        />  

        <View style={styles.inputContainer}>
          <View style={styles.toolBarIcons}>
            <TouchableOpacity>
              <Paperclip size={size} weight="duotone" color={iconColor} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Globe size={size} weight="duotone" color={iconColor} />
            </TouchableOpacity>
          </View>

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
      {showNewChat && (
       renderEmptyState()
      )}
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
    marginTop: 20,
    paddingVertical: 10,
  },
  arrowContainer: {
    padding: 8,
    backgroundColor: AppColors.backgroundColor,
    borderRadius: AppConstants.borderRadius,
    elevation: 5,
    marginRight: 10,
  },
  burgerContainer: {
    position: "absolute",
    right: 0,
    padding: 8,
    backgroundColor: AppColors.backgroundColor,
    borderRadius: AppConstants.borderRadius,
    elevation: 5,
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
    borderTopRightRadius: 0,
  },
  geminiMessage: {
    alignSelf: 'flex-start',
    borderRadius: AppConstants.borderRadius,
    backgroundColor: AppColors.backgroundColor,
    paddingLeft: 10,
    paddingRight: 10,
    borderTopLeftRadius: 0,
  },
  messageText: {
    fontSize: 16,
    color: AppColors.secondary,
  },
  toolBarIcons: {
    flexDirection: "row",
    padding: 5,
    backgroundColor: AppColors.active,
    elevation: 5,
    gap: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: AppConstants.borderRadius
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
    paddingHorizontal: 10,
  },
  sendButton: {
    padding: 10,
    borderRadius: 20,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 10,
  },
  loadingDot: {
    padding: 3.5,
    borderRadius: AppConstants.borderRadius,
    backgroundColor: AppColors.active,
    marginHorizontal: 4,
  },
  emptyStateContainer: {
    flex: 1,
    position: "relative",
    marginTop: '60%',
    alignItems: "center",
    padding: 10,
    borderRadius: AppConstants.borderRadius
  },
  emptyStateText: {
    fontSize: AppConstants.fontSize,
    color: lightTheme.text,
    fontWeight: 'bold'
  },
});

const markdownStyles = {
  body: {
    fontSize: 16,
  },
};