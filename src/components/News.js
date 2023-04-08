import React, { useEffect, useState } from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import PropTypes from "prop-types";
// import InfiniteScroll from "react-infinite-scroll-component";

const News = (props) => {
  const [articles, setArticles] = useState([]);
  const [loading, setloading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalResults, settotalResults] = useState(0);

  
  const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const updateNews = async () => {
  props.setProgress(0);
  let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apikey}&page=${page}&pageSize=${props.pageSize}`;
  setloading(true);
  let data = await fetch(url);
  props.setProgress(30);

  let parsedata = await data.json();
  props.setProgress(70);

  setArticles(parsedata.articles);
  settotalResults(parsedata.totalResults);
  setloading(false);
  
  props.setProgress(100);
};
useEffect(() => {
  updateNews();
  document.title=`${capitalizeFirstLetter(props.category)}-NewsMonkey`;
}, []);

const handlepreviousclick = async () => {
  setPage(page - 1);
  updateNews();
};

const handlenextclick = async () => {
  setPage(page + 1);
  updateNews();
};

// const fetchMoreData =async () => {
  
//     let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apikey}&page=${page+1}&pageSize=${props.pageSize}`;
//     setPage(page+1)
//   let data = await fetch(url);

//   let parsedata = await data.json();
//   setArticles( articles.concat(parsedata.articles))
//   settotalResults(parsedata.totalResults)

// };

return (
  <div className="container my-3 ">
    <h1 className="text-center " style={{ margin: "50px 0px" }}>
      NewsMonkey - Top {capitalizeFirstLetter(props.category)} Headlines
    </h1>
    {loading && <Spinner />}
    {/* <InfiniteScroll
          dataLength={articles.length}
          next={fetchMoreData}
          hasMore={articles.length!==totalResults}
          loader={<Spinner/>}
        /> */}
    <div className="row">
      {!loading &&
        articles.map((element) => {
          return (
            <div className="col-md-4" key={element.url}>
              <NewsItem
                Title={element.title ? element.title : ""}
                description={element.description ? element.description : ""}
                imageurl={element.urlToImage}
                newsurl={element.url}
                author={element.author}
                date={element.publishedAt}
                source={element.source.name}
              />
            </div>
          );
        })}
    </div>

    {/* <InfiniteScroll/>  */}

    <div className="container d-flex justify-content-between">
      <button
        disabled={page <= 1}
        type="button"
        className="btn btn-dark"
        onClick={handlepreviousclick}
      >
        &larr; Previous
      </button>
      <button type="button" className="btn btn-dark" onClick={handlenextclick}>
        Next &rarr;
      </button>
    </div>
  </div>
)
      }

News.defaultProps = {
  country: "in",
  pageSize: 8,
  category: "general",
};

News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,
};

export default News;
