import React from 'react';
import '../ComboList/style.css'

const ComboList = (props) => {
  const option = props.option;
  
  return (
    <ul style={{ listStyleType: 'none' }}>
      {option.map((data, index) => (
        <ListItem key={index} value={data} />
      ))}
    </ul>
  );
};

const ListItem = ({ value }) => {
  return <li>{value}</li>;

};


export default ComboList;
