import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import TabHeaderBar from '../../components/TabHeaderBar'

const TimeSheet = () => {
  return (
    <View>
      <TabHeaderBar focused={false}/>
      <Text>TImesheet</Text>
    </View>
  )
}

export default TimeSheet

const styles = StyleSheet.create({})