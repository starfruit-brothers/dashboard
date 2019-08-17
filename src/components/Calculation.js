import React from "react";
import axios from "axios";
import "./Calculation.css";
import { Form, Input, Button, Icon, Modal, AutoComplete, Select } from "antd";
const { Option } = Select;
class CalculationForm extends React.Component {
  state = {
    confirmDirty: false,
    autoCompleteResult: [],
    data: [],
    input: {},
    popupVisible: false,
    fetchedData: [],
    meal: {},
    result: { prefills: {}, requirements: {} },
    weekday: "Monday"
  };

  componentDidMount() {
    axios.get("api/dishes").then(result => {
      this.setState({ fetchedData: result.data });
    });
  }

  showModal = () => {
    this.setState({
      visible: true
    });
  };

  handleOk = e => {
    this.setState({
      visible: false
    });
    Object.keys(this.state.meal).forEach(meal => {
      const preparedData = {
        timeOfDay: this.state.meal[meal],
        dishName: meal,
        dayOfWeek: this.state.weekday,
        ingredientDetail: [
          ...this.state.data.find(dish => dish.name === meal)
            .dishIngredientDetails
        ],
        amount: this.state.data.find(dish => dish.name === meal).quantity
      };
      axios.post("api/dish_ingredient_calendars", preparedData).then(result => {
        console.log("result", result);
      });
    });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false
    });
  };

  req = {
    energy: 1920.4,
    lipid: 48,
    protein: 89.2,
    carbohydrate: 312.1,
    calcium: 700,
    iron: 39.2,
    zinc: 4.9,
    "vitamin a": 500,
    "vitamin d": 5,
    "vitamin e": 12,
    "vitamin c": 70,
    "vitamin b1": 1,
    "vitamin b2": 1.2,
    "vitamin b12": 2.4
  };

  priorities = ["energy", "lipid", "carbohydrate", "protein"];

  prepareData() {
    let inputs = [];
    // inputs: this.state.data.map(dishes => {
    //   return {
    //     key: dishes.name,
    //     values: dishes["dishIngredientDetails"].map(ingredient => {
    //       return { [ingredient.ingredientName]: ingredient.amount };
    //     })
    //   };
    // })
    this.state.data.forEach(dish => {
      inputs.push({
        key: dish.name,
        values: { ...dish.nutrientMap }
      });
      dish["dishIngredientDetails"].forEach(ingredient => {
        this.state.input[`${dish.id}.${ingredient.id}`] &&
          inputs.push({
            key: ingredient.ingredientName,
            values: { ...ingredient.nutrientMap }
          });
      });
    });
    let prefills = {};
    this.state.data.forEach(dish => {
      dish.quantity && (prefills[dish.name] = dish.quantity);
    });
    const result = {
      inputs,
      requirements: this.req,
      alpha: 0.0001,
      priorities: this.priorities,
      // prefills: {
      //   "nho ta 100 gram": "1",
      //   "nho ta 100 gram": "1",
      // }
      prefills
    };
    this.setState({ result });
    return result;
  }

  handleSubmit = e => {
    e.preventDefault();
    axios
      .post("http://192.168.33.11:8081/calc", this.prepareData())
      .then(result => {
        console.log("result", result);
        Object.keys(result.data.result).forEach(itemKey => {
          const res = this.state.data.find(dish => dish.name === itemKey);
          res
            ? (res.quantity = result.data.result[itemKey])
            : this.state.data.forEach(dish => {
                const res = dish["dishIngredientDetails"].find(
                  ingredient => ingredient.name === itemKey
                );
                res && (res.amount = result.data.result[itemKey]);
              });
        });
        this.setState({ finalResult: result.data.result });
        this.showModal();
      });
  };

  handleChange = (dishId, ingredientId, value) => {
    console.log("dishId", dishId);
    const dish = this.state.data.find(dish => dish.id === dishId);
    const ingredient = dish["dishIngredientDetails"].find(
      ingredient => ingredient.id === ingredientId
    );
    ingredient.amount = value;
    this.setState({});
  };

  handleChangeQuantity = (dishId, value) => {
    console.log("dishId", dishId);
    const dish = this.state.data.find(dish => dish.id === dishId);
    dish.quantity = value;
    this.setState({});
  };

  enableInput = (dishId, ingredientId) => {
    // this.setState({ input: { ...this.state.input } });
    const input = this.state.input;
    input[`${dishId}.${ingredientId}`] = true;
    this.setState({ input });
  };

  onChange(prefill, value) {
    this.setState({ meal: { ...this.state.meal, [prefill]: value } });
  }
  onChangeWeekDay(value) {
    this.setState({ weekday: value });
  }

  onAddDish = value => {
    console.log("value", value);
    const dish = this.state.fetchedData.find(data => data.name === value);
    console.log("dish", dish);
    const newData = [...this.state.data];
    newData.push(dish);
    this.setState({ data: newData });
  };

  render() {
    console.log("this data", this.state.data);

    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 16, offset: 2 }
      }
    };

    const formItemLayout = {
      labelCol: {
        xs: { span: 12 },
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 3 }
      }
    };

    const submitLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0
        },
        sm: {
          span: 16,
          offset: 12
        }
      }
    };

    return (
      <>
        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
          <Form.Item {...formItemLayoutWithOutLabel} label="Please add dish">
            <Select onChange={this.onAddDish}>
              {this.state.fetchedData.map(dish => (
                <Option key={dish.id} value={dish.name}>
                  {dish.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          {this.state.data.map(dish => {
            return (
              <fieldset>
                <legend>{dish.name}</legend>
                <Form.Item label="Quantity" hasFeedback key={dish.id}>
                  <Input
                    type="text"
                    value={dish.quantity}
                    onChange={e =>
                      this.handleChangeQuantity(dish.id, e.target.value)
                    }
                  />
                </Form.Item>
                {dish["dishIngredientDetails"].map(ingredient => (
                  <>
                    <Form.Item
                      label={`${ingredient.ingredientName}`}
                      hasFeedback
                      key={ingredient.id}
                    >
                      <Input
                        addonAfter={
                          <>
                            <Input
                              style={{ width: 20 }}
                              type="checkbox"
                              onChange={() =>
                                this.enableInput(dish.id, ingredient.id)
                              }
                            />
                          </>
                        }
                        defaultValue={ingredient.amount}
                        disabled
                        onChange={e =>
                          this.handleChange(
                            dish.id,
                            ingredient.id,
                            e.target.value
                          )
                        }
                      />
                    </Form.Item>
                    {/* <span className="hint">ASd</span> */}
                  </>
                ))}
              </fieldset>
            );
          })}
          <Form.Item {...submitLayout}>
            <Button type="primary" htmlType="submit">
              Calculate
            </Button>
          </Form.Item>
        </Form>
        <Modal
          title="Basic Modal"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <>
            <p>requirements</p>
            {Object.keys(this.state.result.requirements).map(req => {
              return (
                <p>
                  {req} : {this.state.result.requirements[req]}
                </p>
              );
            })}
          </>
          <Form.Item label={`Choose days`} hasFeedback>
            <Select
              onChange={value => this.onChangeWeekDay(value)}
              style={{ width: 150 }}
              defaultValue="Monday"
            >
              <Option value="Monday">MONDAY</Option>
              <Option value="Tuesday">TUESDAY</Option>
              <Option value="WEDNESDAY">WEDNESDAY</Option>
              <Option value="THURSDAY">THURSDAY</Option>
              <Option value="TuesdFRIDAYay">FRIDAY</Option>
              <Option value="SATURDAY">SATURDAY</Option>
              <Option value="SUNDAY">SUNDAY</Option>
            </Select>
          </Form.Item>

          {Object.keys(this.state.result.prefills).map(prefill => {
            console.log("this.state.result", this.state.finalResult);
            return (
              <Form.Item
                label={`(${this.state.finalResult[prefill]}) ${prefill}`}
                hasFeedback
                key={prefill}
              >
                <Select
                  onChange={value => this.onChange(prefill, value)}
                  style={{ width: 150 }}
                  defaultValue="MORNING"
                >
                  <Option value="MORNING">MORNING</Option>
                  <Option value="NOON">NOON</Option>
                  <Option value="EVENING">EVENING</Option>
                </Select>
              </Form.Item>
            );
          })}
        </Modal>
      </>
    );
  }
}

const WrappedCalculationForm = Form.create({ name: "userInfoForm" })(
  CalculationForm
);

export default WrappedCalculationForm;
