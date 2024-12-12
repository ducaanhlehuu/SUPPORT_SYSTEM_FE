import React, { useState } from 'react';
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';

const DateTimePicker = ({dateTime, setDateTime}) => {
  // const [dateTime, setDateTime] = useState(new Date());

  const handleChange = (momentObj) => {
    setDateTime(momentObj.toDate());
  };

  return (
    <div>
      <Datetime
        value={dateTime}
        onChange={handleChange}
      />
    </div>
  );
};

export default DateTimePicker;