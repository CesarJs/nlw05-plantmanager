import React, { useEffect, useState } from 'react';
import {
	StyleSheet,
	Text,
	View,
	FlatList,
	ActivityIndicator
 } from 'react-native';
import { EviromentButton } from '../components/EviromentButton';

import { Header } from '../components/Header';
import { PlantCartPrimary } from '../components/PlantCardPrimary';
import { Load } from '../components/Load';
import api from '../services/api';
import colors from '../styles/colors';
import fonts from '../styles/fonts';
import { color } from 'react-native-reanimated';

interface EnviromentProps {
	key: string;
	title: string;
}
interface PlantsProps {
	id: 1,
      name: string;
      about: string;
      water_tips:  string;
      photo:  string;
      environments: Array<string>;
      frequency: FrequencyProps;
}
interface FrequencyProps {
	times: number;
	repeat_every: string;
}
export function PlantSelect(){
	const [enviroments,  setEnviroments] = useState<EnviromentProps[]>([]);
	const [plants,  setPlants] = useState<PlantsProps[]>([]);
	const [filteredPlants,  setFilteredPlants] = useState<PlantsProps[]>([]);
	const [enviromentsSelected, setEnviromentsSelected] = useState('all');
	const [loading, setLoading] = useState(true);

	const [page, setPage] = useState(1);
	const [loadingMore, setLoadingMore] = useState(true);
	const [loadedAll, setLoadedAll] = useState(false);

	function handleEnviromentSelected(enviroment: string){

		setEnviromentsSelected(enviroment);
		if(enviroment == 'all'){
			return setFilteredPlants(plants);
		}

		const filtered = plants.filter(plant => plant.environments.includes(enviroment));
		return setFilteredPlants(filtered);
	}

	function handleFetchMore(distance: number){
		if(distance < 1) {
			return ;
		}
		setLoadingMore(true);
		setPage(oldValue => oldValue + 1);
		fechPlants();
	}

	async function fechPlants(){

		const { data } = await api.get(`plants?_sort=name&_order=asc&_page=${page}&_limit=8`);
		if(!data){
			return setLoading(true);
		}

		if(page > 1) {
			setPlants(oldValue => [...oldValue, ...data]);
			setFilteredPlants(oldValue => [...oldValue, ...data]);
		}else{
			setPlants(data);
			setFilteredPlants(data);
		}
		setLoading(false);
		setLoadingMore(false);
	}
	useEffect(() => {
		async function fechEnviroment(){
			const { data } = await api
									.get('plants_environments?_sort=title&_order=asc');

			setEnviroments([
				{
					key: 'all',
					title: 'Todos'
				},
				...data
			]);
		}

		fechEnviroment();
	}, []);

	useEffect(() => {

		fechPlants();
	}, []);

	if(loading) {
		return <Load />
	}
	return(
		<View style={styles.container  }>
			<View style={styles.header}>
				<Header />
				<Text style={styles.title}>
					Em qual ambiente
				</Text>
				<Text style={styles.subtitle}>
					você quer colocar sua planta ?
				</Text>
			</View>
			<View>
				<FlatList
					data={enviroments}
					renderItem={({item})=>(
						<EviromentButton
							title={item.title}
							active={item.key === enviromentsSelected}
							onPress={() => handleEnviromentSelected(item.key)}
							/>
					)}
					horizontal
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={styles.enviromentList}
				/>
			</View>
			<View style={styles.plants}>
				<FlatList
					data={filteredPlants}
					renderItem={({item})=>(
						<PlantCartPrimary
							data={item}
							/>
					)}
					showsVerticalScrollIndicator={false}
					numColumns={2}
					contentContainerStyle={styles.contentContainerStyle}
					onEndReachedThreshold={0.1}
					onEndReached={({distanceFromEnd}) =>
						handleFetchMore(distanceFromEnd)
					}
					ListFooterComponent={
						loadingMore
						?<ActivityIndicator color={colors.green} />
						:<></>
					}
				/>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background

	},
	header: {
		paddingHorizontal: 30
	},
	title: {
		fontSize: 17,
		color: colors.heading,
		fontFamily: fonts.heading,
		lineHeight: 20,
		marginTop: 15
	},
	subtitle: {
		fontFamily: fonts.complement,
		fontSize: 17,
		lineHeight: 20,
		color: colors.heading

	},
	enviromentList:{
		height: 40,
		justifyContent: 'center',
		paddingBottom: 5,
		marginLeft: 32,
		marginVertical: 32
	},
	plants: {
		flex: 1,
		paddingHorizontal: 32,
		justifyContent: 'center'
	},
	contentContainerStyle:{

	}
});
