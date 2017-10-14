import React from 'react';
import Popup from 'react-popup';

Popup.registerPlugin('select', function (title, options, callback) {
    let selectValue = options[0].value;
    let selectChange = function (event) {
      selectValue = event.target.value;
    };

    var optionElements = options.map((option) =>
      (<option key={option.value} value={option.value}>
        {option.label}
      </option>));

    this.create({
        title: title,
        content: (<select onChange={selectChange}>
                    {optionElements}
                  </select>),
        buttons: {
            left: ['cancel'],
            right: [{
                text: 'Select',
                className: 'success',
                action: function () {
                    callback(selectValue);
                    Popup.close();
                }
            }]
        }
    });
});