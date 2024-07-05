import renderer from 'react-test-renderer';
import React, { useState, useEffect } from 'react'
import Comp from './comp';

const renderTree = tree => renderer.create(tree);
describe('<Comp>', () => {
  it('should render component', () => {
    expect(renderTree(<Comp 
    />).toJSON()).toMatchSnapshot();
  });
  
});