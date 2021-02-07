class QuoteMachine extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loaded: false,
      quotes: [],
      currentQuote: {},
    };

    this.randomQuote = this.randomQuote.bind(this);
  }

  componentDidMount() {
    // Get JSON array containing quotes
    fetch("https://type.fit/api/quotes")
      .then((result) => result.json())
      .then(
        (data) => {
          this.setState({
            loaded: true,
            quotes: data,
          });
          this.randomQuote();
        },
        (error) => {
          this.setState({
            loaded: false,
          });
        }
      );
  }

  randomQuote() {
    const quote = this.state.quotes[
      parseInt(Math.random() * this.state.quotes.length)
    ];

    console.log(`Quote: ${quote.text}, Author: ${quote.author}`);

    this.setState({
      currentQuote: quote,
    });
  }

  render() {
    // Show an asterisk if we haven't loaded the data yet, else show the quote
    const quote = this.state.loaded ? (
      <div>
        <div id="text">{this.state.currentQuote.text}</div>
        <div id="author">{this.state.currentQuote.author}</div>
      </div>
    ) : (
      // 
      <div>
        <span><i className="fas fa-asterisk"></i></span>
      </div>
    );

    const tweetLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      '"' +
        this.state.currentQuote.text +
        '" -' +
        this.state.currentQuote.author
    )}`;

    return (
      <div id="quote-box">
        {quote}
        <div id="button-container">
          <a href="#" id="new-quote" onClick={this.randomQuote}>
            New quote
          </a>
          <a href={tweetLink} id="tweet-quote">
            <i className="fab fa-twitter"></i> Tweet
          </a>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<QuoteMachine />, document.getElementById("root"));
