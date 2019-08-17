import React from "react";
import axios from "axios";
import faker from "faker";
import { Table, Collapse, Button, Modal, Select, Icon } from "antd";
const { Panel } = Collapse;
const { Option } = Select;

class Calendar extends React.Component {
  state = {
    foodCalendarDataSource: [],
    summaryDataSource: [],
    dishes: [],
    visible: false,
    foodCalendarElement: null
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  handleOk = () => {
    const { dayOfWeek, dishId, timeOfDay } = this.state.foodCalendarElement;
    axios
      .post("/api/date_meal_records", {
        dayOfWeek,
        dishId,
        timeOfDay
      })
      .then(() => axios.get("/api/food-calendar"))
      .then(({ data }) =>
        this.setState({ foodCalendarDataSource: data, visible: false })
      )
      .catch(err => console.error(err));
  };

  collapseItem = (record, key) => (
    <>
      <Collapse expandIconPosition="rights">
        {record[key].map((dish, i) => (
          <Panel header={dish.name} key={i} extra={<strong>a:1</strong>}>
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
      <Button
        type="link"
        onClick={() => {
          let foodCalendarElement = {
            timeOfDay: record.timeOfDay,
            dayOfWeek: key,
            dishId: null
          };
          this.setState({ foodCalendarElement, visible: true });
        }}
      >
        + Add
      </Button>
    </>
  );

  componentDidMount() {
    axios
      .get("/api/food-calendar")
      .then(({ data }) => this.setState({ foodCalendarDataSource: data }));
    axios
      .get("/api/dishes")
      .then(({ data }) => this.setState({ dishes: data }));
    const userInfo = JSON.parse(localStorage.getItem("data"));
    const expectedResult = { ...userInfo };
    const realResult = {};
    Object.keys(expectedResult).forEach(key => {
      expectedResult[key] = expectedResult[key] * 7;
      realResult[key] = faker.random.number({ min: 1, max: 500 });
    });
    this.setState({
      userInfo,
      summaryDataSource: [{ ...expectedResult, ...realResult, rating: "50%" }]
    });
  }

  render() {
    const foodCalendarColumns = [
      {
        title: "",
        dataIndex: "timeOfDay",
        key: "timeOfDay"
      },
      {
        title: "Monday",
        dataIndex: "monday",
        key: "monday",
        render: (text, record) => this.collapseItem(record, "monday")
      },
      {
        title: "Tuesday",
        dataIndex: "tuesday",
        key: "tuesday",
        render: (text, record) => this.collapseItem(record, "tuesday")
      },
      {
        title: "Wednesday",
        dataIndex: "wednesday",
        key: "wednesday",
        render: (text, record) => this.collapseItem(record, "wednesday")
      },
      {
        title: "Thursday",
        dataIndex: "thursday",
        key: "thursday",
        render: (text, record) => this.collapseItem(record, "thursday")
      },
      {
        title: "Friday",
        dataIndex: "friday",
        key: "friday",
        render: (text, record) => this.collapseItem(record, "friday")
      },
      {
        title: "Saturday",
        dataIndex: "saturday",
        key: "saturday",
        render: (text, record) => this.collapseItem(record, "saturday")
      },
      {
        title: "Sunday",
        dataIndex: "sunday",
        key: "sunday",
        render: (text, record) => this.collapseItem(record, "sunday")
      }
    ];

    const summaryColumns = [
      {
        title: "What you need",
        dataIndex: "timeOfDay",
        key: "timeOfDay",
        render: (text, record) => <p>hello</p>
      },
      {
        title: "How you fucked up",
        dataIndex: "monday",
        key: "monday",
        render: (text, record) => <p>hello</p>
      },
      {
        title: "Rating",
        dataIndex: "tuesday",
        key: "tuesday",
        render: (text, record) => <p>hello</p>
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
        <Modal
          title="Add Dish"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Select
            showSearch
            style={{ width: 200 }}
            placeholder="select a value"
            optionFilterProp="children"
            onChange={value => {
              const { foodCalendarElement } = this.state;
              this.setState({
                foodCalendarElement: {
                  ...foodCalendarElement,
                  dishId: Number.parseInt(value)
                }
              });
            }}
            filterOption={(input, option) =>
              option.props.children
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            }
          >
            {this.state.dishes.map(dish => (
              <Option key={dish.id} value={`${dish.id}`}>
                {dish.name}
              </Option>
            ))}
          </Select>
        </Modal>
      </>
    );
  }
}

export default Calendar;
