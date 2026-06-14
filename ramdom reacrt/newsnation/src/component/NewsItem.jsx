import React, { Component } from 'react';

export default class NewsItem extends Component {
  render() {
    let { title, url, description, urltoimg, publishedAt, source } = this.props;

    return (
      <div className="relative cursor-pointer max-w-sm mx-auto my-6 bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden transition-transform transform hover:scale-105 hover:shadow-3xl text-white">

        {/* Source badge at top like a price tag */}
        <span className="absolute top-4 left-4 bg-purple-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg z-10">
          {source || 'Unknown'}
        </span>

        {/* Image */}
        <div className="h-48 w-full overflow-hidden">
          <img
            src={urltoimg}
            alt="News"
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          />
        </div>

        {/* Content */}
        <div className="p-6">
          <h2 className="text-xl font-bold tracking-tight mb-3">{title}</h2>
          <p className="text-white/90 text-sm leading-relaxed">{description}</p>
          
          <div className="mt-6 flex justify-between items-center text-white/70 text-xs">
            <span>{new Date(publishedAt).toLocaleString('en-IN')}</span>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-full bg-purple-500/20 border border-white/30 hover:bg-purple-500/30 transition"
            >
              Read More →
            </a>
          </div>
        </div>
      </div>
    );
  }
}
