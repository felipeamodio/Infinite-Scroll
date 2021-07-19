import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator } from 'react-native';

import axios from 'axios';

export default function App() {
  const baseUrl = 'https://api.github.com';
  const perPage = 20;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  
  useEffect(() => {
    loadApi();
  }, []);

  async function loadApi(){
    if(loading) return;

    setLoading(true);

    const response = await axios.get(`${baseUrl}/search/repositories?q=react&per_page=${perPage }&page=${page}`)

    setData([...data, ...response.data.items]);
    setPage(page + 1);
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <FlatList 
        style={{marginTop: 35}}
        contentContainerStyle={{marginHorizontal: 20}}
        data={data}
        keyExtractor={item => String(item.id)} //convertendo q todos os ids venham como string
        renderItem={({item}) => <ListItem data={item} />}
        onEndReached={loadApi} //chamar a função para carregar novamente
        onEndReachedThreshold={0.1} //quando estiver chegando em 10% do final da página ele vai chamando mais
        ListFooterComponent={<FooterList Load={loading} />} //vai ser renderizado quando chegar no final
      />
    </View>
  );
}

function ListItem({data}){
  return(
    <View style={styles.listItem}>
      <Text style={styles.listText}>{data.full_name}</Text>
    </View>
  )
}

function FooterList({Load}){
  if(!Load) return null;
  return(
    <View style={styles.loading}>
      <ActivityIndicator size={25} color="#121212" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listItem: {
    backgroundColor: '#121212',
    padding: 25,
    marginTop: 30,
    borderRadius: 10
  },
  listText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold'
  },
  loading: {
    padding: 10
  }
});
