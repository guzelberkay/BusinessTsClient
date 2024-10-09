import React, { useState } from 'react';
import { OrganizationChart, OrganizationChartSelectionChangeEvent } from 'primereact/organizationchart';
import { TreeNode } from 'primereact/treenode';
import 'primereact/resources/themes/saga-blue/theme.css'; // Tema dosyası
import 'primereact/resources/primereact.min.css'; // PrimeReact stil dosyası
import 'primeicons/primeicons.css'; // PrimeReact ikon dosyası

// TreeNode'u genişleten bir arayüz oluşturuyoruz.
interface CustomTreeNode extends TreeNode {
    type?: string;
    data?: {
        image: string;
        name: string;
        title: string;
    };
    children?: CustomTreeNode[]; // children elemanlarını da CustomTreeNode türüne ayarlıyoruz
}

export default function SelectionDemo() {
    const [selection, setSelection] = useState<CustomTreeNode[]>([]);
    const [data] = useState<CustomTreeNode[]>([
        {
            expanded: true,
            type: 'person',
            data: {
                image: 'https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png',
                name: 'Amy Elsner',
                title: 'CEO'
            },
            children: [
                {
                    expanded: true,
                    type: 'person',
                    data: {
                        image: 'https://primefaces.org/cdn/primereact/images/avatar/annafali.png',
                        name: 'Anna Fali',
                        title: 'CMO'
                    },
                    children: [
                        {
                            expanded: true,
                            type: 'person',
                            data: {
                                image: 'https://randomuser.me/api/portraits/men/11.jpg',
                                name: 'Deniz Gumus',
                                title: 'IT'
                            },
                        },
                        {
                            expanded: true,
                            type: 'person',
                            data: {
                                image: 'https://randomuser.me/api/portraits/women/15.jpg',
                                name: 'Mary Jane',
                                title: 'HR'
                            },
                        },
                        {
                            expanded: true,
                            type: 'person',
                            data: {
                                image: 'https://randomuser.me/api/portraits/women/16.jpg',
                                name: 'Emily Stone',
                                title: 'Author'
                            },
                        },
                        {
                            expanded: true,
                            type: 'person',
                            data: {
                                image: 'https://randomuser.me/api/portraits/women/12.jpg',
                                name: 'Jane Doe',
                                title: 'HR'
                            },
                            children: [
                                {
                                    expanded: true,
                                    type: 'person',
                                    data: {
                                        image: 'https://randomuser.me/api/portraits/women/10.jpg',
                                        name: 'Jane Doe',
                                        title: 'HR'
                                    },

                                },
                                {
                                    expanded: true,
                                    type: 'person',
                                    data: {
                                        image: 'https://randomuser.me/api/portraits/men/1.jpg',
                                        name: 'Anthony Stone',
                                        title: 'HR'
                                    },

                                },
                            ]
                        }
                    ]
                },
                {
                    expanded: true,
                    type: 'person',
                    data: {
                        image: 'https://primefaces.org/cdn/primereact/images/avatar/stephenshaw.png',
                        name: 'Stephen Shaw',
                        title: 'CTO'
                    },
                    children: [
                        {
                            expanded: true,
                            type: 'person',
                            data: {
                                image: 'https://randomuser.me/api/portraits/men/10.jpg',
                                name: 'John Doe',
                                title: 'Development Lead'
                            },
                        },
                        {
                            expanded: true,
                            type: 'person',
                            data: {
                                image: 'https://primefaces.org/cdn/primereact/images/avatar/annafali.png',
                                name: 'Emily Clark',
                                title: 'UX Designer'
                            },
                        }
                    ]
                }
            ]
        }
    ]);

    const nodeTemplate = (node: CustomTreeNode) => {
        if (node.type === 'person') {
            return (
                <div className="flex flex-column">
                    <div className="flex flex-column align-items-center">
                        {/* Image boyutlarını burada 50x50 olarak ayarlıyoruz */}
                        <div>
                            <img
                                alt={node.data?.name}
                                src={node.data?.image}
                                style={{
                                    width: '50px',
                                    height: '50px',
                                    borderRadius: '50%'
                                }} // Genişlik ve yükseklik ayarlandı
                                className="mb-3" // Sınıfla ek stil eklemek gerekirse
                            />
                        </div>
                        <div>
                            <span style={{ fontWeight: 'bold' }} className="mb-2">{node.data?.name}</span>
                        </div>
                        <div>
                            <span>{node.data?.title}</span>
                        </div>
                    </div>
                </div>
            );
        }

        return node.label;
    };

    const handleSelectionChange = (e: OrganizationChartSelectionChangeEvent) => {
        if (e.data && Array.isArray(e.data)) {
            setSelection(e.data as CustomTreeNode[]);
        } else {
            setSelection([]);
        }
    };

    return (
        <div className="card overflow-x-auto">
            <OrganizationChart value={data} selectionMode="multiple" selection={selection} onSelectionChange={handleSelectionChange} nodeTemplate={nodeTemplate} />
        </div>
    );
}
