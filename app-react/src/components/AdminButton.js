import React, { useEffect, useState } from "react";
import {
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
import { Address, ABI } from "../contracts/sbtContract";
import useCheckIdentity from "../utils/isIdentified";
import useGetIsAdmin from "../utils/isAdmin";
import {
  Card,
  Modal,
  Form,
  Input,
  Button,
  notification,
} from "antd";

const AdminModeratorButtons = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddingModerator, setIsAddingModerator] = useState(true);
  const isVerified = useCheckIdentity();

  const [addr, setAddr] = useState("");

  const { config: addModeratorConfig } = usePrepareContractWrite({
    address: Address,
    abi: ABI,
    functionName: "addModerator",
    args: [addr],
  });

  const {
    isLoading: AddModeratorLoading,
    isSuccess: AddModeratorSuccess,
    write: addModerator,
  } = useContractWrite(addModeratorConfig);

  const { config: removeModeratorConfig } = usePrepareContractWrite({
    address: Address,
    abi: ABI,
    functionName: "removeModerator",
    args: [addr],
  });

  const {
    isLoading: RemoveModeratorLoading,
    isSuccess: RemoveModeratorSuccess,
    write: removeModerator,
  } = useContractWrite(removeModeratorConfig);

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
    if (AddModeratorLoading) {
      transactionIsLoading();
    }
  }, [AddModeratorLoading]);

  useEffect(() => {
    if (AddModeratorSuccess) {
      transactionIsSuccess();
    }
  }, [AddModeratorSuccess]);

  useEffect(() => {
    if (RemoveModeratorLoading) {
      transactionIsLoading();
    }
  }, [RemoveModeratorLoading]);

  useEffect(() => {
    if (RemoveModeratorSuccess) {
      transactionIsSuccess();
    }
  }, [RemoveModeratorSuccess]);

  //Modal part
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleAddModerator = () => {
    setIsAddingModerator(true);
    showModal();
  };

  const handleRemoveModerator = () => {
    setIsAddingModerator(false);
    showModal();
  };

  const handleOk = () => {
    setIsModalOpen(false);
    if (isAddingModerator) {
      addModerator?.();
    } else {
      removeModerator?.();
    }
  };

  //

  //Admin and Moderator part
  const isAdmin = useGetIsAdmin();
  //
  if (isVerified) {
    return (
      <>
        {isAdmin && (
          <Card style={{ marginTop: "25px" }} title="Панель администратора">
            <Modal
              title={
                isAddingModerator ? "Добавить модератора" : "Удалить модератора"
              }
              open={isModalOpen}
              onOk={handleOk}
              onCancel={() => setIsModalOpen(false)}
            >
              <Form>
                <Form.Item label="Адрес аккаунта" name="username">
                  <Input onChange={(e) => setAddr(e.target.value)} />
                </Form.Item>
              </Form>
            </Modal>
            <div>
              <Button
                danger
                onClick={handleAddModerator}
                style={{ marginRight: "25px" }}
              >
                Добавить модератора
              </Button>
              <Button type="primary" danger onClick={handleRemoveModerator}>
                Удалить модератора
              </Button>
            </div>
          </Card>
        )}
      </>
    );
  }
};

export default AdminModeratorButtons;
