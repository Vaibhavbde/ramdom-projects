import React, { Component } from 'react';
import NewsItem from './NewsItem';
import Spinner from './Spinner';

export default class News extends Component {
  constructor() {
    super();
    this.state = {
      articles: [],
      loading: false,
      page: 1,
      totalResults: 0,
    };
  }

  fetchNews = async () => {
    try {
      this.setState({ loading: true });

      const url = `https://newsapi.org/v2/top-headlines?language=en&topic=war&apiKey=ec99413521d1466f93d13e557c5080df&page=${this.state.page}&pageSize=6`;
      const response = await fetch(url);
      const data = await response.json();

      this.setState({
        articles: data.articles,
        totalResults: data.totalResults,
        loading: false,
      });
    } catch (err) {
      console.error("Couldn't fetch news", err);
    }
  };

  componentDidMount() {
    this.fetchNews();
  }

  handleNext = () => {
    if (this.state.page + 1 <= Math.ceil(this.state.totalResults / 6)) {
      this.setState(
        (prevState) => ({ page: prevState.page + 1 }),
        () => this.fetchNews()
      );
    }
  };

  handlePrev = () => {
    if (this.state.page > 1) {
      this.setState(
        (prevState) => ({ page: prevState.page - 1 }),
        () => this.fetchNews()
      );
    }
  };

  render() {
    return (
      <div className="px-4 py-6 min-h-screen">
        <h1 className="text-center text-3xl font-extrabold mb-1 tracking-wider text-white">
          📰 Top Headlines
        </h1>
        <p className="text-center text-sm text-white/70 mb-6">
          {new Date().toLocaleDateString('en-IN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>


        {this.state.loading ? (
          <div className="flex justify-center items-center h-48">
            <Spinner />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 px-4 py-6">
            {this.state.articles.map((element, index) => (
              <NewsItem
                key={index}
                title={element.title}
                description={element.description || "No description available."}
                url={element.url}
                urltoimg={element.urlToImage || "https://thumbs.dreamstime.com/b/news-newspapers-folded-stacked-word-wooden-block-puzzle-dice-concept-newspaper-media-press-release-42301371.jpg"}
              />
            ))}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-8 px-4">
          <button
            disabled={this.state.page === 1}
            onClick={this.handlePrev}
            className="px-5 py-2 bg-gray-600/30 border border-white/20 text-white rounded-full hover:bg-gray-700/20 hover:scale-105 transition duration-300"
          >
            ⬅ Prev
          </button>

          <span className="text-white text-sm">Page {this.state.page}</span>

          <button
            disabled={this.state.page >= Math.ceil(this.state.totalResults / 6)}
            onClick={this.handleNext}
           className="px-5 py-2 bg-gray-600/30 border border-white/20 text-white rounded-full hover: bg-gray-700/20 hover:scale-105 transition duration-300"
          >
            Next ➡
          </button>
        </div>
      </div>
    );
  }
}
