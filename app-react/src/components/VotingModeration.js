import { useContractWrite, usePrepareContractWrite } from "wagmi";
import { Form, Input, Button, Collapse, notification } from "antd";
import { useState, useEffect } from "react";
import { FormOutlined } from "@ant-design/icons";
import { ABI } from "../contracts/votingContract";

const { Panel } = Collapse;

const VotingModeration = ({ votingAddress }) => {
  const [title, setTitle] = useState("");

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

  const { config: titleConfig } = usePrepareContractWrite({
    address: votingAddress,
    abi: ABI,
    functionName: "moderateTitle",
    args: [title],
  });

  const {
    isLoading,
    isSuccess,
    write: changeTitle,
  } = useContractWrite(titleConfig);

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
  return (
    <>
      <Collapse accordion style={{ marginBottom: "20px" }}>
        <Panel header="Модерация голосования" key="1">
          <Form>
            <Form.Item
              required={false}
              label="Название"
              name="title"
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
            <Form.Item
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              <Button danger htmlType="submit" onClick={() => changeTitle?.()}>
                Изменить название
              </Button>
            </Form.Item>
          </Form>
        </Panel>
      </Collapse>
    </>
  );
};

export default VotingModeration;
