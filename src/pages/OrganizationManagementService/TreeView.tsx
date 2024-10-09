import React, { useState } from 'react';
import { OrganizationChart } from 'primereact/organizationchart';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { Card } from '@mui/material';

export default function CustomOrganizationChart() {
    const [data] = useState([
        {
            label: 'CEO',
            expanded: true,
            children: [
                {
                    label: 'Finance Manager',
                    expanded: true,
                    children: [
                        { label: 'Accountant' },
                        { label: 'Auditor' }
                    ]
                },
                {
                    label: 'HR Manager',
                    expanded: true,
                    children: [
                        { label: 'HR Specialist' },
                        { label: 'Recruiter' },
                        { label: 'IT' },
                        { label: 'Manager' }
                    ]
                }
            ]
        }
    ]);

    const nodeTemplate = (node: any) => {
        return (
            <div className="user-card">
                <img alt={node.label} src={`https://robohash.org/${node.label}.png?size=50x50`}
                     className="user-avatar"/>
                <div className="user-info">
                    <h4>{node.label}</h4>
                    <p>Position: {node.label}</p>
                </div>
            </div>
        );
    };

    return (
        <div className="card overflow-x-auto">
        <OrganizationChart value={data} nodeTemplate={nodeTemplate} />
        </div>
    );
}
