import { Text, TextInput, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Image } from 'react-native'
import { icons } from '@/constants/icons'

interface Props{
    placeholder: string,
    value?: string,
    onChangeText?: (text: string) => void;
    onPress?: () => void;
    onSubmitEditing?: () => void;
}
const SearchBar = ({placeholder, onPress, value, onChangeText, onSubmitEditing}: Props) => {
  return (
    <View className='flex-row items-center bg-dark-100 px-5 py-1 rounded-full'>
      <Image source={icons.search} className='size-5' resizeMode='contain' tintColor="#ab8bff" />
      <TextInput 
      onPress={onPress}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      onSubmitEditing={onSubmitEditing}
      placeholderTextColor="#a8b5db"
      className='flex-1 ml-2 text-white'
      />
      {value ? (
        <TouchableOpacity onPress={() => onChangeText && onChangeText('')}>
          <Image source={icons.cross} className='size-5' resizeMode='contain' tintColor="#ab8bff" />
        </TouchableOpacity>
      ) : null}
    </View>
  )
}

export default SearchBar
