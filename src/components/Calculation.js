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

  prepareData() {
    return {
      inputs: this.state.data.map(dishes => {
        return {
          key: dishes.name,
          values: dishes["dish_ingredient_details"].map(ingredient => {
            return { [ingredient.name]: ingredient.amount };
          })
        };
      })
    };
  }

  handleSubmit = e => {
    e.preventDefault();
    axios
      .post("api/calculation", this.prepareData())
      .then(result => console.log("result", result));
  };

  handleChange = (dishId, ingredientId, value) => {
    const dish = this.state.data.find(dish => dish.id === dishId);
    const ingredient = dish["dish_ingredient_details"].find(
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
        sm: { span: 2 }
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
                  defaultValue={1}
                  onChange={this.handleChange}
                />
              </Form.Item>
              {dish["dish_ingredient_details"].map(ingredient => (
                <>
                  <Form.Item
                    label={`${ingredient.name}`}
                    hasFeedback
                    key={ingredient.id}
                  >
                    <Input
                      // addonBefore={this.checkboxBefore}
                      addonAfter={
                        <Icon
                          type="edit"
                          onClick={() =>
                            this.enableInput(dish.id, ingredient.id)
                          }
                        />
                      }
                      defaultValue={ingredient.amount}
                      disabled={
                        !this.state.input[`${dish.id}.${ingredient.id}`]
                      }
                      onChange={e =>
                        this.handleChange(
                          dish.id,
                          ingredient.id,
                          e.target.value
                        )
                      }
                    />
                  </Form.Item>
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
