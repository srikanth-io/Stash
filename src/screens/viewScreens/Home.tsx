import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import TabHeaderBar from '../../components/TabHeaderBar'

const Home = () => {
  return (
    <View>
      <TabHeaderBar focused={false}/>
      <Text>Home</Text>
    </View>
  )
}

export default Home

const styles = StyleSheet.create({})