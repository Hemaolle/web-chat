import React from 'react';
import Popup from 'react-popup';

/** The prompt content component (from the react-popup demo at
 http://minutemailer.github.io/react-popup/ */
class Prompt extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            value: this.props.value
        };

        this.onChange = (e) => this._onChange(e);
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.value !== this.state.value) {
            this.props.onChange(this.state.value);
        }
    }

    _onChange(e) {
        let value = e.target.value;

        this.setState({value: value});
    }

    render() {
        return (<input
	        type="text"
	        placeholder={this.props.placeholder}
	        className="mm-popup__input" value={this.state.value}
	        onChange={this.onChange}/>);
    }
}

/** Prompt plugin */
Popup.registerPlugin('prompt', function (title, defaultValue, placeholder, callback) {
    let promptValue = null;
    let promptChange = function (value) {
        promptValue = value;
    };

    console.log("Create prompt plugin");

    this.create({
        title: title,
        content: <Prompt onChange={promptChange} placeholder={placeholder} value={defaultValue} />,
        buttons: {
            left: ['cancel'],
            right: [{
                text: 'Save',
                className: 'success',
                action: function () {
                    callback(promptValue);
                    Popup.close();
                }
            }]
        }
    });
});
