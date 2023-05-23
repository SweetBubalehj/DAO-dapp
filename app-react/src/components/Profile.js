import React, { useEffect, useState } from "react";
import {
  useContractRead,
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
import { Address, ABI } from "../contracts/sbtContract";
import {
  Card,
  Typography,
  Modal,
  Form,
  Input,
  Button,
  Space,
  Spin,
  Alert,
  notification,
  Avatar,
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import useCheckIdentity from "../utils/isIdentified";
import userImage from "../images/user.svg";

const { Title, Text } = Typography;

const IdentityInfo = () => {
  //Contract part
  const { address } = useAccount();

  const [newUserName, setNewUserName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newAge, setNewAge] = useState(13);
  const [userName, setUserName] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [userAge, setUserAge] = useState("0");
  const [hasKYC, setHasKYC] = useState(null);
  const [roleWeight, setRoleWeight] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isVerified = useCheckIdentity();

  const { config } = usePrepareContractWrite({
    address: Address,
    abi: ABI,
    functionName: "updateDataSoul",
    args: [newUserName, newEmail, newAge],
  });

  const {
    isLoading: UpdateSoulLoading,
    isSuccess: UpdateSoulSuccess,
    write,
  } = useContractWrite(config);

  const { data: identifyInfo } = useContractRead({
    address: Address,
    abi: ABI,
    functionName: "getSoul",
    args: [address],
  });

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

  useEffect(() => {
    if (UpdateSoulLoading) {
      transactionIsLoading();
    }
  }, [UpdateSoulLoading]);

  useEffect(() => {
    if (UpdateSoulSuccess) {
      transactionIsSuccess();
    }
  }, [UpdateSoulSuccess]);

  console.log(identifyInfo);
  useEffect(() => {
    if (identifyInfo && identifyInfo[0] != null) {
      setUserName(identifyInfo[0]);
    } else {
      setUserName("");
    }
    if (identifyInfo && identifyInfo[1] != null) {
      setUserEmail(identifyInfo[1]);
    } else {
      setUserEmail(null);
    }
    if (identifyInfo && identifyInfo[2] != null) {
      setUserAge(identifyInfo[2]);
    } else {
      setUserAge("");
    }
    if (identifyInfo && identifyInfo[3] > 0) {
      setHasKYC(true);
    } else {
      setHasKYC(false);
    }
    if (identifyInfo && identifyInfo[4] > 0) {
      setRoleWeight(identifyInfo[4]);
    } else {
      setRoleWeight(0);
    }
  }, [identifyInfo]);

  //Modal part
  const showModal = () => {
    setNewUserName(userName);
    setNewEmail(userEmail);
    setNewAge(userAge);
    setIsModalOpen(true);
  };

  const handleOk = () => {
    write?.(userName, userEmail, Number(userAge));
    //setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false); // Fixed typo
  };
  //

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
    <Card title="Профиль пользователя">
      {address && (
        <>
          <div
            style={{ display: "flex", alignItems: "center", marginBottom: 24 }}
          >
            <Avatar
              size={90}
              style={{ marginRight: 24 }}
              icon={<img alt="user_img" src={userImage} />}
            />
            <div>
              <Title level={2}>Добро пожаловать, {userName}!</Title>
              <Text>Email: {userEmail}</Text>
              <br />
              <Text>Возраст: {userAge.toString()}</Text>
            </div>
          </div>
          <div style={{ marginBottom: 24 }}>
            {hasKYC ? (
              <Text>Вы обладаете статусом KYC.</Text>
            ) : (
              <Text>
                Вы не обладаете статусом KYC. <br></br>
                Чтобы получить статус KYC, свяжитесь с командой DVotings -{" "}
                <b>kycsupport@dvotings.com</b>.
              </Text>
            )}
            <div>
              {roleWeight && roleWeight > 1 ? (
                <Text>Вы обладаете правами администратора.</Text>
              ) : roleWeight > 0 ? (
                <Text>Вы обладаете правами модератора.</Text>
              ) : null}
            </div>
          </div>
        </>
      )}
      {address && !UpdateSoulLoading && (
        <Button danger onClick={showModal} style={{ marginBottom: 24 }}>
          Изменить профиль
        </Button>
      )}
      <Modal
        title="Edit profile"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okButtonProps={{ disabled: !(newUserName && newEmail && newAge) }}
      >
        <Form>
          <Form.Item label="Имя">
            <Input
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Email">
            <Input
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Возраст">
            <Input value={newAge} onChange={(e) => setNewAge(e.target.value)} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default IdentityInfo;
