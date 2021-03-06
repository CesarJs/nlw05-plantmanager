import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/core';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
	SafeAreaView,
	StyleSheet,
	Text,
	TextInput,
	View,
	KeyboardAvoidingView,
	Platform,
	Alert
} from 'react-native';

import { Button } from '../components/Button';

import colors from '../styles/colors';
import fonts from '../styles/fonts';

export function UserIndentification(){
	const [isFocused, setIsFocused] = useState(false);
	const [isFilled, setIsFilled] = useState(false);
	const [name, setName] = useState<string>();
	const navigation = useNavigation();

	useEffect(() => {
		async function nameExists(){
			const nameExists = await AsyncStorage.getItem('@plantmanager:user');
			setName(nameExists || '');
		}

		nameExists();
	}, []);
	function handleInputBlur(){
		setIsFocused(false);
		setIsFilled(!!name);
	}
	function handleInputFocus(){
		setIsFocused(true);
	}

	function handleInputChange(value: string) {
		setIsFocused(!!value);
		setName(value);
	}

	async function handleSubmit(){
		if(!name){
			return Alert.alert('Me diz como chamar você 🥲');
		}
		try {
			navigation.navigate('Confirmation',{
				title: 'Prontinho',
				subTitle: 'Agora vamos começar a cuidar das suas plantinhas com muito cuidado',
				buttonTitle: 'Começar',
				icon:'smile',
				nextScreen: 'PlantSelect'
			});
			await AsyncStorage.setItem('@plantmanager:user', name);
		} catch (error) {
			return Alert.alert('Não foi possivel salvar o seu nome 🥲');
		}
	}
	return (
		<SafeAreaView style={styles.container}>
			<KeyboardAvoidingView
				style={styles.content}
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			>

				<View style={styles.content}>

					<View style={styles.form}>
						<View style={styles.header}>
						<Text style={styles.emoji}>
							{isFilled ? '🥰' : '🤗'}
						</Text>
						<Text style={styles.title}>
							Como podemos {'\n'}
							chamar você ?
						</Text>
						</View>
						<TextInput
							style={[
								styles.input,
								(isFocused || isFilled) && {borderColor: colors.green}
							]}
							placeholder="Digite um nome"
							onBlur={handleInputBlur}
							onFocus={handleInputFocus}
							onChangeText={handleInputChange}
							value={name}
							/>
						<View style={styles.footer}>
							<Button
							onPress={handleSubmit}
							title="Continuar"/>
						</View>

					</View>
				</View>
			</KeyboardAvoidingView>
		</SafeAreaView>
	)
}
 const styles = StyleSheet.create({
	 container: {
		flex: 1,
		width: '100%',
		alignItems: 'center',
		justifyContent: 'space-around'
	 },
	 content: {
		flex: 1,
		width: '100%'
	 },
	 form: {
		flex: 1,
		justifyContent: 'center',
		paddingHorizontal: 54,
		alignItems: 'center',

	 },
	 emoji:{
		fontSize: 44
	 },
	 header:{
		 alignItems: 'center'
	 },
	 input:{
		 borderBottomWidth: 1,
		 borderColor: colors.gray,
		 color: colors.heading,
		 width: '100%',
		 fontSize: 18,
		 marginTop: 50,
		 padding: 10,
		 textAlign: 'center'
	 },
	 title: {
		fontSize: 24,
		lineHeight: 32,
		textAlign: 'center',
		color: colors.heading,
		fontFamily: fonts.heading,
		marginTop: 20
	 },
	 footer:{
		marginTop: 40,
		width: '100%',
		paddingHorizontal: 20
	 }
 });
