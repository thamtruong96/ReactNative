import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator, FlatList, Linking } from 'react-native';
import moment from 'moment';
import { Card, Button, Icon } from 'react-native-elements';

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      articles: [],
      pageNumber: 1,
      hasErrored: false,
      lastPageReached: false
    }
  }

  componentDidMount() {
    this.getNews();
  }

  setLoading = (isLoading) => {
    this.setState({
      loading: isLoading
    })
  }

  setArticles = (newArticles) => {
    this.setState({
      articles: newArticles
    })
  }

  setPageNumber = (page) => {
    this.setState({
      pageNumber: page
    })
  }

  sethasErrored = (error) => {
    this.setState({
      hasErrored: error
    })
  }

  setLastPageReached = (isLastPage) => {
    this.setState({
      lastPageReached: isLastPage
    })
  }

  getNews = async () => {
    try {
      if (this.state.lastPageReached) return;
      console.log("Get news");
      var page = this.state.pageNumber;
      const response = await fetch(
        `https://newsapi.org/v2/top-headlines?country=us&apiKey=115ee238e0f84d7eb87b950b294ab6af&page=${page}`
      );
      const jsonData = await response.json();
      var oldArticles = this.state.articles;
      const hasMoreArticles = jsonData.articles.length > 0;
      if (hasMoreArticles) {
        const newArticleList = filterForUniqueArticles(
          oldArticles.concat(jsonData.articles)
        );
        this.setArticles(newArticleList);
        this.setPageNumber(page + 1);
      } else {
        this.setLastPageReached(true);
      }
    }
    catch (error) {
      console.log(error);
      this.sethasErrored(true);
    }
    this.setLoading(false);
  };

  renderArticleItem = ({ item }) => {
    return (
      <Card title={item.title} image={{ uri: item.urlToImage }}>
        <View style={styles.row}>
          <Text style={styles.label}>Source</Text>
          <Text style={styles.info}>{item.source.name}</Text>
        </View>
        <Text style={{ marginTop: 10 }}>{item.content}</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Published</Text>
          <Text style={styles.info}>
            {moment(item.publishedAt).format('LLL')}
          </Text>
        </View>
        <Button icon={<Icon />} title="Read more" backgroundColor="#03A9F4" onPress={() => this.onPress(item.url)} />
      </Card>
    );
  };

  onPress = url => {
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log(`Don't know how to open URL: ${url}`);
      }
    });
  };

  render() {
    if (this.state.loading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" loading={this.state.loading} />
        </View>
      );
    }
    if (this.state.hasErrored == true) {
      return (
        <View style={styles.container}>
          <Text>Error =(</Text>
        </View>
      );
    }
    return (
      <View>
        <View style={styles.row}>
          <Text style={styles.label}>Articles Count:</Text>
          <Text style={styles.info}>{this.state.articles.length}</Text>
        </View>
        <FlatList
          data={this.state.articles}
          renderItem={this.renderArticleItem}
          keyExtractor={item => item.title}
          onEndReached={this.getNews} onEndReachedThreshold={1}
          ListFooterComponent={this.state.lastPageReached ? <Text>No more articles</Text> : <ActivityIndicator
            size="large"
            loading={this.state.loading}
          />}
        />
      </View>
    )
  }
}

const filterForUniqueArticles = arr => {
  console.log("arr",arr);
  const cleaned = [];
  arr.forEach(itm => {
    let unique = true;
    cleaned.forEach(itm2 => {
      const isEqual = JSON.stringify(itm) === JSON.stringify(itm2);
      if (isEqual) unique = false;
    });
    if (unique) cleaned.push(itm);
  });
  console.log("cleaned",cleaned);
  return cleaned;
};

const styles = StyleSheet.create({
  containerFlex: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  container: {
    flex: 1,
    marginTop: 40,
    alignItems: 'center',
    backgroundColor: '#fff',
    justifyContent: 'center'
  },
  header: {
    height: 30,
    width: '100%',
    backgroundColor: 'pink'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30
  },
  label: {
    fontSize: 16,
    color: 'black',
    marginRight: 10,
    fontWeight: 'bold'
  },
  info: {
    fontSize: 16,
    color: 'grey'
  }
});
