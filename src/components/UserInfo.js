import React from "react";
import axios from "axios";
import { Form, InputNumber, Input, Button, Select } from "antd";
const { Option } = Select;

class UserInfoForm extends React.Component {
  state = {
    confirmDirty: false,
    autoCompleteResult: []
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        axios
          .post("/api/users", {
            name: values.name,
            age: values.age,
            weight: values.weight,
            animal_based_food: values.animalBasedFood,
            working_level: values.workingLevel,
            gender: values.gender
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

  handleChange = e => {
    const { setFieldsValue } = this.props.form;
    setFieldsValue({});
  };

  render() {
    const { getFieldDecorator, setFieldsValue } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    };

    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0
        },
        sm: {
          span: 16,
          offset: 8
        }
      }
    };

    return (
      <Form {...formItemLayout} onSubmit={this.handleSubmit}>
        <Form.Item label="Name" hasFeedback>
          {getFieldDecorator("name", {
            rules: [
              {
                required: true
              }
            ]
          })(<Input />)}
        </Form.Item>
        <Form.Item label="Age" hasFeedback>
          {getFieldDecorator("age", {
            rules: [
              {
                required: true
              }
            ]
          })(<InputNumber />)}
        </Form.Item>
        <Form.Item label="Weight" hasFeedback>
          {getFieldDecorator("weight", {
            rules: [
              {
                required: true
              }
            ]
          })(<InputNumber />)}
        </Form.Item>
        <Form.Item label="Has HIV ?" hasFeedback>
          {getFieldDecorator("isHiv", {
            rules: [
              {
                required: true
              }
            ]
          })(
            <Select
              defaultValue="true"
              placeholder="select a value"
              onChange={value => setFieldsValue({ animalBasedFood: value })}
            >
              <Option value="true">Yes</Option>
              <Option value="false">No</Option>
            </Select>
          )}
        </Form.Item>
        <Form.Item label="Animal Based Food" hasFeedback>
          {getFieldDecorator("animalBasedFood", {
            rules: [
              {
                required: true
              }
            ]
          })(
            <Select
              placeholder="select a value"
              onChange={value => setFieldsValue({ animalBasedFood: value })}
            >
              <Option value="VEGETARIAN">Vegetarian</Option>
              <Option value="AVERAGE">Average</Option>
              <Option value="HIGH">High</Option>
            </Select>
          )}
        </Form.Item>
        <Form.Item label="Animal Based Food" hasFeedback>
          {getFieldDecorator("animalBasedFood", {
            rules: [
              {
                required: true
              }
            ]
          })(
            <Select
              placeholder="select a value"
              onChange={value => setFieldsValue({ animalBasedFood: value })}
            >
              <Option value="VEGETARIAN">Vegetarian</Option>
              <Option value="AVERAGE">Average</Option>
              <Option value="HIGH">High</Option>
            </Select>
          )}
        </Form.Item>
        <Form.Item label="Working level" hasFeedback>
          {getFieldDecorator("workingLevel", {
            rules: [
              {
                required: true
              }
            ]
          })(
            <Select
              placeholder="select a value"
              onChange={value => setFieldsValue({ workingLevel: value })}
            >
              <Option value="LOW">Low</Option>
              <Option value="MODERATE">Moderate</Option>
              <Option value="HIGH">High</Option>
            </Select>
          )}
        </Form.Item>
        <Form.Item label="Gender" hasFeedback>
          {getFieldDecorator("gender", {
            rules: [
              {
                required: true
              }
            ]
          })(
            <Select
              placeholder="select a value"
              onChange={value => setFieldsValue({ gender: value })}
            >
              <Option value="MALE">Male</Option>
              <Option value="FEMALE">Female</Option>
            </Select>
          )}
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

const WrappedRegistrationForm = Form.create({ name: "userInfoForm" })(
  UserInfoForm
);

export default WrappedRegistrationForm;
