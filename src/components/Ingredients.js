import React from "react";
import axios from "axios";
import { Form, InputNumber, Input, Button, Icon, Select } from "antd";
const { Option } = Select;

let id = 0;

class IngredientsForm extends React.Component {
  state = {
    ingredients: []
  };

  componentDidMount() {
    axios
      .get("/api/ingredients")
      .then(({ data }) => this.setState({ ingredients: data }));
  }

  remove = k => {
    const { form } = this.props;
    const keys = form.getFieldValue("keys");
    if (keys.length === 1) {
      return;
    }

    form.setFieldsValue({
      keys: keys.filter(key => key !== k)
    });
  };

  add = () => {
    const { form } = this.props;
    const keys = form.getFieldValue("keys");
    const nextKeys = keys.concat(id++);
    form.setFieldsValue({
      keys: nextKeys
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { name, ration, dishIngredientDetails } = values;
        axios
          .post("/api/dishes", {
            name,
            ration,
            dishIngredientDetails
          })
          .then(function(response) {
            console.log(response);
          })
          .catch(function(error) {
            console.log(error);
          });
      }
    });
  };

  render() {
    const {
      getFieldDecorator,
      getFieldValue,
      setFieldsValue
    } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 }
      }
    };
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 4 }
      }
    };
    getFieldDecorator("keys", { initialValue: [] });
    const keys = getFieldValue("keys");
    const formItems = keys.map((k, index) => (
      <Form.Item
        {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
        label={index === 0 ? "Ingredients" : ""}
        required={false}
        key={k}
      >
        {getFieldDecorator(`dishIngredientDetails[${k}].ingredientId`, {
          rules: [
            {
              required: true,
              whitespace: true,
              message: "Please input passenger's name or delete this field."
            }
          ]
        })(
          <Select
            placeholder="select a value"
            onChange={value => setFieldsValue({ ingredientId: value })}
          >
            {this.state.ingredients.map(ingredient => (
              <Option key={ingredient.id} value={`${ingredient.id}`}>
                {ingredient.name}
              </Option>
            ))}
          </Select>
        )}
        {getFieldDecorator(`dishIngredientDetails[${k}].amount`, {
          rules: [
            {
              required: true
            }
          ],
          initialValue: 0
        })(<InputNumber />)}
        {keys.length > 1 ? (
          <Icon
            className="dynamic-delete-button"
            type="minus-circle-o"
            onClick={() => this.remove(k)}
          />
        ) : null}
      </Form.Item>
    ));
    return (
      <Form {...formItemLayout} onSubmit={this.handleSubmit}>
        <Form.Item label="Food Name" hasFeedback>
          {getFieldDecorator("name", {
            rules: [
              {
                required: true
              }
            ]
          })(<Input />)}
        </Form.Item>
        <Form.Item label="Ration" hasFeedback>
          {getFieldDecorator("ration", {
            rules: [
              {
                required: true
              }
            ],
            initialValue: 1
          })(<InputNumber />)}
        </Form.Item>
        {formItems}
        <Form.Item {...formItemLayoutWithOutLabel}>
          <Button type="dashed" onClick={this.add} style={{ width: "60%" }}>
            <Icon type="plus" /> Add field
          </Button>
        </Form.Item>
        <Form.Item {...formItemLayoutWithOutLabel}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

const WrappedRegistrationForm = Form.create({ name: "ingredientsForm" })(
  IngredientsForm
);

export default WrappedRegistrationForm;
