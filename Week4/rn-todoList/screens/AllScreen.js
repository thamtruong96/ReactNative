import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Alert, TextInput, ScrollView,
  ImageBackground,
  KeyboardAvoidingView
} from 'react-native';
import { TODOS } from '../utils/data.js';

const TodoItem = props => {
  const statusStyle = {
    backgroundColor: props.todo.status === 'Done' ? 'white' : 'green'
  };

  const onLongPress = todo => {
    const prompt = `"${todo.body}"`;
    Alert.alert(
      'Delete your todo?',
      prompt,
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel'
        },
        { text: 'OK', onPress: () => props.onDeleteTodo(todo.id) }
      ],
      { cancelable: true }
    );
  };

  return (
    <TouchableOpacity
      key={props.todo.body}
      style={[styles.todoItem, statusStyle]}
      onPress={() => props.onToggleTodo(props.todo.id)}
      onLongPress={() => onLongPress(props.todo)}
    >
      <Text style={styles.todoText}>
        {props.idx + 1}: {props.todo.body}
      </Text>
    </TouchableOpacity>
  );
}
export default class AllScreen extends React.Component {

  constructor(props) {
    super();
    this.state = {
      todoList: TODOS,
      todoBody: '',
    }
  }

  setTodoList = newTodoList => {
    this.setState({
      todoList: newTodoList
    });
  }

  setTodoBody = newTodoBody => {
    this.setState({
      todoBody: newTodoBody
    })
  }

  onToggleTodo = id => {
    const tdList = this.state.todoList;
    const todo = tdList.find(todo => todo.id === id);
    todo.status = todo.status === 'Done' ? 'Active' : 'Done';
    const foundIndex = tdList.findIndex(todo => todo.id === id);
    tdList[foundIndex] = todo;
    const newTodoList = [...tdList];
    this.setTodoList(newTodoList);

    setTimeout(() => {
      this.props.navigation.navigate('SingleTodo', {
        updatedTodo: todo
      });
    }, 2000);
  };

  onDeleteTodo = id => {
    const newTodoList = this.state.todoList.filter(todo => todo.id !== id);
    this.setTodoList(newTodoList);
  };

  onSubmitTodo = () => {
    const newTodo = {
      body: this.state.todoBody,
      status: 'Active',
      id: this.state.todoList.length + 1
    };
    const newTodoList = [...this.state.todoList, newTodo];
    this.setTodoList(newTodoList);
    this.setTodoBody('');
  };

  render() {
    return (
      <ImageBackground style={styles.container} source={require("../assets/images/background.jpg")}>
        <KeyboardAvoidingView
          enabled
          behavior="padding"
          style={styles.keyboard}
        >
          <ScrollView style={{ flex: 1 }}>
            <View style={{ marginTop: 20 }}>
              {this.state.todoList.map((todo, idx) => {
                return (
                  <TodoItem
                    idx={idx}
                    todo={todo}
                    key={todo.body}
                    onToggleTodo={this.onToggleTodo}
                    onDeleteTodo={this.onDeleteTodo}
                  />
                );
              })}
              <View style={styles.inputContainer}>
                <TextInput
                  value={this.state.todoBody}
                  style={styles.todoInput}
                  onChangeText={text => this.setTodoBody(text)}
                />
                <TouchableOpacity style={styles.button} onPress={this.onSubmitTodo}>
                  <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    );
  }
}

AllScreen.navigationOptions = {
  title: 'All Todos'
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    // backgroundColor: 'black',
    justifyContent: 'center'
  },
  todoItem: {
    margin: 5,
    padding: 10,
    minHeight: 50,
    width: '95%',
    color: 'black',
    borderRadius: 5,
    flexWrap: 'wrap',
    borderColor:'#c2c2c2'
  },
  todoText: {
    fontSize: 20,
    color: 'black',
    // fontWeight: 'bold'
  },
  todoInput: {
    width: '100%',
    minHeight: 40,
    color: 'white',
    borderWidth: 1,
    marginTop: '20%',
    marginBottom: '5%',
    borderColor: 'blue',
    borderRadius: 10,
    paddingHorizontal:10,
    fontSize: 14
  },
  inputContainer: {
    flex: 1,
    width: '95%',
    marginTop: 20,
    marginBottom: '10%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 100
  },
  button: {
    height: 50,
    width: '50%',
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: 'blue',
    justifyContent: 'center'
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold'
  },
  scrollView: {
    flex: 1,
    paddingTop: 1000
  },
  keyboard: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center'
  }
});