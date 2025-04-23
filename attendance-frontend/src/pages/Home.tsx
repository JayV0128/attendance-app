import React from 'react'
import { useState } from 'react';
import { Routes, Route, useLocation, Link } from 'react-router-dom';
import { PageContainer, ProLayout } from '@ant-design/pro-layout';
import {
    DashboardOutlined,
    VideoCameraOutlined,
    BarChartOutlined,
    SettingOutlined,
} from '@ant-design/icons';

import QRCodeAttendence from './QRCodeAttendence';
import NfcAttendence from './NfcAttendence';
import Addrecord from './Addrecord';
import AllRecord from './Record';

const routes = [
    {
        path: '/NfcAttendence',
        name: 'NFC attendence',
        icon: <DashboardOutlined />,
    },
    {
        path: '/QRCodeAttendence',
        name: 'QR Code attendance',
        icon: <VideoCameraOutlined />,
    },
    {
        path: '/Allrecord',
        name: 'View Records',
        icon: <BarChartOutlined />,
    },
    {
        path: '/addrecord',
        name: 'Add student',
        icon: <SettingOutlined />,
    },
];
const Home = () => {

    const location = useLocation();


    return (
        <ProLayout
            route={{ routes }}
            location={location}
            layout="mix"
            fixedHeader
            fixSiderbar
            title="CS4296 Project NFC/QR Code Attendance System"
            menuItemRender={(item, dom) => (
                <Link to={item.path || '/'}> {dom} </Link>
            )}
        >
            <PageContainer
            >
                <Routes>
                    <Route path="/" element={<QRCodeAttendence />} /> 
                    <Route path="/QRCodeAttendence" element={<QRCodeAttendence />} />
                    <Route path="/NfcAttendence" element={<NfcAttendence />} />
                    <Route path="/addrecord" element={<Addrecord />} />
                    <Route path="/Allrecord" element={<AllRecord />} />
                </Routes>
            </PageContainer>
        </ProLayout>
    );
}

export default Home
