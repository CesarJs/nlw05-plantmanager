import React from 'react';

import {
	StyleSheet,
	Text,
	Image,
	View
} from 'react-native';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';

import colors from '../styles/colors';
import avatar from '../assets/csr.png';
import fonts from '../styles/fonts';

export function Header(){
	return (
		<View style={styles.container}>
			<View>
				<Text style={styles.greeting}>Olá, </Text>
				<Text style={styles.userName}>Cesar  </Text>
			</View>
			<Image style={styles.avatar} source={avatar} />
		</View>
	)
}

const styles =  StyleSheet.create({
	container:{
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems:'center',
		paddingVertical: 20,
		marginTop: getStatusBarHeight(),
	},
	greeting:{
		fontSize: 30,
		color: colors.heading,
		fontFamily: fonts.complement
	},
	userName:{
		fontSize: 32,
		color: colors.heading,
		fontFamily: fonts.heading,
		lineHeight: 40
	},
	avatar:{
		width: 56,
		height: 56,
		borderRadius: 40,
	},
});
