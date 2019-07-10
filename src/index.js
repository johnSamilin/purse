// @ts-check
import React from 'react';
import rDom from 'react-dom';
import { Purse } from './App';

document.addEventListener('DOMContentLoaded', () => {
    rDom.render(<Purse />, document.querySelector('#purse'));
});
