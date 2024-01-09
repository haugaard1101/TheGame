import { database } from "./firebase";
import { updateDoc, doc } from "firebase/firestore";

import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const cardImages = [
  { src: "game_assets/chili.png", matched: false },
  { src: "game_assets/grapes.png", matched: false },
  { src: "game_assets/lemon.png", matched: false },
  { src: "game_assets/pineapple.png", matched: false },
  { src: "game_assets/strawberry.png", matched: false },
  { src: "game_assets/watermelon.png", matched: false },
];

export default function App() {
  const bestRoundId = "O9GGkzXkip3PklI6aDt9";

  const [cards, setCards] = useState([]);
  const [turns, setTurns] = useState(0);
  const [choiceOne, setChoiceOne] = useState(null);
  const [choiceTwo, setChoiceTwo] = useState(null);
  const [bestRound, setBestRound] = useState(0);

  async function updateBestRound() {
    await updateDoc(doc(database, "GameData", bestRoundId), {
      Turns: turns,
    });
    setBestRound(turns);
  }

  //handles choices
  const handleChoice = (card) => {
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card);
  };

  //compares cards
  useEffect(() => {
    if (choiceOne && choiceTwo) {
      if (choiceOne.src === choiceTwo.src) {
        setCards((prevCards) =>
          prevCards.map((card) =>
            card.src === choiceOne.src ? { ...card, matched: true } : card
          )
        );
        resetTurn();
      } else {
        setTimeout(() => {
          const updatedCards = cards.map((card) =>
            card.flipped && !card.matched ? { ...card, flipped: false } : card
          );
          setCards(updatedCards);
          resetTurn();
        }, 600);
      }
    }
  }, [choiceOne, choiceTwo]);

  //shuffle cards
  const shuffleCards = () => {
    const shuffledCards = [...cardImages, ...cardImages]
      .sort(() => Math.random() - 0.5)
      .map((card, index) => ({ ...card, id: index, flipped: false }));
    setCards(shuffledCards);

    if (bestRound == 0 || bestRound > turns) {
      updateBestRound();
      console.log(bestRound);
    }

    setTurns(0);
  };

  //reset choices and increase turns
  const resetTurn = () => {
    setChoiceOne(null);
    setChoiceTwo(null);
    setTurns((prevTurns) => prevTurns + 1);
  };

  //flips cards
  const flipCard = (cardId) => {
    const selectedCard = cards.find((card) => card.id === cardId);
    if (selectedCard.matched || selectedCard.flipped) {
      return;
    }
    const updatedCards = cards.map((card) =>
      card.id === cardId ? { ...card, flipped: true } : card
    );
    setCards(updatedCards);
    handleChoice(updatedCards.find((card) => card.id === cardId));
  };

  const HomePage = ({ navigation }) => {
    function switchPageButton() {
      navigation.navigate("GamePage", { shuffleCards });
    }

    return (
      <View style={styles.container}>
        <Text style={styles.headerText}>Fruit Match</Text>
        <TouchableOpacity onPress={switchPageButton}>
          <Text>GamePage</Text>
        </TouchableOpacity>
        <Text>Best Round: {bestRound}</Text>
      </View>
    );
  };

  const GamePage = ({ route }) => {
    const { shuffleCards } = route.params || {};

    function shuffleCardsButton() {
      resetTurn();
      shuffleCards();
    }

    return (
      <View style={styles.container}>
        <Text style={styles.headerText}>GamePage</Text>
        <TouchableOpacity onPress={shuffleCardsButton}>
          <Text>New Game</Text>
        </TouchableOpacity>

        <View style={styles.cardGrid}>
          {cards.map((card) => (
            <TouchableOpacity
              style={styles.card}
              key={card.id}
              onPress={() => flipCard(card.id)}
            >
              <Image
                source={
                  card.flipped || card.matched
                    ? { uri: card.src }
                    : require("./game_assets/cover.png")
                }
                style={styles.cardImage}
              />
            </TouchableOpacity>
          ))}
        </View>
        <Text>Turns: {turns}</Text>
      </View>
    );
  };

  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="HomePage">
        <Stack.Screen name="HomePage" component={HomePage} />
        <Stack.Screen name="GamePage" component={GamePage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  headerText: {
    fontSize: 24,
    marginBottom: 20,
  },
  cardGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 20,
  },
  card: {
    width: 80,
    height: 100,
    margin: 5,
    backgroundColor: "lightblue",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  cardImage: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
});
