import React from 'react';
import Popup from 'react-popup';
import Select from 'react-select';

/** Prompt plugin */
Popup.registerPlugin('select', function (title, options, callback) {
    let selectValue = null;
    let selectChange = function (value) {
        selectValue = value;
    };

    this.create({
        title: title,
        content: <Select className="Select" value={selectValue} options={options} onChange={selectChange}/>,
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