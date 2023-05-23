import { Layout, Typography, Menu, Col, Row } from "antd";
import { ConnectButton, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiConfig } from "wagmi";
import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import { bscTestnet } from "wagmi/chains";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { publicProvider } from "wagmi/providers/public";
import { configureChains, createClient } from "wagmi";
import { GlobalOutlined } from "@ant-design/icons";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import IdentityInfoForm from "./components/Profile";
import AdminButtons from "./components/AdminButton";
import ModeratorButtons from "./components/ModeratorButton";
import CreateVotingForm from "./components/CreateVotingForm";
import CreateIdentityForm from "./components/СreateIdentity";
import VotingCards from "./components/VotingCards";
import MainPage from "./components/MainPage";
import "@rainbow-me/rainbowkit/styles.css";
import "./App.css";

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

const { chains, provider } = configureChains(
  [bscTestnet],
  [
    jsonRpcProvider({
      rpc: (bscTestnet) => ({
        http: "https://data-seed-prebsc-1-s1.binance.org:8545/",
      }),
    }),
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "My RainbowKit App",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

const App = () => {
  const menuContent = {
    welcome: <MainPage />,
    votings: (
      <>
        <WagmiConfig client={wagmiClient}>
          <CreateVotingForm />
        </WagmiConfig>

        <WagmiConfig client={wagmiClient}>
          <VotingCards />
        </WagmiConfig>

        <WagmiConfig client={wagmiClient}>
          <CreateIdentityForm />
        </WagmiConfig>
      </>
    ),
    profile: (
      <>
        <WagmiConfig client={wagmiClient}>
          <IdentityInfoForm />
        </WagmiConfig>

        <WagmiConfig client={wagmiClient}>
          <AdminButtons />
        </WagmiConfig>

        <WagmiConfig client={wagmiClient}>
          <ModeratorButtons />
        </WagmiConfig>

        <WagmiConfig client={wagmiClient}>
          <CreateIdentityForm />
        </WagmiConfig>
      </>
    ),
  };

  return (
    <Router>
      <Layout style={{ minWidth: "380px", minHeight: "100vh" }}>
        <Header>
          <Row justify="space-between" align="middle">
            <Col
              xs={10}
              sm={8}
              md={8}
              lg={7}
              xl={8}
              xxl={10}
              style={{ display: "flex", alignItems: "center" }}
            >
              <GlobalOutlined
                style={{ fontSize: "25px", color: "white", marginRight: "8px" }}
              />
              <Title level={3} style={{ color: "white", margin: 0 }}>
                DVotings
              </Title>
            </Col>
            <Col xs={6} sm={11} md={10} lg={11} xl={11} xxl={10}>
              <Menu theme="dark" mode="horizontal">
                <Menu.Item key="welcome">
                  <Link to="/">Главная страница</Link>
                </Menu.Item>
                <Menu.Item key="votings">
                  <Link to="/votings">Голосования</Link>
                </Menu.Item>
                <Menu.Item key="profile">
                  <Link to="/profile">Профиль</Link>
                </Menu.Item>
              </Menu>
            </Col>
            <Col xs={8} sm={5} md={6} lg={6} xl={5} xxl={4}>
              <WagmiConfig client={wagmiClient}>
                <RainbowKitProvider chains={chains}>
                  <ConnectButton label="Подключить кошелек" />
                </RainbowKitProvider>
              </WagmiConfig>
            </Col>
          </Row>
        </Header>
        <Content
          className="site-layout"
          style={{
            margin: "0 auto",
            padding: 24,
            minHeight: 360,
            background: "#ffffff",
            width: "90%",
            maxWidth: "1500px",
          }}
        >
          <Row justify="center" gutter={[16, 16]}>
            <Col xs={24} sm={22} md={20} lg={18} xl={16}>
              <Routes>
                <Route path="/" element={<>{menuContent["welcome"]}</>} />
                <Route
                  path="/votings"
                  element={<>{menuContent["votings"]}</>}
                />
                <Route
                  path="/profile"
                  element={<>{menuContent["profile"]}</>}
                />
              </Routes>
            </Col>
          </Row>
        </Content>
        <Footer style={{ textAlign: "center" }}>Copy Right Moldova ©2023 <br></br> Patraman Gheorghi </Footer>
      </Layout>
    </Router>
  );
};

export default App;
