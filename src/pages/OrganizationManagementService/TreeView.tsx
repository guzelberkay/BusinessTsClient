import React, { useEffect, useState } from 'react';
import { OrganizationChart, OrganizationChartSelectionChangeEvent } from 'primereact/organizationchart';
import { TreeNode } from 'primereact/treenode';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { fetchGetEmployeeHierarchy } from '../../store/feature/organizationManagementSlice.tsx';
import { AppDispatch } from '../../store';
import { useDispatch } from 'react-redux';
import { Button } from 'primereact/button'; // PrimeReact Button bileşenini ekliyoruz

interface CustomTreeNode extends TreeNode {
    type?: string;
    data?: {
        id: number;
        image: string;
        name: string;
        title: string;
    };
    children?: CustomTreeNode[];
}

export default function SelectionDemo() {
    const [selection, setSelection] = useState<CustomTreeNode | null>(null);
    const [data2, setData2] = useState<CustomTreeNode[]>([]);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        setLoading(true); // Yükleme durumu başlıyor
        dispatch(fetchGetEmployeeHierarchy())
            .then((response) => {
                if (response.payload && response.payload.data) {
                    setData2(response.payload.data); // Veriyi set ediyoruz
                }
            })
            .finally(() => setLoading(false)); // Yükleme durumu bitti
    }, [dispatch]);

    const nodeTemplate = (node: CustomTreeNode) => (
        <div className="user-card" style={{ position: 'relative' }}>
            {/* Kullanıcı bilgileri */}
            <img alt={node.data?.name} src={`https://robohash.org/${node.data?.name}.png?size=50x50`} className="user-avatar" />
            <div className="user-info">
                <h4>{node.data?.name}</h4>
                <p>Department: {node.data?.title}</p>
            </div>

            {/* Seçili olan düğüme sağ üstte + butonu ekliyoruz */}
            {selection && selection.data?.name === node.data?.name && (
                <Button
                    icon="pi pi-plus"
                    className="p-button-rounded p-button-success p-button-sm"
                    style={{ position: 'absolute', top: '-10px', right: '-10px' }}
                    onClick={() => alert(`Yeni eleman ${node.data?.name}'ın altına eklenecek.`)}
                />
            )}
        </div>
    );

    const handleSelectionChange = (e: OrganizationChartSelectionChangeEvent) => {
        setSelection(e.data as CustomTreeNode || null); // Sadece bir düğüm seçilebilir
    };

    return (
        <div className="card overflow-x-auto">
            {/* Yükleniyor durumunu kontrol ediyoruz */}
            {loading ? (
                <p>Loading...</p> // Yükleniyor mesajı
            ) : (
                // Veri yüklendikten sonra OrganizationChart bileşenini render ediyoruz
                <OrganizationChart
                    value={data2}
                    selectionMode="single" // Sadece bir düğüm seçilebilir
                    selection={selection}
                    onSelectionChange={handleSelectionChange}
                    nodeTemplate={nodeTemplate}
                />
            )}
        </div>
    );
}
