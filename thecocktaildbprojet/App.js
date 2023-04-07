import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Modal, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-elements';

export default function App() {
  const [cocktails, setCocktails] = useState([]);
  const [selectedCocktail, setSelectedCocktail] = useState(null);

  useEffect(() => {
    fetch('https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=Cocktail')
      .then(response => response.json())
      .then(data => setCocktails(data.drinks))
      .catch(error => console.error(error));
  }, []);

  const handleSelectCocktail = (cocktail) => {
    fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${cocktail.idDrink}`)
      .then(response => response.json())
      .then(data => {
        const ingredients = [];
        const measures = [];
        for (let i = 1; i <= 15; i++) {
          const ingredient = data.drinks[0][`strIngredient${i}`];
          const measure = data.drinks[0][`strMeasure${i}`];
          if (ingredient) {
            ingredients.push(ingredient);
            measures.push(measure);
          }
        }
        setSelectedCocktail({ ...cocktail, ingredients, measures })
      })
      .catch(error => console.error(error));
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        {cocktails.map(cocktail => (
          <TouchableOpacity key={cocktail.idDrink} onPress={() => handleSelectCocktail(cocktail)}>
            <Card>
              <Card.Title>{cocktail.strDrink}</Card.Title>
              <Card.Image source={{ uri: cocktail.strDrinkThumb }} />
              <Text>{cocktail.strInstructions}</Text>
            </Card>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {selectedCocktail &&
        <Modal
          visible={true}
          animationType="slide"
          onRequestClose={() => setSelectedCocktail(null)}
        >
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>{selectedCocktail.strDrink}</Text>
            <Text style={styles.modalSubtitle}>Ingredients:</Text>
            <View style={styles.ingredientsList}>
              {selectedCocktail.ingredients.map((ingredient, index) => (
                <Text style={styles.modalText} key={ingredient}>
                  {ingredient} - {selectedCocktail.measures[index]}
                </Text>
              ))}
            </View>
            <TouchableOpacity onPress={() => setSelectedCocktail(null)}>
              <Text style={styles.modalClose}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalSubtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 40,
    marginBottom: 20,
  },
  modalClose: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'blue',
  },
});
