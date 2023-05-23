import React, { useState, useEffect } from "react";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import {
  Row,
  Col,
  Form,
  Input,
  Button,
  Switch,
  Space,
  Spin,
  Alert,
  Select,
  Collapse,
  notification,
} from "antd";
import { Address, ABI } from "../contracts/factoryContract";
import useCheckIdentity from "../utils/isIdentified";
import {
  FormOutlined,
  UserOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import useCheckKYC from "../utils/isKYC";

const { Option } = Select;
const { Panel } = Collapse;

const CreateVotingForm = () => {
  const [title, setTitle] = useState("");
  const [proposalNames, setProposalNames] = useState([]);
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [isKYC, setIsKYC] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);

  const isUserKYC = useCheckKYC();
  const isVerified = useCheckIdentity();

  const transactionIsSuccess = () => {
    notification.success({
      message: "Транзакция успешна",
      placement: "bottomRight",
    });
  };

  const transactionIsLoading = () => {
    notification.warning({
      message: "Проверьте ваш кошелек",
      placement: "bottomRight",
    });
  };

  const { config } = usePrepareContractWrite({
    address: Address,
    abi: ABI,
    functionName: "createVoting",
    args: [title, proposalNames, durationMinutes, isKYC, isPrivate],
  });

  const { isLoading, isSuccess, write } = useContractWrite(config);

  const durations = [
    { label: "1 час", value: 60 },
    { label: "2 часа", value: 60 * 2 },
    { label: "12 часов", value: 60 * 12 },
    { label: "1 день", value: 60 * 24 },
    { label: "3 дня", value: 60 * 24 * 3 },
    { label: "1 неделя", value: 60 * 24 * 7 },
    { label: "2 недели", value: 60 * 24 * 14 },
    { label: "1 месяц", value: 60 * 24 * 30 },
  ];

  const getDurationInMinutes = (value) => {
    const duration = durations.find((duration) => duration.value === value);
    return duration ? duration.value : 1;
  };

  useEffect(() => {
    if (isLoading) {
      transactionIsLoading();
    }
  }, [isLoading]);

  useEffect(() => {
    if (isSuccess) {
      transactionIsSuccess();
    }
  }, [isSuccess]);

  if (isVerified === undefined) {
    return (
      <Space
        direction="vertical"
        style={{ width: "100%", marginBottom: "50px" }}
      >
        <Spin tip="Ожидается кошелек" size="large">
          <div />
        </Spin>
      </Space>
    );
  }

  if (!isVerified) {
    return (
      <Alert
        style={{ width: "100%", marginBottom: "50px" }}
        message="Вы не зарегестрированы"
        description="Пожалуйста, введите вашу информацию чтобы пользоваться приложением."
        type="warning"
        showIcon
      />
    );
  }

  return (
    <>
      <Collapse accordion style={{marginTop: "20px"}}>
        <Panel header="Создать голосование" key="1">
          <Form layout="vertical">
            <Form.Item
              required={false}
              label="Название"
              name="title"
              tooltip="Название голосования"
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: "Пожалуйста введите название",
                },
              ]}
            >
              <Input
                prefix={<FormOutlined style={{ color: "grey" }} />}
                allowClear
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Item>

            <Form.List
              name="names"
              rules={[
                {
                  validator: async (_, names) => {
                    if (!names || names.length < 2) {
                      return Promise.reject(new Error("Как минимум 2 кандидата"));
                    }
                  },
                },
              ]}
            >
              {(fields, { add, remove }, { errors }) => (
                <>
                  {fields.map((field, index) => (
                    <Form.Item
                      label={index === 0 ? "Кандидаты" : ""}
                      tooltip={index === 0 ? "Кандиды для голосования" : ""}
                      required={false}
                      key={field.key}
                    >
                      <Form.Item
                        {...field}
                        validateTrigger={["onChange", "onBlur"]}
                        rules={[
                          {
                            required: true,
                            whitespace: true,
                            message: "Пожалуйста введите кандидата",
                          },
                        ]}
                        noStyle
                      >
                        <Input
                          style={{}}
                          prefix={<UserOutlined style={{ color: "grey" }} />}
                          allowClear
                          value={proposalNames[index]}
                          onChange={(e) => {
                            const updatedProposalNames = [...proposalNames];
                            updatedProposalNames[index] = e.target.value;
                            setProposalNames(updatedProposalNames);
                          }}
                        />
                      </Form.Item>
                      {fields.length > 2 ? (
                        <MinusCircleOutlined
                          style={{
                            color: "grey",
                            position: "absolute",
                            marginTop: "9px",
                          }}
                          onClick={() => {
                            const updatedProposalNames = [...proposalNames];
                            updatedProposalNames.splice(index, 1);
                            setProposalNames(updatedProposalNames);
                            remove(field.name);
                          }}
                        />
                      ) : null}
                    </Form.Item>
                  ))}
                  <Form.Item style={{ textAlign: "center" }}>
                    <Button
                      type="dashed"
                      onClick={() => {
                        add();
                        const updatedProposalNames = [...proposalNames];
                        updatedProposalNames.push("");
                        setProposalNames(updatedProposalNames);
                      }}
                      style={{
                        width: "50%",
                      }}
                      icon={<PlusOutlined />}
                    >
                      Добавить кандидата
                    </Button>
                    <Form.ErrorList errors={errors} />
                  </Form.Item>
                </>
              )}
            </Form.List>
            <Form.Item>
              <Row justify="center" align="middle">
                <Col xs={24} sm={8} md={12} style={{ textAlign: "center" }}>
                  <>Длительность: </>
                  <Select
                    style={{ width: "110px" }}
                    defaultValue={durations[0].value}
                    onChange={(value) =>
                      setDurationMinutes(getDurationInMinutes(value))
                    }
                  >
                    {durations.map((duration) => (
                      <Option key={duration.value} value={duration.value}>
                        {duration.label}
                      </Option>
                    ))}
                  </Select>
                </Col>
                <Col xs={24} sm={8} md={6} style={{ textAlign: "center" }}>
                  <Switch
                    checkedChildren="ПРИВАТНОЕ"
                    unCheckedChildren="ПУБЛИЧНОЕ"
                    onChange={setIsPrivate}
                  />
                </Col>
                {isUserKYC && (
                  <Col xs={24} sm={8} md={6} style={{ textAlign: "center" }}>
                    <Switch
                      checkedChildren="KYC ON"
                      unCheckedChildren="KYC OFF"
                      onChange={setIsKYC}
                    />
                  </Col>
                )}
              </Row>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                onClick={() => write?.()}
              >
                Развернуть голосование
              </Button>
            </Form.Item>
          </Form>
        </Panel>
      </Collapse>
    </>
  );
};

export default CreateVotingForm;
