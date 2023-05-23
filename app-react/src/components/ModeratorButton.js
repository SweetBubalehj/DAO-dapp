import React, { useEffect, useState } from "react";
import {
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
import { Address, ABI } from "../contracts/sbtContract";
import useGetIsModerator from "../utils/isModerator";
import useCheckIdentity from "../utils/isIdentified";
import {
  Card,
  Modal,
  Form,
  Input,
  Button,
  notification,
  Switch,
} from "antd";

const ModeratorButtons = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [componentDisabled, setComponentDisabled] = useState(false);
  const isVerified = useCheckIdentity();

  const [addrSoul, setAddrSoul] = useState("");

  const { config } = usePrepareContractWrite({
    address: Address,
    abi: ABI,
    functionName: "turnKYC",
    args: [addrSoul, componentDisabled],
  });

  const {
    isLoading: TurnKYCLoading,
    isSuccess: TurnKYCSuccess,
    write,
  } = useContractWrite(config);

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
    if (TurnKYCLoading) {
      transactionIsLoading();
    }
  }, [TurnKYCLoading]);

  useEffect(() => {
    if (TurnKYCSuccess) {
      transactionIsSuccess();
    }
  }, [TurnKYCSuccess]);

  //Modal part
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    write?.();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  //

  //Admin and Moderator part
  const isModerator = useGetIsModerator();
  console.log(isModerator);
  //
  if (isVerified) {
    return (
      <>
        {isModerator && (
          <Card style={{ marginTop: "25px" }} title="Панель модератора">
            <Modal
              title="Настройки KYC аккаунта"
              open={isModalOpen}
              onOk={handleOk}
              onShow={showModal}
              onCancel={handleCancel}
            >
              <Form>
                <Form.Item label="Адрес аккаунта" name="addrSoul">
                  <Input
                    value={addrSoul}
                    onChange={(e) => setAddrSoul(e.target.value)}
                  />
                </Form.Item>

                <Form.Item
                  tooltip="Изменения KYC статуса адреса"
                  label="KYC статус"
                  name="kyc"
                >
                  <Switch
                    checkedChildren="ON"
                    unCheckedChildren="OFF"
                    onChange={setComponentDisabled}
                  />
                </Form.Item>
              </Form>
            </Modal>
            <Button danger onClick={showModal}>
              Настройки KYC
            </Button>
          </Card>
        )}
      </>
    );
  }
};

export default ModeratorButtons;
