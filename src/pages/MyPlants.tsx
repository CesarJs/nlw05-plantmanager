import React, { useEffect, useState } from 'react';

import {
	StyleSheet,
	View,
	Text,
	Image
} from 'react-native';

import { Header } from '../components/Header';

import WaterDrop from '../assets/waterdrop.png';
import colors from '../styles/colors';
import { FlatList } from 'react-native-gesture-handler';
import { loadPlant, PlantProps } from '../libs/storage';
import { formatDistance } from 'date-fns/esm';
import { pt } from 'date-fns/locale';
import fonts from '../styles/fonts';
import { PlantCardScondary } from '../components/PlantCardScondary';


export function MyPlants(){

	const [ myPlants, setMyPlants] = useState<PlantProps[]>([]);
	const [ loadgin, setLoadig ] = useState(true);
	const [ nextWatered , setNextWatered ] = useState<string>();

	useEffect(() => {
		async function loadStoragedData(){
			const plantsStorage = await loadPlant();
			const nextTime = formatDistance(
				new Date(plantsStorage[0].dateTimeNotification).getTime(),
				new Date().getTime(),
				{ locale: pt }
			);

			setNextWatered(`Não esquece de regar a ${plantsStorage[0].name} à ${nextTime} horas`);
			setMyPlants(plantsStorage);
			setLoadig(false);
		}
		loadStoragedData();
	}, []);

	return (
		<View style={styles.container}>
			<Header/>
			<View style={styles.spotlight}>
				<Image
					source={WaterDrop}
					style={styles.spotlightImg}
				/>
				<Text style={styles.spotlightText}>
					{nextWatered}
				</Text>
			</View>
			<View style={styles.plants}>
				<Text style={styles.plantsTitle}>
					Proximas Regadas
				</Text>
				<FlatList
					data={myPlants}
					keyExtractor={(item) => String(item.id)}
					renderItem={({item}) => (
						<PlantCardScondary data={item} />
					)}
					showsVerticalScrollIndicator={false}
					contentContainerStyle={{flex: 1}}
				/>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container : {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 30,
		paddingTop: 50,
		backgroundColor: colors.background
	},
	spotlight: {
		backgroundColor: colors.blue_light,
		paddingHorizontal: 20,
		borderRadius: 20,
		height: 110,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	spotlightImg:{
		width: 60,
		height: 60,
	},
	spotlightText:{
		flex: 1,
		color:colors.blue,
		paddingHorizontal: 20,
	},
	plants:{
		flex: 1,
		width: '100%'
	},
	plantsTitle:{
		fontSize: 24,
		fontFamily: fonts.heading,
		color: colors.heading,
		marginVertical: 20
	},
	});
