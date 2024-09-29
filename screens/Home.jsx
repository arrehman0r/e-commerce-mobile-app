import React, { useEffect, useState } from 'react';
import { Card, List } from 'react-native-paper';
import { getAllCategories } from '../server/api';
import { View, Text } from 'react-native';
const Home = ({ navigation }) => {
    const [categories, setAllCategories] = useState([])
    const fetchAllCategories = async () => {
        const res = await getAllCategories();
        setAllCategories(res?.product_categories)

    }
    useEffect(() => {
        fetchAllCategories()
    }, [])

    return (
        <View>
            <Card>
                <Card.Cover source={{ uri: 'https://picsum.photos/700' }} />
            </Card>


            <List.AccordionGroup>
                {categories.length > 0 && categories.map((category) => (
                    <List.Accordion title={category.name} id={category.id} key={category?.id}>
                        <List.Item title={category.name} onPress={() => navigation.navigate("CategoryProducts", { categoryId: category?.id })} />
                    </List.Accordion>
                ))}

            </List.AccordionGroup></View>
    );
}

export default Home