import React, { useState } from "react";
import { Layout, Breadcrumb } from "antd";
import Link from "next/link";
import { MainNav } from "./MainNav";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";

require("./styles.less");

const { Header, Content, Footer, Sider } = Layout;

export const SiderLayout = ({ children, breadcrumbs }: { children: any, breadcrumbs: any }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout hasSider style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(collapsed) => setCollapsed(collapsed)}
      >
        <div className="logo">
          Logo
        </div>
        <MainNav />
      </Sider>

      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0 }}>
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: "trigger",
              onClick: () => setCollapsed(!collapsed),
            }
          )}
        </Header>
        <Content>
          <div
            className="site-layout-background"
            style={{ padding: 24, minHeight: 360 }}
          >
            {children}
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>lfca.earth ©2022</Footer>
      </Layout>
    </Layout>
  );
};


