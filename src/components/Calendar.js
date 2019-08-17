import React from "react";
import axios from "axios";
import faker from "faker";
import "./Calendar.css";
import { Table, Collapse } from "antd";
const { Panel } = Collapse;

class Calendar extends React.Component {
  state = {
    foodCalendarDataSource: [],
    summaryDataSource: [],
    dishes: [],
    visible: false,
    foodCalendarElement: null
  };

  collapseItem = (record, key) => (
    <>
      <Collapse expandIconPosition="rights">
        {record[key].map((dish, i) => (
          <Panel header={`${dish.name} (${dish.amount})`} key={i}>
            <ul>
              {dish.dishIngredientDetails.map(ingredient => (
                <li>
                  {ingredient.ingredientName} {ingredient.amount}g
                </li>
              ))}
            </ul>
          </Panel>
        ))}
      </Collapse>
    </>
  );

  expectedResultItem = (record, key) =>
    Object.keys(record[key]).map(k => (
      <p>
        <strong>{k}</strong>: {record[key][k]}
      </p>
    ));

  componentDidMount() {
    axios
      .get("/api/food-calendar")
      .then(({ data }) => this.setState({ foodCalendarDataSource: data }));
    axios
      .get("/api/dishes")
      .then(({ data }) => this.setState({ dishes: data }));
    const userInfo = JSON.parse(localStorage.getItem("data"));
    const keys = Object.keys(userInfo);
    const expectedResult = { ...userInfo };
    const realResult = {};
    const rating = {};
    const summaryDataSource = keys.map(key => {
      expectedResult[key] = Math.round(expectedResult[key] * 7 * 100) / 100;
      realResult[key] = faker.random.number({ min: 1, max: 500 });
      rating[key] =
        Math.round((realResult[key] / expectedResult[key]) * 100 * 100) / 100;
      return {
        key,
        expectedResult: expectedResult[key],
        realResult: realResult[key],
        rating: rating[key]
      };
    });
    this.setState({
      userInfo,
      summaryDataSource
    });
  }

  render() {
    const foodCalendarColumns = [
      {
        title: "",
        dataIndex: "timeOfDay",
        key: "timeOfDay",
        width: 100,
        render: (text, record) => <strong>{text}</strong>
      },
      {
        title: "Monday",
        dataIndex: "monday",
        key: "monday",
        width: "14.28%",
        render: (text, record) => this.collapseItem(record, "monday")
      },
      {
        title: "Tuesday",
        dataIndex: "tuesday",
        key: "tuesday",
        width: "14.28%",
        render: (text, record) => this.collapseItem(record, "tuesday")
      },
      {
        title: "Wednesday",
        dataIndex: "wednesday",
        key: "wednesday",
        width: "14.28%",
        render: (text, record) => this.collapseItem(record, "wednesday")
      },
      {
        title: "Thursday",
        dataIndex: "thursday",
        key: "thursday",
        width: "14.28%",
        render: (text, record) => this.collapseItem(record, "thursday")
      },
      {
        title: "Friday",
        dataIndex: "friday",
        key: "friday",
        width: "14.28%",
        render: (text, record) => this.collapseItem(record, "friday")
      },
      {
        title: "Saturday",
        dataIndex: "saturday",
        key: "saturday",
        width: "14.28%",
        render: (text, record) => this.collapseItem(record, "saturday")
      },
      {
        title: "Sunday",
        dataIndex: "sunday",
        key: "sunday",
        width: "14.28%",
        render: (text, record) => this.collapseItem(record, "sunday")
      }
    ];

    const summaryColumns = [
      {
        title: "Type",
        dataIndex: "key",
        key: "key",
        render: (text, record) => (
          <strong style={{ textTransform: "capitalize" }}>{record.key}</strong>
        )
      },
      {
        title: "Expected Result (Kcal)",
        dataIndex: "expectedResult",
        key: "expectedResult",
        render: (text, record) => <span>{record.expectedResult}</span>
      },
      {
        title: "Real Result (Kcal)",
        dataIndex: "realResult",
        key: "realResult",
        render: (text, record) => <span>{record.realResult}</span>
      },
      {
        title: "Rating (%)",
        dataIndex: "rating",
        key: "rating",
        render: (text, record) => {
          let color = "good";
          if (record.rating < 75 && record.rating > 50) {
            color = "medium";
          } else if (record.rating < 50) {
            color = "low";
          }
          return (
            <span id="rating" className={color}>
              {record.rating}%
            </span>
          );
        }
      }
    ];

    return (
      <>
        <h2>Food Calendar</h2>
        <Table
          pagination={false}
          dataSource={this.state.foodCalendarDataSource}
          columns={foodCalendarColumns}
        />
        <h2 style={{ marginTop: "2rem" }}>Summary</h2>
        <Table
          pagination={false}
          dataSource={this.state.summaryDataSource}
          columns={summaryColumns}
        />
      </>
    );
  }
}

export default Calendar;
