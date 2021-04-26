import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import "./autocomplete.css";
class Autocomplete extends Component {
  static propTypes = {
    suggestions: PropTypes.instanceOf(Array)
  };

  static defaultProps = {
    suggestions: []
  };

  state = {
    activeSuggestion: null,
    showSuggestions: false,
    userInput: this.props.initialText,
    firstInput: ""
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.initialText !== nextProps.initialText) {
      this.setState({ userInput: nextProps.initialText });
    }
  }

  // Event fired when the input value is changed
  onChange = e => {
    let firstInput = e.currentTarget.value;
    // if (e.target.value)
    this.props.getSuggestions(e.target.value);

    this.setState({
      activeSuggestion: null,
      showSuggestions: true,
      userInput: e.currentTarget.value,
      firstInput
    });
  };

  onClick = (e, i) => {
    this.setState(
      {
        activeSuggestion: null,
        showSuggestions: false,
        userInput: this.props.suggestions[i].result
      },
      this.props.onClick(this.props.suggestions[i].result)
    );
  };

  onKeyDown = e => {
    const {
      state: { activeSuggestion, firstInput },
      props: { suggestions, closeOverLay }
    } = this;

    if (e.keyCode === 27) {
      closeOverLay();
      return this.setState({
        activeSuggestion: null,
        showSuggestions: false
      });
    }
    if (e.keyCode === 13) {
      this.setState({
        activeSuggestion: null,
        showSuggestions: false
      });

      this.props.onClick(this.state.userInput);
    } else if (e.keyCode === 38) {
      if (activeSuggestion === null) {
        return this.setState({
          activeSuggestion: suggestions.length - 1,
          userInput: suggestions[suggestions.length - 1].result
        });
      }

      if (activeSuggestion === 0) {
        return this.setState({
          activeSuggestion: null,
          userInput: firstInput
        });
      }

      this.setState({
        activeSuggestion: activeSuggestion - 1,
        userInput: suggestions[activeSuggestion - 1].result
      });
    } else if (e.keyCode === 40) {
      if (activeSuggestion === null) {
        return this.setState({
          activeSuggestion: 0,
          userInput: suggestions[0].result
        });
      }

      if (activeSuggestion === suggestions.length - 1) {
        return this.setState({
          activeSuggestion: null,
          userInput: firstInput
        });
      }

      this.setState({
        activeSuggestion: activeSuggestion + 1,
        userInput: suggestions[activeSuggestion + 1].result
      });
    }
  };

  renderSuggestionsList = () => {
    const {
      onClick,
      state: { activeSuggestion, userInput, showSuggestions },
      props: { suggestions, lang }
    } = this;

    return suggestions.length && showSuggestions ? (
      <React.Fragment>
        (
        <div className="suggestions">
          {suggestions.map((suggestion, index) => {
            return (
              <div
                className={`row-suggestion ${
                  index === activeSuggestion ? "suggestion-active" : ""
                }`}
                key={suggestion}
                onClick={e => onClick(e, index)}
              >
                <h1>{suggestion.result}</h1>
                <h1 className="in"> {lang == "en" ? "In" : "في"}</h1>
                <h1 className="hint">{suggestion.hint}</h1>
              </div>
            );
          })}
        </div>
      </React.Fragment>
    ) : null;
  };

  render() {
    const {
      onChange,
      onKeyDown,
      state: { userInput },
      props: { locale },
      renderSuggestionsList
    } = this;

    const { suggestions, closeOverLay } = this.props;

    return (
      <div className="container">
        <div className="suggestions-wrapper">
          <div
            className="magnifying-glass"
            onClick={() => this.props.onClick(this.state.userInput)}
          />
          <input
            type="text"
            onChange={onChange}
            onFocus={onChange}
            onKeyDown={onKeyDown}
            value={userInput}
            placeholder={locale.search_box_placeholder}
            style={{
              borderBottomLeftRadius: suggestions.length > 0 && 0,
              borderBottomRightRadius: suggestions.length > 0 && 0
            }}
          />

          {renderSuggestionsList()}
          {Boolean(suggestions.length) && (
            <div className="autocomplete-overlay" onClick={closeOverLay} />
          )}
        </div>
      </div>
    );
  }
}

export default Autocomplete;
