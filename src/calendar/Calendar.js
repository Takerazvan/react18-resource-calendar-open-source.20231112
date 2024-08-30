import React, {useEffect, useRef, useState} from 'react';
import {DayPilot, DayPilotCalendar, DayPilotNavigator} from "@daypilot/daypilot-lite-react";
import "./Calendar.css";
import {ResourceGroups} from "./ResourceGroups";

const Calendar = () => {
  const calendarRef = useRef();

  const [groups, setGroups] = useState([]);
  const [events, setEvents] = useState([]);
  const [columns, setColumns] = useState([]);
  const [startDate, setStartDate] = useState(DayPilot.Date.today());
  const [selected, setSelected] = useState();

  const [config, setConfig] = useState({
    viewType: "Resources",
    timeRangeSelectedHandling: "Enabled",
    eventDeleteHandling: "Update",
    headerHeight: 40,
  });

  useEffect(() => {

    const data = [
      { name: "Application 1", id: "locations", resources: [
          {name: "Monday", id: "R1"},
          {name: "Tuesday", id: "R2"},
          {name: "Wednesday", id: "R3"},
          {name: "Thursday", id: "R4"},
          {name: "Friday", id: "R5"},
          {name: "Saturday", id: "R6"},
        {name: "Sunday", id: "R7"}
          
        ]
      },
      { name: "Application 2", id: "people", resources: [
        {name: "Monday", id: "R1"},
        {name: "Tuesday", id: "R2"},
        {name: "Wednesday", id: "R3"},
        {name: "Thursday", id: "R4"},
        {name: "Friday", id: "R5"},
        {name: "Saturday", id: "R6"},
        {name: "Sunday", id: "R7"}
        ]
      },
      { name: "Application 3", id: "tools", resources: [
        {name: "Monday", id: "R1"},
        {name: "Tuesday", id: "R2"},
        {name: "Wednesday", id: "R3"},
        {name: "Thursday", id: "R4"},
        {name: "Friday", id: "R5"},
        {name: "Saturday", id: "R6"},
        {name: "Sunday", id: "R7"}
        ]
      },
    ];

    setGroups(data);
    setSelected(data[0]);

  }, []);

  useEffect(() => {
    setColumns(selected?.resources || []);
  }, [selected, groups]);


  useEffect(() => {
    // load events for the visible date (`startDate`) and resources in the selected group (`selected`)
    setEvents([
      {
        id: 1,
        text: "Event 1",
        start: "2024-11-07T10:30:00",
        end: "2024-11-07T13:00:00",
        barColor: "#fcb711",
        resource: "R1"
      },
      {
        id: 2,
        text: "Event 2",
        start: "2024-11-07T09:30:00",
        end: "2024-11-07T11:30:00",
        barColor: "#f37021",
        resource: "R2"
      },
      {
        id: 3,
        text: "Event 3",
        start: "2024-11-07T12:00:00",
        end: "2024-11-07T15:00:00",
        barColor: "#cc004c",
        resource: "R2"
      },
      {
        id: 4,
        text: "Event 4",
        start: "2024-11-07T11:30:00",
        end: "2024-11-07T14:30:00",
        barColor: "#6460aa",
        resource: "R3"
      },
      {
        id: 5,
        text: "Event 5",
        start: "2024-11-07T10:00:00",
        end: "2024-11-07T13:30:00",
        resource: "P2"
      },
      {
        id: 6,
        text: "Event 6",
        start: "2024-11-07T12:30:00",
        end: "2024-11-07T15:30:00",
        barColor: "#f1c232",
        resource: "T3"
      },
    ]);
  }, [startDate, columns]);

  const next = () => {
    const currentDay = startDate.getDay();
    const daysToNextMonday = ((8 + currentDay) % 7);
    setStartDate(startDate.addDays(daysToNextMonday));
  };

  const previous = () => {
    setStartDate(startDate.addDays(-1));
  };

  const onTimeRangeSelected = async args => {
    const modal = await DayPilot.Modal.prompt("Create a new event:", "Event 1");
    calendarRef.current.control.clearSelection();
    if (modal.canceled) { return; }
    setEvents([...events, {
      start: args.start,
      end: args.end,
      id: DayPilot.guid(),
      resource: args.resource,
      text: modal.result
    }]);
  };

  const onEventClick = async args => {
    const modal = await DayPilot.Modal.prompt("Update event text:", args.e.text());
    if (!modal.result) { return; }
    args.e.data.text = modal.result;
    setEvents([...events]);
  };

  const onBeforeHeaderRender = args => {
    args.header.areas = [
      {
        right: "5",
        top: 5,
        width: 30,
        height: 30,
        
        onClick: async args => {
         
        }
      }
    ];
  };

  return (
    <div className={"wrap"}>
      <div className={"left"}>
        <DayPilotNavigator
          selectMode={"Day"}
          showMonths={3}
          skipMonths={3}
          selectionDay={args=>args.day}
          startDate={startDate}
          onTimeRangeSelected={ args => setStartDate(args.day) }
        />
      </div>
      <div className={"calendar"}>

        <div className={"toolbar"}>
          <ResourceGroups onChange={args => setSelected(args.selected)} items={groups}></ResourceGroups>
          <span>Week:</span>
          <button onClick={ev => previous()}>Previous</button>
          <button onClick={ev => next()}>Next</button>
        </div>

        <DayPilotCalendar
          {...config}
          onTimeRangeSelected={onTimeRangeSelected}
          onEventClick={onEventClick}
          onBeforeHeaderRender={onBeforeHeaderRender}
          startDate={startDate}
          events={events}
          columns={columns}
          ref={calendarRef}
        />
      </div>
    </div>
  );
}
export default Calendar;
