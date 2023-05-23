import { Typography, Row, Col, Card, Layout } from "antd";
import blockchainImage from "../images/blockchain.svg";
import clearImage from "../images/clear.svg";
import communityImage from "../images/community.svg";

const { Title, Paragraph } = Typography;
const { Content } = Layout;
const MainPage = () => {
  return (
    <Content style={{ padding: "2em 0" }}>
      <Title level={1} style={{ textAlign: "center", marginTop: "-10px" }}>
        Добро пожаловать в DVotings
      </Title>
      <Paragraph style={{ textAlign: "center", marginBottom: "2em" }}>
        Мы стремимся сделать голосование открытым и прозрачным с помощью
        технологии блокчейн.
      </Paragraph>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={12} lg={8} xl={8}>
          <Card
            bordered={false}
            cover={<img alt="blockchain_img" src={blockchainImage} />}
          >
            <Card.Meta
              style={{
                wordWrap: "break-word",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
              title={
                <Typography.Text
                  style={{
                    wordWrap: "break-word",
                    overflow: "hidden",
                    whiteSpace: "normal",
                    textOverflow: "ellipsis",
                    fontSize: "16px",
                  }}
                >
                  {"Децентрализованное голосование"}
                </Typography.Text>
              }
              description="Безопасное и неподдельное голосование, обеспечиваемое технологией блокчейн."
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={12} lg={8} xl={8}>
          <Card
            bordered={false}
            cover={<img alt="clear_img" src={clearImage} />}
          >
            <Card.Meta
              title={
                <Typography.Text
                  style={{
                    wordWrap: "break-word",
                    overflow: "hidden",
                    whiteSpace: "normal",
                    textOverflow: "ellipsis",
                    fontSize: "16px",
                  }}
                >
                  {"Прозрачность и открытость"}
                </Typography.Text>
              }
              description="Все голоса подсчитываются в открытом виде, обеспечивая максимальную прозрачность."
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={12} lg={8} xl={8}>
          <Card
            bordered={false}
            cover={<img alt="community_img" src={communityImage} />}
          >
            <Card.Meta
              title={
                <Typography.Text
                  style={{
                    wordWrap: "break-word",
                    overflow: "hidden",
                    whiteSpace: "normal",
                    textOverflow: "ellipsis",
                    fontSize: "16px",
                  }}
                >
                  {"Управление сообществом"}
                </Typography.Text>
              }
              description="Участники сообщества могут голосовать и принимать решения вместе."
            />
          </Card>
        </Col>
      </Row>
    </Content>
  );
};

export default MainPage;
