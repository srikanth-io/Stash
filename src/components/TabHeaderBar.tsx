import React, { useState, useRef } from 'react';
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { House, MagnifyingGlass, XCircle } from 'phosphor-react-native';
import { AppColors, lightTheme } from '../constants/AppColors';
import { AppConstants } from '../constants/AppConstants';

interface TabHeaderBarProps {
  focused: boolean;
  size?: number;
}

export default function TabHeaderBar({ focused, size = 28, }: TabHeaderBarProps) {
  const iconColor = focused ? AppColors.active : AppColors.inactive;
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]); 
  const [showFilters, setShowFilters] = useState(false);
  const searchInputRef = useRef<TextInput>(null);

  const allItems = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry', 'Fig', 'Grape'];

  const handleSearchChange = (text: string) => {
    setSearchText(text);

    // Filter items based on search text
    const filteredResults = allItems.filter((item) =>
      item.toLowerCase().includes(text.toLowerCase())
    );

    setSearchResults(filteredResults);
    setShowFilters(text.length > 0 && filteredResults.length > 0);
  };

  const clearSearch = () => {
    setSearchText('');
    setSearchResults([]);
    setShowFilters(false);
  };
  
  return (
    <>
      <KeyboardAvoidingView>
        {searchText.length > 0 && (
            <View style={styles.overlay} />
)}
        <View style={styles.headerContainer}>
          <TouchableOpacity style={styles.arrowContainer} onPress={() => console.log('Home')}>
            <House  size={size} weight="duotone" color={iconColor} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.inputContainer}>
            <MagnifyingGlass size={size} weight="duotone" color={iconColor} />
            <TextInput
              ref={searchInputRef}
              placeholder="Search Something Here"
              maxLength={30}
              style={styles.searchInput}
              value={searchText.trim()}
              onChangeText={handleSearchChange}
              autoCapitalize="none"
              clearTextOnFocus
              inputMode="text"
              showSoftInputOnFocus
            />
            {searchText.length > 0 && (
              <TouchableOpacity
                onPress={clearSearch}
                style={{ justifyContent: 'flex-end', position: 'absolute', right: 10 }}
              >
                <XCircle size={size} weight="duotone" color={AppColors.inactive} />
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        </View>
        {showFilters && (
          <View style={styles.filterContainer}>
            {searchResults.map((result, index) => (
              <TouchableOpacity key={index} style={styles.filterButton}>
                <Text style={styles.filterText}>{result}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
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
  inputContainer: {
    padding: 5,
    backgroundColor: AppColors.backgroundColor,
    borderRadius: AppConstants.borderRadius,
    elevation: 5,
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: AppConstants.fontSize,
    color: lightTheme.text,
  },
  filterContainer: {
    position: "absolute",
    top: 100,
    left: 0,
    right: 0,
    padding: 5,
    backgroundColor: AppColors.backgroundColor,
    borderRadius: AppConstants.borderRadius,
    elevation: 5,
    paddingHorizontal: 10,
    marginHorizontal: 10,
    zIndex: 100,
  },
  filterButton: {
    borderBottomWidth: 0.3,
    borderBottomColor: AppColors.inactive,
    borderRadius: AppConstants.borderRadius,
    marginVertical: 3,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  filterText: {
    color: lightTheme.text,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  overlay: {
    flex: 1,
    position: "absolute",
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 100,
  },
});