import React from "react";
import axios from "axios";
import "./Calculation.css";
import { Form, Input, Button, Icon } from "antd";

class CalculationForm extends React.Component {
  state = {
    confirmDirty: false,
    autoCompleteResult: [],
    data: [],
    input: {}
  };

  componentDidMount() {
    axios.get("api/dishes").then(result => {
      this.setState({ data: result.data });
    });
  }

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
    let result = [];
    // inputs: this.state.data.map(dishes => {
    //   return {
    //     key: dishes.name,
    //     values: dishes["dishIngredientDetails"].map(ingredient => {
    //       return { [ingredient.ingredientName]: ingredient.amount };
    //     })
    //   };
    // })
    this.state.data.forEach(dish => {
      result.push({
        key: dish.name,
        values: { ...dish.nutrientMap }
      });
      dish["dishIngredientDetails"].forEach(ingredient => {
        this.state.input[`${dish.id}.${ingredient.id}`] &&
          result.push({
            key: ingredient.ingredientName,
            values: { ...ingredient.nutrientMap }
          });
      });
    });
    return {
      inputs: result,
      requirements: this.req,
      alpha: 0.0001,
      priorities: this.priorities,
      prefills: {
        "nho ta 100 gram": "1"
      }
    };
  }

  handleSubmit = e => {
    e.preventDefault();
    axios
      .post("http://192.168.33.11:8081/calc", this.prepareData())
      .then(result => console.log("result", result));
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

  enableInput = (dishId, ingredientId) => {
    // this.setState({ input: { ...this.state.input } });
    const input = this.state.input;
    input[`${dishId}.${ingredientId}`] = true;
    this.setState({ input });
  };

  render() {
    console.log("this data", this.state.data);
    // const { getFieldDecorator, setFieldsValue } = this.props.form;

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
      <Form {...formItemLayout} onSubmit={this.handleSubmit}>
        {this.state.data.map(dish => {
          return (
            <fieldset>
              <legend>{dish.name}</legend>
              <Form.Item label="Quantity" hasFeedback key={dish.id}>
                <Input
                  type="text"
                  defaultValue={0}
                  // onChange={this.handleChange}
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
                      // addonBefore={this.checkboxBefore}
                      addonAfter={
                        <>
                          <Input
                            // type="edit"
                            // onClick={() =>
                            //   this.enableInput(dish.id, ingredient.id)
                            // }
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
            Submit
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

const WrappedCalculationForm = Form.create({ name: "userInfoForm" })(
  CalculationForm
);

export default WrappedCalculationForm;
