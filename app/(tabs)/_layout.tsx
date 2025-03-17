import { Image, ImageBackground, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import { images } from '@/constants/images'
import { icons } from '@/constants/icons'

const TabIcon = ({focused, icon, title}: any) => {
  if(!focused){
    return (
      <View className='size-full justify-center items-center mt-4 rounded-full'>
        <Image source={icon} tintColor={`${title ? '#A8B5DB' : null}`} className={`${title ? 'size-5' : 'size-10'}`}/>
      </View>
    )
  }
  return (
    <ImageBackground
    source={images.highlight}
    className={`${title ? 'flex flex-row w-full flex-1 min-w-[112px] min-h-16 mt-4 justify-center items-center rounded-full overflow-hidden' : 'flex flex-row w-full flex-1 min-w-[70px] min-h-16 mt-4 justify-center items-center rounded-full overflow-hidden'}`}
    >
      <Image source={icon} tintColor={`${title ? '#151312' : null}`} className={`${title ? 'size-5' : 'size-10'}`} />
      {title && <Text className='text-secondary text-base font-semibold ml-2'>{title}</Text>}
      
    </ImageBackground>
  )
}

const _layout = () => {
  return (
    <Tabs
    screenOptions={{
      tabBarShowLabel: false,
      tabBarItemStyle: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
      },
      tabBarStyle: {
        backgroundColor: '#0f0D23',
        borderRadius: 50,
        marginHorizontal: 20,
        marginBottom: 36,
        height: 52,
        position: 'absolute',
        overflow: 'hidden',
        borderWidth: 0,
        borderColor: '#0f0D23'
      }
    }}
    >
        <Tabs.Screen 
        name='index'
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <TabIcon focused={focused} icon={icons.home} title="Home"/>
          )
        }}
        />
        <Tabs.Screen 
        name='search'
        options={{
          title: 'Search',
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <TabIcon focused={focused} icon={icons.search} title="Search"/>
          )
        }}
        />
        <Tabs.Screen 
        name='smartSearch'
        options={{
          title: 'Smart Search',
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <TabIcon focused={focused} icon={icons.aiSearch} title=""/>
          )
        }}
        />
        <Tabs.Screen 
        name='profile'
        options={{
          title: 'Profile',
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <TabIcon focused={focused} icon={icons.person} title="Profile"/>
          )
        }}
        />
    </Tabs>
  )
}

export default _layout

const styles = StyleSheet.create({})