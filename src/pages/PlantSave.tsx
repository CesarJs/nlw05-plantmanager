import React, { useState } from 'react';

import  {
	Alert,
	StyleSheet,
	Text,
	View,
	ScrollView,
	Platform,
	TouchableOpacity,
	Image
} from 'react-native';
import { getBottomSpace } from 'react-native-iphone-x-helper';
import { useNavigation, useRoute } from '@react-navigation/core';
import DateTimePicker, { Event } from '@react-native-community/datetimepicker';
import { format, isBefore } from 'date-fns';

import { SvgFromUri } from 'react-native-svg';

import WaterDrop from '../assets/waterdrop.png';
import { Button } from '../components/Button';
import colors from '../styles/colors';
import fonts from '../styles/fonts';

import { PlantProps, savePlant } from '../libs/storage';

interface Params {
	plant: PlantProps;
}

export function PlantSave(){
	const route = useRoute();
	const { plant } = route.params as Params;
	const [ selectedDateTime, setSelectedDateTime ] = useState(new Date());
	const [ showDatePicker, setShowDatePicker] = useState( Platform.OS == 'ios' );
	const navigation = useNavigation();

	function handleChangeTime(event: Event, dateTime: Date | undefined) {
		if(Platform.OS == 'android'){
			setShowDatePicker(oldState => !oldState);
		}

		if(dateTime && isBefore(dateTime, new Date())){
			setSelectedDateTime(new Date());
			return Alert.alert('Escolha uma hora no futuro! 👀');
		}

		if(dateTime){
			setSelectedDateTime(dateTime);
		}
	}
	function handleOpenDateTimePickerAndroid(){
		setShowDatePicker(oldState => !oldState);
	}
	async function handleSavePlant(){
		// const dataTeste = await loadPlant();
		// console.log(dataTeste);
		// return true;
		try {
			await savePlant({
				...plant,
				dateTimeNotification: selectedDateTime
			});

			navigation.navigate('Confirmation',{
				title: 'Tudo certo',
				subTitle: 'Fique Tranquilo que sempre vamos lembrar você de cuidar da sua plantinha com muito cuidado',
				buttonTitle: 'Muito Obrigado',
				icon:'fest',
				nextScreen: 'PlantSelect'
			});
		} catch (error) {
			Alert.alert('Não foi possivel cadastrar a planta 🥲');
		}
	}

	return(
		<View style={styles.container}>
			<View style={styles.plantInfo}>
				<SvgFromUri
					uri={plant.photo}
					height={150}
					width={150}
				/>
				<Text style={styles.plantName}>
					{plant.name}
				</Text>
				<Text style={styles.plantAbout}>
					{plant.about}
				</Text>

			</View>
			<View style={styles.controlled}>
				<View style={styles.tipContainer}>
					<Image
						source={WaterDrop}
						style={styles.tipImage}
						/>
					<Text style={styles.tipText}>
						{plant.water_tips}
					</Text>
				</View>
				<Text style={styles.alertLabel}>
					Escola o melhor horário para ser lembrado:
				</Text>
				{showDatePicker && (
					<DateTimePicker
					value={selectedDateTime}
					mode="time"
					display="spinner"
					onChange={handleChangeTime}
					/>
				)}

				{
					Platform.OS === 'android' && (
						<TouchableOpacity
							onPress={handleOpenDateTimePickerAndroid}
							style={styles.dataTimePickerButton}
							>
							<Text style={styles.dateTimePickerText}>
								{`Mudar ${format(selectedDateTime, 'HH:mm')}`}
							</Text>
						</TouchableOpacity>
					)
				}
				<Button
					title="Cadastrar Planta"
					onPress={handleSavePlant}
				/>
			</View>
		</View>
	)
}


const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'space-between',
		backgroundColor: colors.shape
	},
	plantInfo: {
		flex: 1,
		paddingHorizontal: 30,
		paddingVertical: 50,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: colors.shape
	},
	plantName: {
		fontFamily: fonts.heading,
		fontSize: 24,
		color: colors.heading,
		marginTop: 15
	},
	plantAbout: {
		textAlign: 'center',
		fontFamily: fonts.text,
		color: colors.heading,
		fontSize: 17,
		marginTop: 10

	},
	controlled: {
		backgroundColor: colors.white,
		paddingHorizontal: 20,
		paddingTop: 20,
		paddingBottom: getBottomSpace() || 20
	},
	tipContainer: {
		flexDirection: 'row',
		justifyContent:'space-between',
		alignItems: 'center',
		backgroundColor: colors.blue_light,
		padding: 20,
		borderRadius: 20,
		position: 'relative',
		bottom: 60
	},
	tipImage:{
		width: 56,
		height: 56,

	},
	tipText:{
		flex : 1 ,
		marginLeft: 20,
		fontFamily: fonts.text,
		fontSize: 17,
		textAlign: 'justify'

	},
	alertLabel:{
		textAlign: 'center',
		fontFamily: fonts.complement,
		color: colors.heading,
		fontSize: 12,
		marginBottom: 5

	},
	dataTimePickerButton:{
		width: '100%',
		alignItems: 'center',
		paddingVertical: 40,
	},

	dateTimePickerText: {
		color: colors.heading,
		fontSize: 24,
		fontFamily: fonts.text
	}
});
