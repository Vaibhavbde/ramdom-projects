import React, { Component } from 'react';
import NewsItem from './NewsItem';
import Spinner from './Spinner';
import InfiniteScroll from 'react-infinite-scroll-component';

export default class News extends Component {
  constructor(props) {
    super(props);
    // Local component state
    this.state = {
      articles: [],        // Array to hold news articles
      loading: true,       // Whether we are currently fetching data
      page: 1,             // Current page number for pagination
      totalResults: 0,     // Total number of articles available from API
    };
  }

  /**
   * Called after the component mounts for the first time.
   * It triggers the initial API call to fetch news.
   */
  componentDidMount() {
    this.fetchNews();
  }

  /**
   * Called when the component updates due to new props.
   * If the selected category changes, we reset the state and fetch new data.
   */
  componentDidUpdate(prevProps) {
    if (prevProps.category !== this.props.category) {
      this.setState(
        {
          articles: [],        // clear old articles
          totalResults: 0,
          loading: true,
          page: 1,
        },
        () => this.fetchNews()  // Callback after state resets , make this as function so it executes only after state changes
      );
    }
  }

  /**
   * Async function to fetch news from the API. Async because fetching takes time and otherwise the function would not be synchronous
   * Uses await to pause execution until data is fetched. Await waits for a promise.
   */
  fetchNews = async () => {
    this.setState({ loading: true });         // Start spinner
    this.props.setProgress(30);               // Trigger progress bar (30%)

    // Constructing API URL dynamically
    const url = `https://newsapi.org/v2/top-headlines?language=en&category=${this.props.category}&apiKey=${this.props.apikey}&pageSize=10&page=${this.state.page}`;

    try {
      // Awaiting response from API (this pauses execution here)
      const response = await fetch(url);
      const data = await response.json();     // Awaiting the parsed JSON data

      this.props.setProgress(60);

      this.setState((prevState) => ({
        // Append new articles to existing ones
        articles: prevState.articles.concat(data.articles || []),
        totalResults: data.totalResults || 0, // Use totalResults field from API
        loading: false,
      }));

      this.props.setProgress(90);
    } catch (err) {
      console.error("❌ Could not fetch news: ", err);
      this.setState({ loading: false });     // Stop spinner if error
    }

    this.props.setProgress(100);             // Complete progress bar
  };

  /**
   * Loads more data for infinite scroll.
   * Increments page, then fetches the next set of news articles.
   */
  fetchMoreData = () => {
    this.setState(
      (prevState) => ({ page: prevState.page + 1 }), // Go to next page
      () => this.fetchNews()                         // Then fetch
    );
  };

  render() {
    const { articles, loading, totalResults } = this.state;

    return (
      <div className="px-4 py-6 min-h-screen">
        {/* Page Title */}
        <h1 className="text-center text-3xl font-extrabold mb-1 tracking-wider text-white">
          📰 Top Headlines
        </h1>

        {/* Date Display */}
        <p className="text-center text-sm text-white/70 mb-6">
          {new Date().toLocaleDateString('en-IN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>

        {/* Infinite Scroll starts here */}
        <InfiniteScroll
          dataLength={articles.length}                             // Length of current article list
          next={this.fetchMoreData}                                // What to do on scroll down
          hasMore={articles.length < totalResults}                 // Whether more data is available
          loader={
            <div className="flex justify-center items-center py-6">
              <Spinner />
            </div>
          }
          endMessage={
            !loading && (
              <p className="text-center text-white/50 py-4">
                You are all caught up! 🎉
              </p>
            )
          }
        >
          {/* Grid of News Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 px-4 py-6">
            {articles.map((element, index) => (
              <NewsItem
                key={index}
                title={element.title}
                description={element.description || 'No description available.'}
                url={element.url}
                urltoimg={
                  element.urlToImage ||
                  'https://thumbs.dreamstime.com/b/news-newspapers-folded-stacked-word-wooden-block-puzzle-dice-concept-newspaper-media-press-release-42301371.jpg'
                }
                publishedAt={element.publishedAt || 'No time available'}
                source={element.source?.name || 'Unknown'}
              />
            ))}
          </div>
        </InfiniteScroll>
      </div>
    );
  }
}