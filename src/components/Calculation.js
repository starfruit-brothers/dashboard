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
    result: { prefills: {} }
  };

  componentDidMount() {
    axios.get("api/dishes").then(result => {
      this.setState({ data: result.data });
    });
  }

  showModal = () => {
    this.setState({
      visible: true
    });
  };

  handleOk = e => {
    console.log(e);
    this.setState({
      visible: false
    });
    Object.keys(this.state.meal).forEach(meal => {
      const preparedData = {
        timeOfDay: this.state.meal[meal],
        dishName: meal,
        dayOfWeek: "Wednesday",
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

  priorities = ["energy", "vitamin c", "lipid", "carbohydrate", "protein"];

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
                res.amount = result.data.result[itemKey];
              });
          this.setState({ calculatedData: result });
          this.showModal();
        });
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
    console.log("onChange prefill", prefill);
    console.log("onChange value", value);
    this.setState({ meal: { ...this.state.meal, [prefill]: value } });
    console.log("state meal", this.state.meal);
  }

  render() {
    console.log("this data", this.state.data);

    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 4 }
      }
    };

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 2 }
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
          <Form.Item {...formItemLayoutWithOutLabel}>
            <Button type="dashed" onClick={this.add} style={{ width: "60%" }}>
              <Icon type="plus" /> Add field
            </Button>
          </Form.Item>
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
          {this.state.result.prefills &&
            Object.keys(this.state.result.prefills).map(prefill => (
              <Button>{prefill}</Button>
            ))}
          {Object.keys(this.state.result.prefills).map(prefill => (
            <Form.Item label={prefill} hasFeedback key={prefill}>
              <Select onChange={value => this.onChange(prefill, value)}>
                <Option value="MORNING">MORNING</Option>
                <Option value="NOON">NOON</Option>
                <Option value="EVENING">EVENING</Option>
              </Select>
            </Form.Item>
          ))}
        </Modal>
      </>
    );
  }
}

const WrappedCalculationForm = Form.create({ name: "userInfoForm" })(
  CalculationForm
);

export default WrappedCalculationForm;
