import React from 'react';

const ComboList = (props) => {
  const option = props.option;
  
  return (
    <ul style={{ listStyleType: 'none' }}>
      {option.map((data) => (
        <ListItem key={data} value={data} />
      ))}
    </ul>
  );
};

const ListItem = ({ value }) => {
  return <li>{value}</li>;

};

export default ComboList;
