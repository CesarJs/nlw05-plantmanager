import React from 'react';
import { StyleSheet , Text, View } from 'react-native';

import LottieView from 'lottie-react-native';

import loadAnimation from '../assets/load.json';

export function Load(){
	return(
		<View style={styles.container}>
			{/* <LottieView
				source={loadAnimation}
				autoPlay
				loop
				style={styles.animation}
			/> */}
			<Text>Finge que é um loading</Text>
		</View>
	)
}

const styles = StyleSheet.create({
	container:{
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'

	},
	animation:{
		backgroundColor: 'transparent',
		width: 200,
		height: 200
	},

});
